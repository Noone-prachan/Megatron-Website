import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const LEADERBOARD_FILE = path.join(__dirname, '../data/leaderboard.json');

// Ensure data directory and file exist
if (!fs.existsSync(path.join(__dirname, '../data'))) {
  fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
}
if (!fs.existsSync(LEADERBOARD_FILE)) {
  fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify([]));
}

interface ScoreEntry {
  id: string; // discord id
  username: string;
  avatar: string;
  score: number;
  date: string;
}

const getLeaderboardData = (): ScoreEntry[] => {
  try {
    const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return [];
  }
};

const saveLeaderboardData = (data: ScoreEntry[]) => {
  try {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing leaderboard:', error);
  }
};

// GET /api/game/leaderboard
router.get('/leaderboard', (req, res) => {
  const leaderboard = getLeaderboardData();
  // Sort descending and get top 10
  const top10 = leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  res.json({ success: true, leaderboard: top10 });
});

// POST /api/game/score
router.post('/score', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  let user: any;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ error: 'Server configuration error' });
    }
    user = jwt.verify(token, secret);
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  const { score } = req.body;
  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({ error: 'Invalid score' });
  }

  const leaderboard = getLeaderboardData();
  
  // Check if user already exists
  const existingIndex = leaderboard.findIndex(entry => entry.id === user.id);
  
  if (existingIndex !== -1) {
    // Only update if new score is higher
    if (score > leaderboard[existingIndex].score) {
      leaderboard[existingIndex].score = score;
      leaderboard[existingIndex].date = new Date().toISOString();
      leaderboard[existingIndex].avatar = user.avatar || leaderboard[existingIndex].avatar;
      leaderboard[existingIndex].username = user.global_name || user.username || leaderboard[existingIndex].username;
    }
  } else {
    // Add new entry
    leaderboard.push({
      id: user.id,
      username: user.global_name || user.username || 'Unknown User',
      avatar: user.avatar || '',
      score: score,
      date: new Date().toISOString()
    });
  }

  // Sort and keep top 100 max in file to prevent bloat
  const sorted = leaderboard.sort((a, b) => b.score - a.score).slice(0, 100);
  saveLeaderboardData(sorted);

  res.json({ success: true, message: 'Score saved successfully' });
});

export default router;
