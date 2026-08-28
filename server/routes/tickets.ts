import express from 'express';
import { ChannelType, PermissionFlagsBits, ForumChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import axios from 'axios';
import { discordClient as client, botReady } from '../discordClient';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const createTicketSchema = z.object({
  product: z.object({
    id: z.string(),
    title: z.string().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    level: z.number().optional(),
    collectionRank: z.string().optional(),
    skins: z.number().optional(),
    heroes: z.number().optional(),
    image: z.string().optional(),
  }),
  userId: z.string().min(1),
  username: z.string().optional(),
  playerId: z.string().optional(),
  serverId: z.string().optional()
});

const ticketLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 tickets per windowMs
  message: { error: 'Too many tickets created from this IP, please try again after 15 minutes.' }
});

/**
 * POST /api/tickets/create
 * Creates a Discord ticket for a purchase
 */
router.post('/create', ticketLimiter, async (req, res) => {
  let validatedData;
  try {
    validatedData = createTicketSchema.parse(req.body);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: (error as any).errors });
    }
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { product, userId, username, playerId, serverId } = validatedData;

  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready yet' });
  }

  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID!);
    const isSellRequest = product.id === 'sell';
    const isTopupRequest = !isSellRequest && (
      (product.type && product.type !== 'account') ||
      (!product.type && (product.title?.toLowerCase().includes('uc') || product.title?.toLowerCase().includes('diamond') || product.title?.toLowerCase().includes('pubg') || product.title?.toLowerCase().includes('mlbb')))
    );
    const parentCategory = isSellRequest
      ? process.env.DISCORD_SELL_TICKET_CHANNEL_ID
      : isTopupRequest
        ? '1509102472747290665'
        : process.env.DISCORD_TICKET_CHANNEL_ID;

    const ticketIdStr = Date.now().toString().slice(-4);
    const cleanUsername = (username || userId).replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 16) || 'user';
    const ticketName = `${cleanUsername}-${isSellRequest ? 'sell' : isTopupRequest ? 'topup' : 'buy'}-${ticketIdStr}`;

    // Create a private ticket channel
    const ticketChannel = await guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: parentCategory, // Category ID
      topic: `Creator: <@${userId}>`,
      permissionOverwrites: [
        {
          id: guild.id,
          type: 0, // Role
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: userId,
          type: 1, // Member
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ],
    });

    // Send initial message to the ticket
    const embedDescription = isSellRequest 
      ? `Welcome <@${userId}>!\n\nThank you for creating a support ticket. Our team will assist you shortly.\n\n**<a:hash:1510067600682520638> Category:** Account Sell\n**<a:diamond:1510067602641129615> Ticket ID:** ${ticketIdStr}\n\n**<a:coolannounce:1508500386783170651> Required Details:**\nTo speed up the process, please reply with:\n<a:arrow:1510067622840897616> Total Skins Count & rare skins\n<a:arrow:1510067622840897616> Hero Count & current Rank\n<a:arrow:1510067622840897616> Screenshots of the profile\n<a:arrow:1510067622840897616> Your expected price`
      : isTopupRequest
        ? `Welcome <@${userId}>!\n\nThank you for creating a top-up ticket. Our team will assist you shortly.\n\n**<a:hash:1510067600682520638> Category:** ${['netflix', 'crunchyroll', 'playstation', 'steam', 'apple'].includes(product.type || '') ? 'Subscription / Gift Card' : 'Currency Top-Up'}\n**<a:diamond:1510067602641129615> Ticket ID:** ${ticketIdStr}\n**<a:cart:1508500534049374319> Product:** ${product.title || product.id}\n**<a:coin:1510067577853050880> Price:** Rs. ${product.price}\n${playerId ? `**<a:arrow:1510067622840897616> Player ID:** ${playerId}\n` : ''}${serverId ? `**<a:arrow:1510067622840897616> Server ID:** ${serverId}\n` : ''}\n\n**<a:coolannounce:1508500386783170651> Required Details:**\nPlease reply with your:\n${['pubg-uc', 'mlbb-diamonds', 'valo-points', 'fortnite'].includes(product.type || '') ? '<a:arrow:1510067622840897616> Game ID / Player ID\n' : ''}<a:arrow:1510067622840897616> Screenshot of your payment/profile\n\nOur team will process your order shortly!`
        : `Welcome <@${userId}>!\n\nThank you for creating a support ticket. Our team will assist you shortly.\n\n**<a:hash:1510067600682520638> Category:** Account Buy\n**<a:diamond:1510067602641129615> Ticket ID:** ${ticketIdStr}\n**<a:cart:1508500534049374319> Product:** ${product.title || product.id}\n\nOur team will contact you shortly to process your payment and deliver the account details.`;

    const claimButton = new ButtonBuilder()
      .setCustomId('claim_ticket')
      .setLabel('Claim Ticket')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🙋‍♂️');

    const closeButton = new ButtonBuilder()
      .setCustomId('solve_ticket')
      .setLabel('Close Ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒');

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(claimButton, closeButton);

    const messagePayload: any = {
      content: `<@${userId}> <@&1486401825669382215>`,
      embeds: [{
        author: {
          name: username || 'User',
        },
        title: '<a:crown:1510067613483667477> Support Ticket',
        description: embedDescription,
        color: 0x2B2D31, // Dark Discord color
        timestamp: new Date().toISOString(),
      }],
      components: [actionRow],
    };

    // If it's a buy request and we have product data, attach a rich embed
    if (!isSellRequest && product.title) {
      const isAccount = !isTopupRequest;
      const productEmbed: any = {
        title: `<a:diamond:1510067602641129615> ${product.title}`,
        description: isAccount
          ? `**<a:cart:1508500534049374319> Buyer is interested in this account.**\n\n${product.description}`
          : `**<a:cart:1508500534049374319> Buyer is interested in this top-up.**\n\n${product.description}`,
        fields: isAccount
          ? [
              { name: '<a:coin:1510067577853050880> Price', value: `**Rs. ${product.price}**`, inline: true },
              { name: '<a:stars:1510067630579388427> Level', value: `**${product.level}**`, inline: true },
              { name: '<a:crown:1510067613483667477> Rank', value: `**${product.collectionRank}**`, inline: true },
              { name: '<a:sakura:1508500342856355930> Skins', value: `**${product.skins || 0}**`, inline: true },
              { name: '<a:hash:1510067600682520638> Heroes', value: `**${product.heroes || 0}**`, inline: true },
            ]
          : [
              { name: '<a:coin:1510067577853050880> Price', value: `**Rs. ${product.price}**`, inline: true },
              ...(playerId ? [{ name: '🎮 Player ID', value: `**${playerId}**`, inline: true }] : []),
              ...(serverId ? [{ name: '🌐 Server ID', value: `**${serverId}**`, inline: true }] : []),
            ],
        color: 0xbef264,
      };

      if (product.image) {
        if (product.image.startsWith('data:image')) {
          const matches = product.image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (matches) {
            const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            
            messagePayload.files = [{
              attachment: buffer,
              name: `product.${extension}`
            }];
            productEmbed.image = { url: `attachment://product.${extension}` };
          }
        } else if (product.image.startsWith('http')) {
          productEmbed.image = { url: product.image };
        }
      }
      messagePayload.embeds.push(productEmbed);
    }

    await ticketChannel.send(messagePayload);

    // Notify admin channel / category channel
    const adminChannel = await guild.channels.fetch(process.env.DISCORD_TICKET_CHANNEL_ID!);
    if (adminChannel?.isTextBased()) {
      await adminChannel.send({
        content: `🔔 New ticket created: ${ticketChannel}`,
        embeds: [{
          title: isSellRequest ? 'New Sell Request' : 'New Purchase Request',
          fields: [
            { name: 'User', value: `<@${userId}> (${username || 'Unknown'})`, inline: true },
            { name: 'Request Type', value: isSellRequest ? 'Account Selling' : (product.title || product.id), inline: true },
            { name: 'Ticket Channel', value: ticketChannel.toString(), inline: true },
          ],
          color: isSellRequest ? 0xf5a623 : 0x00ff00,
        }],
      });
    }

    res.json({
      success: true,
      ticketId: ticketChannel.id,
      ticketUrl: `https://discord.com/channels/${guild.id}/${ticketChannel.id}`,
      message: 'Ticket created successfully. Please check Discord!',
    });
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      error: 'Failed to create ticket',
      message: error.message
    });
  }
});

