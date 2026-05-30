import express from 'express';
import { discordClient as client, botReady } from '../discordClient';
import { TextChannel } from 'discord.js';

const router = express.Router();

/**
 * GET /api/reviews
 * Fetches recent vouches/reviews from the Discord vouch channel
 */
router.get('/', async (req, res) => {
  if (!botReady) {
    return res.status(503).json({ error: 'Discord bot is not ready yet' });
  }

  const vouchChannelId = process.env.VOUCH_CHANNEL_ID;
  if (!vouchChannelId) {
    return res.status(500).json({ error: 'VOUCH_CHANNEL_ID is not configured' });
  }

  try {
    const channel = await client.channels.fetch(vouchChannelId);
    if (!channel || !(channel instanceof TextChannel)) {
      return res.status(500).json({ error: 'Invalid vouch channel' });
    }

    const messages = await channel.messages.fetch({ limit: 50 });

    const reviews = messages
      .filter(msg => {
        // Accept normal user messages with text
        if (!msg.author.bot && msg.content.length > 5) return true;
        // Accept bot messages that are vouches (have embeds)
        if (msg.author.bot && msg.embeds.length > 0 && msg.embeds[0].description?.includes('New Vouch Received')) return true;
        return false;
      })
      .map(msg => {
        if (msg.author.bot && msg.embeds.length > 0) {
          const embed = msg.embeds[0];
          // Extract comment from description (look for text between **" and "**)
          let comment = "No comment provided.";
          const descMatch = embed.description?.match(/\*\*\"([\s\S]*?)\"\*\*/);
          if (descMatch && descMatch[1]) {
            comment = descMatch[1].replace(/<a?:[a-zA-Z0-9_]+:[0-9]+>/g, '').trim();
          }

          // Extract rating (e.g. 2/5)
          let rating = 5;
          const ratingField = embed.fields?.find(f => f.name.includes('Rating'))?.value;
          if (ratingField) {
            const ratingMatch = ratingField.match(/`(\d)\/5`/);
            if (ratingMatch && ratingMatch[1]) {
              rating = parseInt(ratingMatch[1]);
            }
          }

          // Clean up name (remove " • Vouched")
          const rawName = embed.author?.name || 'Verified Customer';
          const name = rawName.split('•')[0].trim();
          
          const avatar = embed.author?.iconURL || 'https://cdn.discordapp.com/embed/avatars/0.png';

          return {
            id: msg.id,
            name: name,
            avatar: avatar,
            rating: rating,
            comment: comment,
            date: msg.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          };
        } else {
          // Normal user message
          return {
            id: msg.id,
            name: msg.author.displayName || msg.author.username,
            avatar: msg.author.displayAvatarURL({ extension: 'png', size: 128 }),
            rating: 5,
            comment: msg.content.replace(/<a?:[a-zA-Z0-9_]+:[0-9]+>/g, '').trim(),
            date: msg.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          };
        }
      })
      .map(r => r);

    // messages is a Collection in discord.js
    const reviewsArray = Array.from(reviews.values());

    res.json({
      success: true,
      reviews: reviewsArray
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch reviews',
      message: error.message
    });
  }
});

export default router;
