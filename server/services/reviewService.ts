import fs from 'fs';
import path from 'path';
import { TextChannel } from 'discord.js';
import { ParsedReview, parseReviewMessage } from '../utils/reviewParser';

const DATA_DIR = path.join(process.cwd(), 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class ReviewService {
  /**
   * Retrieves stored reviews from the JSON file.
   */
  static getStoredReviews(): ParsedReview[] {
    if (!fs.existsSync(REVIEWS_FILE)) {
      return [];
    }
    try {
      const data = fs.readFileSync(REVIEWS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading reviews.json:', err);
      return [];
    }
  }

  /**
   * Saves the entire array of reviews back to the JSON file.
   */
  static saveReviews(reviews: ParsedReview[]): void {
    try {
      // Sort reviews by date descending before saving
      reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Optionally keep only the latest 100 to prevent file bloat
      const cappedReviews = reviews.slice(0, 100);
      
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(cappedReviews, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to reviews.json:', err);
    }
  }

  /**
   * Adds a single review if it doesn't already exist.
   * Returns true if added, false if it was a duplicate.
   */
  static addOrUpdateReview(review: ParsedReview): boolean {
    const reviews = this.getStoredReviews();
    
    // Check for duplicates
    if (reviews.some(r => r.id === review.id)) {
      return false; // Already exists
    }

    reviews.push(review);
    this.saveReviews(reviews);
    return true;
  }

  /**
   * Fetches the latest messages from the Discord channel and syncs them.
   */
  static async syncReviewsFromDiscord(channel: TextChannel): Promise<void> {
    try {
      const messages = await channel.messages.fetch({ limit: 50 });
      let currentReviews = this.getStoredReviews();
      let addedCount = 0;

      // Map existing IDs for quick lookup
      const existingIds = new Set(currentReviews.map(r => r.id));

      for (const msg of messages.values()) {
        if (!existingIds.has(msg.id)) {
          const parsed = parseReviewMessage(msg);
          if (parsed) {
            currentReviews.push(parsed);
            existingIds.add(parsed.id);
            addedCount++;
          }
        }
      }

      if (addedCount > 0) {
        this.saveReviews(currentReviews);
        console.log(`✅ Synced ${addedCount} new reviews from Discord.`);
      }
    } catch (error) {
      console.error('Failed to sync reviews from Discord:', error);
    }
  }
}
