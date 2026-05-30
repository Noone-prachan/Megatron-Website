import { Client, GatewayIntentBits } from 'discord.js';

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

  // Register /close command globally
  try {
    await discordClient.application?.commands.create({
      name: 'close',
      description: 'Close the current ticket channel',
    });
    console.log('✅ Registered /close slash command');
  } catch (err) {
    console.error('❌ Failed to register slash commands:', err);
  }
});

discordClient.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'close') {
    // Acknowledge the interaction
    await interaction.reply({ content: 'Closing ticket...', ephemeral: true });
    
    setTimeout(async () => {
      try {
        if (interaction.channel && 'delete' in interaction.channel) {
          await interaction.channel.delete('Ticket closed via /close command');
        }
      } catch (err) {
        console.error('Failed to delete channel:', err);
      }
    }, 3000); // Wait 3 seconds before deleting
  }
});

if (process.env.DISCORD_BOT_TOKEN) {
  discordClient.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
    console.error('❌ Failed to login to Discord:', err);
  });
} else {
  console.warn('⚠️ DISCORD_BOT_TOKEN is missing. Bot features are temporarily disabled.');
}