/**
 * GET /api/tickets/guild-stats
 * Fetches real-time Discord statistics (total registered members and online members)
 */
router.get('/guild-stats', async (req, res) => {
  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready yet' });
  }

  try {
    const guildId = process.env.DISCORD_GUILD_ID!;
    const guild = await client.guilds.fetch(guildId);
    
    // Total registered members
    const totalMembers = guild.memberCount;

    // Fetch online presence count
    let onlineMembers = 0;
    let channels = [];
    let members = [];
    try {
      const widgetRes = await axios.get(`https://discord.com/api/guilds/${guildId}/widget.json`);
      onlineMembers = widgetRes.data.presence_count || 0;
      channels = widgetRes.data.channels || [];
      members = widgetRes.data.members || [];
    } catch (widgetError) {
      console.warn('Failed to fetch widget stats, using fallback:', widgetError);
      try {
        const preview = await guild.fetchPreview();
        onlineMembers = preview.approximatePresenceCount || 0;
      } catch (previewErr) {
        onlineMembers = Math.round(totalMembers * 0.15); 
      }
    }

    res.json({
      success: true,
      totalMembers,
      onlineMembers,
      channels,
      members
    });
  } catch (error: any) {
    console.error('Error fetching guild stats:', error);
    res.status(500).json({
      error: 'Failed to fetch guild stats',
      message: error.message
    });
  }
});


