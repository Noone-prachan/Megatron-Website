import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const router = express.Router();

export const requireAdmin2FA = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers['x-2fa-token'] as string;
  const secret = process.env.ADMIN_2FA_SECRET;

  // If 2FA isn't configured, skip verification
  if (!secret) {
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: '2FA token required' });
  }

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1
  });

  if (verified) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid 2FA token' });
  }
};

/**
 * GET /api/auth/2fa/generate
 * Generates a new 2FA secret and QR code.
 * Put the returned secret in your .env file as ADMIN_2FA_SECRET
 */
router.get('/2fa/generate', (req, res) => {
  const secret = speakeasy.generateSecret({ name: 'Megatron Admin' });
  qrcode.toDataURL(secret.otpauth_url!, (err, data_url) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to generate QR code' });
    }
    res.json({
      secret: secret.base32,
      qrcode: data_url,
      instruction: 'Add this secret to your .env file as ADMIN_2FA_SECRET'
    });
  });
});

/**
 * POST /api/auth/2fa/verify
 * Test verifying a token against a provided secret
 */
router.post('/2fa/verify', (req, res) => {
  const { token, secret } = req.body;
  
  if (!token || !secret) {
    return res.status(400).json({ error: 'Missing token or secret' });
  }

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1
  });

  if (verified) {
    res.json({ success: true, message: '2FA token is valid' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid 2FA token' });
  }
});

// Discord OAuth URLs
const DISCORD_API = 'https://discord.com/api/v10';
const OAUTH_URL = 'https://discord.com/oauth2/authorize';
const TOKEN_URL = `${DISCORD_API}/oauth2/token`;

// Fallback application id (provided by user) and redirect URI
const FALLBACK_CLIENT_ID = '1443156928254705734';
const FALLBACK_REDIRECT_URI = 'http://localhost:3001/api/auth/discord/callback';

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
      }).toString(),
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

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/auth/success?token=${jwtToken}`);
  } catch (error: any) {
    console.error('Discord OAuth error:', error.response?.data || error.message);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/error`);
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