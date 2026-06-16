import express from 'express';
import { ChannelType, PermissionFlagsBits, TextChannel, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { discordClient as client, botReady } from '../discordClient';
import { z } from 'zod';

const router = express.Router();

// Store active SSE connections mapped by ticketId
export const chatClients = new Map<string, express.Response[]>();

// Broadcast a message to all connected SSE clients for a specific ticket
export const broadcastToTicket = (ticketId: string, data: any) => {
  const clients = chatClients.get(ticketId);
  if (clients && clients.length > 0) {
    clients.forEach(res => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
};

const initChatSchema = z.object({
  username: z.string().min(1),
  userId: z.string().optional()
});

/**
 * POST /api/chat/init
 * Creates a Discord ticket channel for Live Chat
 */
router.post('/init', async (req, res) => {
  let validatedData;
  try {
    validatedData = initChatSchema.parse(req.body);
  } catch (error: any) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const { username, userId } = validatedData;

  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready' });
  }

  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID!);
    const parentCategory = process.env.DISCORD_SUPPORT_CATEGORY_ID; // Chat Category ID

    const ticketIdStr = Date.now().toString().slice(-4);
    const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 16) || 'user';
    const ticketName = `chat-${cleanUsername}-${ticketIdStr}`;

    const permissionOverwrites: any[] = [
      {
        id: guild.id,
        type: 0, // Role
        deny: [PermissionFlagsBits.ViewChannel],
      }
    ];

    if (userId) {
      permissionOverwrites.push({
        id: userId,
        type: 1, // Member
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      });
    }

    const ticketChannel = await guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: parentCategory,
      topic: `Creator: ${userId ? `<@${userId}>` : username}`,
      permissionOverwrites,
    });

    const embedDescription = `Welcome **${username}**!\n\nThis is a live chat session. Staff will reply here, and it will be sent directly to the website widget.`;

    const messagePayload: any = {
      content: `<@&1486401825669382215> New Live Chat started by ${userId ? `<@${userId}>` : username}`,
      embeds: [{
        author: { name: username },
        title: '<a:coolannounce:1508500386783170651> Live Chat Ticket',
        description: embedDescription,
        color: 0x2B2D31,
        timestamp: new Date().toISOString(),
      }],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('claim_ticket')
            .setLabel('Claim Ticket')
            .setStyle(ButtonStyle.Success)
            .setEmoji('1510067613483667477'), // <a:crown:1510067613483667477>
          new ButtonBuilder()
            .setCustomId('solve_ticket')
            .setLabel('Mark as Solved')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('1510067600682520638') // <a:hash:1510067600682520638>
        )
      ]
    };

    await ticketChannel.send(messagePayload);

    res.json({
      success: true,
      ticketId: ticketChannel.id,
    });
  } catch (error: any) {
    console.error('Error creating chat ticket:', error);
    res.status(500).json({ error: 'Failed to create chat ticket', message: error.message });
  }
});

const sendChatSchema = z.object({
  ticketId: z.string().min(1),
  message: z.string().min(1),
  username: z.string().min(1),
});

/**
 * POST /api/chat/send
 * Sends a message from the website to the Discord ticket
 */
router.post('/send', async (req, res) => {
  let validatedData;
  try {
    validatedData = sendChatSchema.parse(req.body);
  } catch (error: any) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const { ticketId, message, username } = validatedData;

  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready' });
  }

  try {
    const channel = await client.channels.fetch(ticketId).catch(() => null);
    if (!channel || channel.type !== ChannelType.GuildText) {
      return res.status(404).json({ error: 'Ticket channel not found', code: 'CHANNEL_NOT_FOUND' });
    }

    await (channel as TextChannel).send(`**[Website - ${username}]**: ${message}`);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ error: 'Failed to send message', message: error.message });
  }
});

/**
 * GET /api/chat/stream
 * SSE endpoint for the frontend to listen for staff replies
 */
router.get('/stream', (req, res) => {
  const { ticketId } = req.query;

  if (!ticketId || typeof ticketId !== 'string') {
    return res.status(400).json({ error: 'ticketId is required' });
  }

  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connected event
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

  // Add client to the map
  let clients = chatClients.get(ticketId) || [];
  clients.push(res);
  chatClients.set(ticketId, clients);

  // Clean up on disconnect
  req.on('close', () => {
    let activeClients = chatClients.get(ticketId) || [];
    activeClients = activeClients.filter(c => c !== res);
    if (activeClients.length === 0) {
      chatClients.delete(ticketId);
    } else {
      chatClients.set(ticketId, activeClients);
    }
  });
});

export default router;
