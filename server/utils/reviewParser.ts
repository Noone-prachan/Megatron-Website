import { Message } from 'discord.js';

export interface ParsedReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export function parseReviewMessage(msg: Message): ParsedReview | null {
  // Accept bot messages that are vouches (have embeds)
  if (msg.author.bot && msg.embeds.length > 0 && msg.embeds[0].description?.includes('New Vouch Received')) {
    const embed = msg.embeds[0];
    
    // Extract comment from description (look for text between **" and "**)
    let comment = "No comment provided.";
    const descMatch = embed.description?.match(/\*\*"(.+)"\*\*/s);
    if (descMatch && descMatch[1]) {
      comment = descMatch[1]
        .replace(/<a?:[a-zA-Z0-9_]+:[0-9]+>/g, '') // Remove emojis
        .replace(/<@[!&]?\d+>/g, '')              // Remove user/role mentions
        .trim();
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
      date: msg.createdAt.toISOString() // Use ISO string for accurate parsing later
    };
  }
  
  // Accept normal user messages with text
  if (!msg.author.bot && msg.content.length > 5) {
    return {
      id: msg.id,
      name: msg.author.displayName || msg.author.username,
      avatar: msg.author.displayAvatarURL({ extension: 'png', size: 128 }),
      rating: 5, // Default to 5 for manual text vouches
      comment: msg.content
        .replace(/<a?:[a-zA-Z0-9_]+:[0-9]+>/g, '') // Remove emojis
        .replace(/<@[!&]?\d+>/g, '')              // Remove mentions
        .trim(),
      date: msg.createdAt.toISOString()
    };
  }

  return null;
}
