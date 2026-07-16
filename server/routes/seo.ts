import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

/**
 * GET /api/seo/audit?url=...
 * Fetches HTML and extracts basic SEO metrics (title, desc, h1s, missing alts, etc)
 */
router.get('/audit', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) return res.status(400).json({ error: 'URL is required' });

  // ensure protocol
  const fullUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;

  try {
    const response = await axios.get(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract basic meta tags
    const title = $('title').text() || '';
    const description = $('meta[name="description"]').attr('content') || '';
    const keywords = $('meta[name="keywords"]').attr('content') || '';

    // Extract OpenGraph tags
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';

    // Headings
    const h1s = $('h1').length;
    const h2s = $('h2').length;
    const h3s = $('h3').length;

    // Images
    const totalImages = $('img').length;
    const imagesWithoutAlt = $('img:not([alt]), img[alt=""]').length;

    // Links
    const totalLinks = $('a').length;
    const linksWithoutHref = $('a:not([href])').length;

    // Basic scoring logic
    let score = 100;
    const warnings = [];

    if (!title) { score -= 20; warnings.push("Missing Title tag"); }
    else if (title.length < 30 || title.length > 60) { score -= 5; warnings.push("Title length is not optimal (aim for 30-60 chars)"); }

    if (!description) { score -= 20; warnings.push("Missing Meta Description"); }
    else if (description.length < 120 || description.length > 160) { score -= 5; warnings.push("Description length is not optimal (aim for 120-160 chars)"); }

    if (h1s === 0) { score -= 15; warnings.push("Missing H1 heading"); }
    else if (h1s > 1) { score -= 5; warnings.push("Multiple H1 headings found (usually one is best)"); }

    if (imagesWithoutAlt > 0) { 
      const penalty = Math.min(20, imagesWithoutAlt * 2);
      score -= penalty; 
      warnings.push(`${imagesWithoutAlt} images are missing alt attributes`); 
    }

    if (!ogTitle || !ogImage) {
      score -= 10;
      warnings.push("Missing essential OpenGraph tags (og:title, og:image) for social sharing");
    }

    res.json({
      success: true,
      data: {
        score: Math.max(0, score),
        warnings,
        meta: { title, description, keywords },
        og: { ogTitle, ogDescription, ogImage },
        structure: { h1s, h2s, h3s },
        media: { totalImages, imagesWithoutAlt },
        links: { totalLinks, linksWithoutHref }
      }
    });

  } catch (error: any) {
    console.error('SEO Audit error:', error.message);
    res.status(500).json({ error: `Failed to fetch URL: ${error.message}` });
  }
});

/**
 * GET /api/seo/keywords?q=...
 * Uses a public autocomplete API to get keyword suggestions
 */
router.get('/keywords', async (req, res) => {
  const query = req.query.q as string;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    // DuckDuckGo autocomplete is open and doesn't require CORS bypass on the server,
    // but doing it server-side avoids client-side CORS issues entirely.
    const url = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`;
    const response = await axios.get(url);
    
    // DuckDuckGo returns [ "query", ["suggestion1", "suggestion2"] ]
    const suggestions = response.data[1] || [];

    res.json({
      success: true,
      suggestions: suggestions.map((text: string) => ({
        keyword: text,
        // Mock data since real volume requires a paid API
        volume: Math.floor(Math.random() * 5000) + 100,
        difficulty: Math.floor(Math.random() * 60) + 10
      }))
    });
  } catch (error: any) {
    console.error('Keyword suggestion error:', error.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

export default router;
