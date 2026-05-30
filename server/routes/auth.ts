import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Discord OAuth URLs
const DISCORD_API = 'https://discord.com/api/v10';
const OAUTH_URL = `${DISCORD_API}/oauth2/authorize`;
const TOKEN_URL = `${DISCORD_API}/oauth2/token`;

// Fallback application id (provided by user) and redirect URI
const FALLBACK_CLIENT_ID = '1443156928254705734';
const FALLBACK_REDIRECT_URI = 'http://localhost:5173/api/auth/discord/callback';

/**
 * GET /api/auth/discord
 * Initiates Discord OAuth flow
 */
router.get('/discord', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID || FALLBACK_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI || FALLBACK_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email guilds',
  });

  res.redirect(`${OAUTH_URL}?${params}`);
});

/**
 * GET /api/auth/discord/callback
 * Handles Discord OAuth callback
 */
router.get('/discord/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // Get user information
    const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data;

    // Create JWT token
    const jwtToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        global_name: user.global_name,
        discriminator: user.discriminator,
        avatar: user.avatar,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/success?token=${jwtToken}`);
  } catch (error: any) {
    console.error('Discord OAuth error:', error.response?.data || error.message);
    res.redirect('http://localhost:5173/auth/error');
  }
});

/**
 * GET /api/auth/me
 * Get current user info (requires JWT token)
 */
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

/**
 * GET /api/user/:id
 * Get public user info by ID
 */
router.get('/user/:id', async (req, res) => {
  try {
    const userResponse = await axios.get(`${DISCORD_API}/users/${req.params.id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
    res.json(userResponse.data);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;