export interface Keyword {
  id: number;
  keyword: string;
  scope: string;
  active: boolean;
  created_at: string;
}

export interface Hotspot {
  id: number;
  source: 'firecrawl' | 'hackernews' | 'rss' | 'twitter';
  title: string;
  summary: string;
  url: string;
  score: number;
  verified: boolean;
  reason: string;
  keyword_id: number | null;
  published_at: string;
  created_at: string;
}

export interface Trend {
  id: number;
  category: string;
  title: string;
  summary: string;
  heat_level: number; // 1-5
  sources: string[];
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'new_hotspot' | 'scan_complete' | 'error' | 'connected';
  message: string;
  timestamp: string;
}

export interface SystemStatus {
  status: 'online' | 'offline' | 'scanning';
  uptime: number;
  timestamp: string;
  lastScanAt?: string;
  totalHotspots?: number;
  activeKeywords?: number;
}
