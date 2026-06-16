import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'analytics.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ visits: {} }));
}

/**
 * POST /api/analytics/visit
 * Record a web visit for today
 */
router.post('/visit', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    // Use the date format "MMM D" (e.g., "May 31") to easily match the dashboard format,
    // or just YYYY-MM-DD. Let's use YYYY-MM-DD.
    const today = new Date().toISOString().split('T')[0];
    
    if (!data.visits) data.visits = {};
    if (!data.visits[today]) {
      data.visits[today] = 0;
    }
    
    data.visits[today] += 1;
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, visits: data.visits[today] });
  } catch (error) {
    console.error('Failed to log visit', error);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

/**
 * GET /api/analytics/visits
 * Get all web visits
 */
router.get('/visits', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(data.visits || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve visits' });
  }
});

export default router;
