import FirecrawlApp from '@mendable/firecrawl-js';
import type { RawArticle } from '../lib/types.js';

let client: FirecrawlApp | null = null;

function getClient(): FirecrawlApp | null {
  if (!process.env.FIRECRAWL_API_KEY) return null;
  if (!client) {
    client = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  }
  return client;
}

export async function searchFirecrawl(query: string, limit = 5): Promise<RawArticle[]> {
  const fc = getClient();
  if (!fc) return [];

  try {
    const result = await fc.search(query, {
      limit,
      scrapeOptions: { formats: ['markdown'] },
    });

    if (!result.success || !result.data) return [];

    return result.data
      .filter((item: any) => item.url && item.title)
      .map((item: any) => ({
        source: 'firecrawl' as const,
        title: item.title || '',
        url: item.url,
        snippet: item.description || item.markdown?.slice(0, 300) || '',
        published_at: item.publishedDate || undefined,
      }));
  } catch (e) {
    console.error('[Firecrawl] search error:', e);
    return [];
  }
}
