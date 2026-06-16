import express from 'express';
import { ReviewService } from '../services/reviewService';

const router = express.Router();

/**
 * GET /api/reviews
 * Fetches reviews instantly from the local persistent JSON store.
 * The store is kept up-to-date in the background by the Discord bot.
 */
router.get('/', (req, res) => {
  try {
    const reviews = ReviewService.getStoredReviews();

    res.json({
      success: true,
      reviews: reviews
    });
  } catch (error: any) {
    console.error('Error fetching stored reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch reviews',
      message: error.message
    });
  }
});

export default router;