const closeTicketSchema = z.object({
  ticketId: z.string().min(1)
});

/**
 * POST /api/tickets/close
 * Closes a Discord ticket
 */
router.post('/close', async (req, res) => {
  let validatedData;
  try {
    validatedData = closeTicketSchema.parse(req.body);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: (error as any).errors });
    }
    return res.status(400).json({ error: 'Invalid request' });
  }

  const { ticketId } = validatedData;

  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID!);
    const channel = await guild.channels.fetch(ticketId);

    if (!channel) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await channel.delete('Ticket closed');
    res.json({ success: true, message: 'Ticket closed successfully' });
  } catch (error) {
    console.error('Error closing ticket:', error);
    res.status(500).json({ error: 'Failed to close ticket' });
  }
});

const announceSchema = z.object({
  product: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    level: z.number(),
    collectionRank: z.string(),
    skins: z.number(),
    heroes: z.number(),
    image: z.string().optional()
  })
});

/**
 * POST /api/tickets/announce
 * Sends an announcement for a new product listing
 */
router.post('/announce', async (req, res) => {
  let validatedData;
  try {
    validatedData = announceSchema.parse(req.body);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: (error as any).errors });
    }
    return res.status(400).json({ error: 'Invalid request' });
  }

  const { product } = validatedData;
  
  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready' });
  }

  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID!);
    const channelId = process.env.ANNOUNCEMENT_CHANNEL_ID;
    if (!channelId) {
      return res.status(400).json({ error: 'ANNOUNCEMENT_CHANNEL_ID is not set' });
    }
    
    const channel = await guild.channels.fetch(channelId);
    
    if (channel?.isTextBased()) {
      const messagePayload: any = {
        content: `<a:coolannounce:1508500386783170651> **New Account Listed!** <a:coolannounce:1508500386783170651>\n||@everyone||`,
        embeds: [{
          title: `<a:diamond:1510067602641129615> ${product.title}`,
          description: `**<a:rightarrow:1508500500604256370> A premium account has just dropped in the Megatron Marketplace!**\n\n${product.description}\n\n**<a:cart:1508500534049374319> Grab it before it's sold!**`,
          fields: [
            { name: '<a:coin:1510067577853050880> Price', value: `**Rs. ${product.price}**`, inline: true },
            { name: '<a:stars:1510067630579388427> Level', value: `**${product.level}**`, inline: true },
            { name: '<a:crown:1510067613483667477> Rank', value: `**${product.collectionRank}**`, inline: true },
            { name: '<a:sakura:1508500342856355930> Skins', value: `**${product.skins}**`, inline: true },
            { name: '<a:hash:1510067600682520638> Heroes', value: `**${product.heroes}**`, inline: true },
          ],
          color: 0x5865F2, // Discord Blurple
          footer: {
            text: 'Megatron Marketplace',
          },
          timestamp: new Date().toISOString(),
        }],
      };

      if (product.image) {
        if (product.image.startsWith('data:image')) {
          const matches = product.image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (matches) {
            const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            
            messagePayload.files = [{
              attachment: buffer,
              name: `product.${extension}`
            }];
            messagePayload.embeds[0].image = { url: `attachment://product.${extension}` };
          }
        } else if (product.image.startsWith('http')) {
          messagePayload.embeds[0].image = { url: product.image };
        }
      }

      await channel.send(messagePayload);
      res.json({ success: true, message: 'Announcement sent successfully' });
    } else {
      res.status(400).json({ error: 'Announcement channel not found or not text-based' });
    }
  } catch (error: any) {
    console.error('Error sending announcement:', error);
    res.status(500).json({ error: 'Failed to send announcement', message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────
// Forum Post endpoints for account-listing channel
// ─────────────────────────────────────────────────────────────────

const forumPostSchema = z.object({
  product: z.object({
    title: z.string(),
    dedicatedId: z.string().optional(),
    price: z.number(),
    image: z.string().optional(),
  })
});

/**
 * POST /api/tickets/forum-post
 * Creates a new Forum thread in the account-listing channel when an account is listed.
 * Returns the threadId so it can be saved on the product for later sold/close actions.
 */
router.post('/forum-post', async (req, res) => {
  let validatedData;
  try {
    validatedData = forumPostSchema.parse(req.body);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    return res.status(400).json({ error: 'Invalid request' });
  }

  const { product } = validatedData;

  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready' });
  }

  const forumChannelId = process.env.ACCOUNT_LISTING_FORUM_ID;
  if (!forumChannelId) {
    return res.status(400).json({ error: 'ACCOUNT_LISTING_FORUM_ID is not configured in server/.env' });
  }

  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID!);
    const forumChannel = await guild.channels.fetch(forumChannelId);

    if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
      return res.status(400).json({ error: 'The configured channel is not a Forum channel' });
    }

    const forum = forumChannel as ForumChannel;

    // Post body format matching the existing Discord posts:
    // Line 1: {dedicatedId}
    // Line 2: Available for 💰 {price}/-
    // Line 3: Create a ticket to purchase.
    const dedicatedId = product.dedicatedId || '';
    const postBody = [
      dedicatedId,
      `Available for <:cash:1508502997024378951> ${product.price}/-`,
      `Create a ticket to purchase.`,
    ].filter(Boolean).join('\n');

    const messagePayload: any = { content: postBody };

    if (product.image) {
      if (product.image.startsWith('data:image')) {
        const matches = product.image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          messagePayload.files = [{ attachment: buffer, name: `account.${extension}` }];
        }
      } else if (product.image.startsWith('http')) {
        // Append URL as a second line so Discord auto-embeds the image
        messagePayload.content += `\n${product.image}`;
      }
    }

    // Create the forum thread — title is the product title (e.g. "Renowned Collector-III")
    const thread = await forum.threads.create({
      name: product.title,
      message: messagePayload,
    });

    res.json({
      success: true,
      threadId: thread.id,
      threadUrl: `https://discord.com/channels/${guild.id}/${thread.id}`,
    });
  } catch (error: any) {
    console.error('Error creating forum post:', error);
    res.status(500).json({ error: 'Failed to create forum post', message: error.message });
  }
});

