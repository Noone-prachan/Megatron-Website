import express from 'express';

const router = express.Router();

// Placeholder payments routes to unblock server startup.
// Implement actual payment integration as needed.

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Payments route is mounted' });
});

export default router;

