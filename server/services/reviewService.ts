import { TextChannel } from 'discord.js';
import { ParsedReview, parseReviewMessage } from '../utils/reviewParser.js';
import { prisma } from '../utils/db.js';

export class ReviewService {
  /**
   * Retrieves stored reviews from the database.
   */
  static async getStoredReviews(): Promise<ParsedReview[]> {
    try {
      const reviews = await prisma.review.findMany({
        orderBy: { date: 'desc' },
        take: 100, // optionally limit to recent 100
      });
      // Map back to ParsedReview structure
      return reviews.map((r: any) => ({
        id: r.id,
        name: r.author,
        avatar: r.avatar,
        rating: r.rating,
        comment: r.text,
        date: r.date.toISOString(),
      }));
    } catch (err) {
      console.error('Error fetching reviews from DB:', err);
      return [];
    }
  }

  /**
   * Adds a single review if it doesn't already exist.
   * Returns true if added, false if it was a duplicate.
   */
  static async addOrUpdateReview(review: ParsedReview): Promise<boolean> {
    try {
      const exists = await prisma.review.findUnique({
        where: { id: review.id }
      });
      
      if (exists) {
        return false;
      }

      await prisma.review.create({
        data: {
          id: review.id,
          author: review.name,
          avatar: review.avatar,
          rating: review.rating,
          text: review.comment,
          isScraped: false,
          date: new Date(review.date),
        }
      });
      return true;
    } catch (err) {
      console.error('Error adding review to DB:', err);
      return false;
    }
  }

  /**
   * Fetches the latest messages from the Discord channel and syncs them.
   */
  static async syncReviewsFromDiscord(channel: TextChannel): Promise<void> {
    try {
      const messages = await channel.messages.fetch({ limit: 50 });
      let addedCount = 0;

      for (const msg of messages.values()) {
        const parsed = parseReviewMessage(msg);
        if (parsed) {
          const added = await this.addOrUpdateReview(parsed);
          if (added) addedCount++;
        }
      }

      if (addedCount > 0) {
        console.log(`✅ Synced ${addedCount} new reviews from Discord to Database.`);
      }
    } catch (error) {
      console.error('Failed to sync reviews from Discord:', error);
    }
  }
}
