export interface RawArticle {
  source: 'firecrawl' | 'hackernews' | 'rss' | 'twitter';
  title: string;
  url: string;
  snippet: string;
  published_at?: string;
}

export interface VerifiedArticle extends RawArticle {
  score: number;
  verified: boolean;
  reason: string;
  summary: string;
}

export interface TrendItem {
  category: string;
  title: string;
  summary: string;
  heat_level: number;
  sources: string[];
}
