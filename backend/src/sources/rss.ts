import Parser from 'rss-parser';
import type { RawArticle } from '../lib/types.js';

const parser = new Parser({ timeout: 10000 });

// Default RSS feeds for tech/AI news
const DEFAULT_FEEDS = [
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://feeds.arstechnica.com/arstechnica/technology-lab',
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
];

export async function fetchRSS(feeds?: string[], limit = 10): Promise<RawArticle[]> {
  const urls = feeds && feeds.length > 0 ? feeds : DEFAULT_FEEDS;
  const results: RawArticle[] = [];

  await Promise.allSettled(
    urls.map(async (feedUrl) => {
      try {
        const feed = await parser.parseURL(feedUrl);
        for (const item of feed.items.slice(0, limit)) {
          if (!item.link) continue;
          results.push({
            source: 'rss',
            title: item.title || '',
            url: item.link,
            snippet: item.contentSnippet?.slice(0, 300) || item.title || '',
            published_at: item.isoDate || undefined,
          });
        }
      } catch (e) {
        console.error(`[RSS] fetch error for ${feedUrl}:`, e);
      }
    })
  );

  return results;
}
