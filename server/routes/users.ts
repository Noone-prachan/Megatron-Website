import express from 'express';
import { discordClient } from '../discordClient';

const router = express.Router();

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache: Record<string, { data: any; fetchedAt: number }> = {};

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid Discord user ID' });
  }

  const cached = cache[id];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  if (!discordClient.isReady()) {
    return res.status(503).json({ error: 'Discord bot is not connected yet' });
  }

  try {
    const user = await discordClient.users.fetch(id);

    const avatarHash = user.avatar;
    const bannerHash = (user as any).banner;

    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.${avatarHash.startsWith('a_') ? 'gif' : 'png'}?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${Number((user as any).discriminator || 0) % 5}.png`;

    const bannerUrl = bannerHash
      ? `https://cdn.discordapp.com/banners/${id}/${bannerHash}.${bannerHash.startsWith('a_') ? 'gif' : 'png'}?size=512`
      : null;

    const result = {
      id,
      username: user.globalName || user.username,
      avatarUrl,
      bannerUrl,
      bannerColor: (user as any).banner_color || null,
    };

    cache[id] = { data: result, fetchedAt: Date.now() };
    res.json(result);
  } catch (err) {
    console.error(`Failed to fetch Discord user ${id}:`, err);
    res.status(404).json({ error: 'User not found or bot cannot access this user' });
  }
});

export default router;
