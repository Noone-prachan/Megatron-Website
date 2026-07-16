import express from 'express';

const router = express.Router();

// Simple in-memory cache: { userId -> { data, fetchedAt } }
const cache: Record<string, { data: any; fetchedAt: number }> = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/users/:id
 * Fetches a Discord user's profile (avatar + banner hash) via the bot token.
 * Returns CDN URLs so the frontend can display them directly.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid Discord user ID' });
  }

  // Serve from cache if fresh
  const cached = cache[id];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch Discord user' });
    }

    const user = await response.json() as any;

    // Build CDN URLs
    const avatarHash = user.avatar;
    const bannerHash = user.banner;

    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.${avatarHash.startsWith('a_') ? 'gif' : 'png'}?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator || 0) % 5}.png`;

    const bannerUrl = bannerHash
      ? `https://cdn.discordapp.com/banners/${id}/${bannerHash}.${bannerHash.startsWith('a_') ? 'gif' : 'png'}?size=512`
      : null;

    const result = {
      id,
      username: user.global_name || user.username,
      avatarUrl,
      bannerUrl,
      bannerColor: user.banner_color || null,
    };

    cache[id] = { data: result, fetchedAt: Date.now() };
    return res.json(result);
  } catch (err) {
    console.error(`Failed to fetch Discord user ${id}:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