const forumSoldSchema = z.object({
  threadId: z.string().min(1),
});

/**
 * POST /api/tickets/forum-sold
 * Renames a forum thread to "SOLD" and archives (closes) it.
 */
router.post('/forum-sold', async (req, res) => {
  let validatedData;
  try {
    validatedData = forumSoldSchema.parse(req.body);
  } catch (error: any) {
     if (error instanceof z.ZodError) {
       return res.status(400).json({ error: 'Invalid input', details: error.issues });
     }
    return res.status(400).json({ error: 'Invalid request' });
  }

  const { threadId } = validatedData;

  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready' });
  }

  try {
    const thread = await client.channels.fetch(threadId);
    if (!thread || !('setName' in thread)) {
      return res.status(404).json({ error: 'Forum thread not found' });
    }

    // Rename to SOLD then lock and archive (close) the post
    await (thread as any).edit({
      name: 'SOLD',
      locked: true,
      archived: true
    }, 'Account sold via website');

    res.json({ success: true, message: 'Forum post marked as SOLD and closed.' });
  } catch (error: any) {
    console.error('Error marking forum post as sold:', error);
    res.status(500).json({ error: 'Failed to update forum post', message: error.message });
  }
});

/**
 * POST /api/tickets/forum-unavailable
 * Renames a forum thread to "NOT AVAILABLE" and archives (closes) it.
 */
router.post('/forum-unavailable', async (req, res) => {
  const schema = z.object({ threadId: z.string().min(1) });
   let validatedData;
   try {
     validatedData = schema.parse(req.body);
   } catch (error: any) {
     if (error instanceof z.ZodError) {
       return res.status(400).json({ error: 'Invalid input', details: error.issues });
     }
     return res.status(400).json({ error: 'Invalid request' });
   }

  const { threadId } = validatedData;

  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready' });
  }

  try {
    const thread = await client.channels.fetch(threadId);
    if (!thread || !('setName' in thread)) {
      return res.status(404).json({ error: 'Forum thread not found' });
    }

    await (thread as any).edit({
      name: 'NOT AVAILABLE',
      locked: true,
      archived: true
    }, 'Account marked not available via website');

    res.json({ success: true, message: 'Forum post marked as NOT AVAILABLE and closed.' });
  } catch (error: any) {
    console.error('Error marking forum post as not available:', error);
    res.status(500).json({ error: 'Failed to update forum post', message: error.message });
  }
});

export default router;
