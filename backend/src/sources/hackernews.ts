import type { RawArticle } from '../lib/types.js';

const HN_SEARCH_URL = 'https://hn.algolia.com/api/v1/search';

export async function searchHackerNews(query: string, limit = 10): Promise<RawArticle[]> {
  try {
    const url = `${HN_SEARCH_URL}?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${limit}`;
    const resp = await fetch(url);
    if (!resp.ok) return [];

    const data = await resp.json();
    return (data.hits || []).map((hit: any) => ({
      source: 'hackernews' as const,
      title: hit.title || '',
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      snippet: hit.story_text?.slice(0, 300) || hit.title || '',
      published_at: hit.created_at || undefined,
    }));
  } catch (e) {
    console.error('[HackerNews] search error:', e);
    return [];
  }
}
