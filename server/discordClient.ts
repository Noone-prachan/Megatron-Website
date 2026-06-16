import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { broadcastToTicket } from './routes/chat';
import { ReviewService } from './services/reviewService';
import { parseReviewMessage } from './utils/reviewParser';
import { adminWhitelistService } from './services/adminWhitelistService';
import { auditService } from './services/auditService';
import { banService } from './services/banService';

export const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export let botReady = false;

discordClient.once('ready', async () => {
  console.log(`✅ Discord bot logged in as ${discordClient.user?.tag}`);
  botReady = true;

  // Sync reviews on startup
  const vouchChannelId = process.env.VOUCH_CHANNEL_ID;
  if (vouchChannelId) {
    try {
      const channel = await discordClient.channels.fetch(vouchChannelId);
      if (channel && channel instanceof TextChannel) {
        await ReviewService.syncReviewsFromDiscord(channel);
      }
    } catch (err) {
      console.error('❌ Failed to sync reviews on startup:', err);
    }
  }
});

discordClient.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'claim_ticket') {
      const username = interaction.user.username;
      const ticketId = interaction.channelId;
      
      // Update message to remove claim button but keep solved button
      const solveButton = new ButtonBuilder()
        .setCustomId('solve_ticket')
        .setLabel('Mark as Solved')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('1510067600682520638');

      await interaction.update({
        content: `✅ Ticket claimed by <@${interaction.user.id}>`,
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(solveButton)
        ]
      });
      
      // Broadcast claim event
      broadcastToTicket(ticketId, {
        type: 'claimed',
        staffName: username
      });
      
      return;
    }
    
    if (interaction.customId === 'solve_ticket') {
      await interaction.reply({ content: 'Generating transcript and closing ticket...', ephemeral: true });
      
      try {
        const channel = interaction.channel;
        if (channel && channel.isTextBased() && 'messages' in channel) {
          // Fetch up to 100 messages for transcript
          const msgs = await channel.messages.fetch({ limit: 100 });
          const transcript = msgs.reverse().map(m => `[${m.createdAt.toISOString()}] ${m.author.username}: ${m.content}`).join('\n');
          
          const buffer = Buffer.from(transcript, 'utf-8');
          const creatorInfo = 'topic' in channel && channel.topic ? channel.topic : `Creator: Unknown`;
          
          // Find transcript channel
          const transcriptChannelId = '1486401794987786272';
          const transcriptChannel = await discordClient.channels.fetch(transcriptChannelId);
          
          if (transcriptChannel && transcriptChannel.isTextBased()) {
            // Send transcript to the transcript channel
            await (transcriptChannel as any).send({
              content: `🔒 **Ticket Closed**\nChannel Name: \`${(channel as any).name}\`\n${creatorInfo}`,
              files: [{ attachment: buffer, name: `transcript-${channel.id}.txt` }]
            });
          }

          // Broadcast close event to frontend
          broadcastToTicket(channel.id, { type: 'closed' });
          
          // Delete the ticket channel
          if ('delete' in channel) {
             await (channel as any).delete('Ticket closed via solve button').catch(() => {});
          }
        }
      } catch (err) {
        console.error('Failed to close channel properly:', err);
      }
      return;
    }
  }
});

discordClient.on('channelDelete', (channel) => {
  // If the channel is deleted (by another bot or user), notify the frontend
  broadcastToTicket(channel.id, { type: 'closed' });
});

discordClient.on('messageCreate', async (message) => {
  // Admin IP Ban commands
  if (message.content.startsWith('!banip') || message.content.startsWith('!unbanip')) {
    if (!adminWhitelistService.isAdmin(message.author.id)) {
      message.reply('⛔ You do not have permission to use this command.');
      return;
    }

    const args = message.content.split(' ');
    const ip = args[1];

    if (!ip) {
      message.reply('⚠️ Please provide an IP address.');
      return;
    }

    const banServiceModule = await import('./services/banService');
    const { banService } = banServiceModule;
    
    const auditServiceModule = await import('./services/auditService');
    const { auditService } = auditServiceModule;

    if (message.content.startsWith('!banip')) {
      const success = banService.banIp(ip);
      if (success) auditService.logAction(message.author.id, 'IP_BAN', `Banned IP: ${ip}`);
      message.reply(success ? `✅ IP \`${ip}\` has been banned from the website.` : `⚠️ IP \`${ip}\` is already banned.`);
    } else if (message.content.startsWith('!unbanip')) {
      const success = banService.unbanIp(ip);
      if (success) auditService.logAction(message.author.id, 'IP_UNBAN', `Unbanned IP: ${ip}`);
      message.reply(success ? `✅ IP \`${ip}\` has been unbanned.` : `⚠️ IP \`${ip}\` is not in the ban list.`);
    }
    return;
  }

  // If the message is in the vouch channel, process it for reviews
  if (message.channelId === process.env.VOUCH_CHANNEL_ID) {
    const parsed = parseReviewMessage(message);
    if (parsed) {
      const added = ReviewService.addOrUpdateReview(parsed);
      if (added) console.log(`✅ Added new review to persistent store from ${parsed.name}`);
    }
    // We don't return here because a bot message could theoretically also be a ticket broadcast (unlikely, but safe)
  }

  // Ignore bots for ticket broadcast
  if (message.author.bot) return;

  // We only care about messages in ticket channels (checking if they are broadcastable)
  // We can just optimistically broadcast to a ticketId matching the channelId.
  // If no one is listening on that ticketId, broadcastToTicket handles it gracefully.
  const ticketId = message.channelId;
  const username = message.author.username;
  const text = message.content;

  // Optimistically broadcast claim event in case they didn't click the button
  broadcastToTicket(ticketId, {
    type: 'claimed',
    staffName: username
  });

  // You might want to filter only if it's in the specific category (1510333627454455828)
  // but optimistic broadcast by channelId is perfectly safe since SSE maps by channelId.
  broadcastToTicket(ticketId, {
    sender: 'bot', // We treat staff replies as 'bot' or 'staff' in the frontend
    text: text,
    staffName: username
  });
});

if (process.env.DISCORD_BOT_TOKEN) {
  discordClient.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
    console.error('❌ Failed to login to Discord:', err);
  });
} else {
  console.warn('⚠️ DISCORD_BOT_TOKEN is missing. Bot features are temporarily disabled.');
}
