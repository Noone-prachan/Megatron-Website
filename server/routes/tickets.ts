import express from 'express';
import { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } from 'discord.js';

const router = express.Router();

// Initialize Discord bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let botReady = false;

client.once('ready', () => {
  console.log(`✅ Discord bot logged in as ${client.user?.tag}`);
  botReady = true;
});

if (process.env.DISCORD_BOT_TOKEN) {
  client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
    console.error('❌ Failed to login to Discord:', err);
  });
} else {
  console.warn('⚠️ DISCORD_BOT_TOKEN is missing. Bot features (like automatic tickets) are temporarily disabled.');
}

/**
 * POST /api/tickets/create
 * Creates a Discord ticket for a purchase
 */
router.post('/create', async (req, res) => {
  const { productId, productTitle, userId, username } = req.body;

  if (!productId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready yet' });
  }

  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID!);
    const isSellRequest = productId === 'sell';

    // Create a private ticket channel
    const ticketChannel = await guild.channels.create({
      name: isSellRequest ? `sell-${username || userId}-${Date.now().toString().slice(-4)}` : `ticket-${username || userId}-${Date.now().toString().slice(-4)}`,
      type: ChannelType.GuildText,
      parent: process.env.DISCORD_TICKET_CHANNEL_ID, // Category ID
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: userId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ],
    });

    // Send initial message to the ticket
    if (isSellRequest) {
      await ticketChannel.send({
        embeds: [{
          title: '💰 Account Selling Request',
          description: `Hello <@${userId}>! Thank you for choosing Megatron to sell your account. Our staff will assist you with the valuation and process.`,
          fields: [
            {
              name: 'Required Details',
              value: 'To speed up the process, please reply with:\n1. Total Skins Count (and highlight any rare skins like Collector, Legend, Prime, etc.)\n2. Hero Count & current Rank\n3. Screenshots of the profile page and skins list\n4. Your expected price',
              inline: false,
            },
            {
              name: 'Safe Middleman Process',
              value: 'Megatron guarantees a secure transaction using our official middleman system. Do not hand over account details until instructed by our staff.',
              inline: false,
            },
          ],
          color: 0xF5A623, // Orange/amber color
          timestamp: new Date().toISOString(),
        }],
      });
    } else {
      await ticketChannel.send({
        embeds: [{
          title: '🎟️ New Purchase Ticket',
          description: `Hello <@${userId}>! Thank you for your interest in purchasing an account.`,
          fields: [
            {
              name: 'Product',
              value: productTitle || `Product ID: ${productId}`,
              inline: false,
            },
            {
              name: 'Next Steps',
              value: '1. Our team will contact you shortly\n2. Choose your payment method (eSewa, Khalti, IME Pay)\n3. Make the payment\n4. Receive your account details',
              inline: false,
            },
          ],
          color: 0x5865F2,
          timestamp: new Date().toISOString(),
        }],
      });
    }

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

export default router;
