import express from 'express';
import { ChannelType, PermissionFlagsBits } from 'discord.js';
import axios from 'axios';
import { discordClient as client, botReady } from '../discordClient';

const router = express.Router();

/**
 * POST /api/tickets/create
 * Creates a Discord ticket for a purchase
 */
router.post('/create', async (req, res) => {
  const { product, userId, username } = req.body;

  if (!product || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready yet' });
  }

  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID!);
    const isSellRequest = product.id === 'sell';
    const parentCategory = isSellRequest
      ? process.env.DISCORD_SELL_TICKET_CHANNEL_ID
      : process.env.DISCORD_TICKET_CHANNEL_ID;

    const ticketIdStr = Date.now().toString().slice(-4);
    const cleanUsername = (username || userId).replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 16) || 'user';
    const ticketName = `${cleanUsername}-${isSellRequest ? 'sell' : 'buy'}-${ticketIdStr}`;

    // Create a private ticket channel
    const ticketChannel = await guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: parentCategory, // Category ID
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
      : `Welcome <@${userId}>!\n\nThank you for creating a support ticket. Our team will assist you shortly.\n\n**<a:hash:1510067600682520638> Category:** Account Buy\n**<a:diamond:1510067602641129615> Ticket ID:** ${ticketIdStr}\n**<a:cart:1508500534049374319> Product:** ${product.title || product.id}\n\nOur team will contact you shortly to process your payment and deliver the account details.`;

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
    };

    // If it's a buy request and we have product data, attach a rich embed
    if (!isSellRequest && product.title) {
      const productEmbed: any = {
        title: `<a:diamond:1510067602641129615> ${product.title}`,
        description: `**<a:cart:1508500534049374319> Buyer is interested in this account.**\n\n${product.description}`,
        fields: [
          { name: '<a:coin:1510067577853050880> Price', value: `**Rs. ${product.price}**`, inline: true },
          { name: '<a:stars:1510067630579388427> Level', value: `**${product.level}**`, inline: true },
          { name: '<a:crown:1510067613483667477> Rank', value: `**${product.collectionRank}**`, inline: true },
          { name: '<a:sakura:1508500342856355930> Skins', value: `**${product.skins || 0}**`, inline: true },
          { name: '<a:hash:1510067600682520638> Heroes', value: `**${product.heroes || 0}**`, inline: true },
        ],
        color: 0xbef264, // App Accent Color
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
            { name: 'Request Type', value: isSellRequest ? 'Account Selling' : (productTitle || productId), inline: true },
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


/**
 * POST /api/tickets/close
 * Closes a Discord ticket
 */
router.post('/close', async (req, res) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    return res.status(400).json({ error: 'Missing ticket ID' });
  }

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

/**
 * POST /api/tickets/announce
 * Sends an announcement for a new product listing
 */
router.post('/announce', async (req, res) => {
  const { product } = req.body;
  
  if (!product || !botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready or missing product data' });
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

export default router;
