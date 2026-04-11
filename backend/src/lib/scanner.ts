import db from './db.js';
import { searchFirecrawl } from '../sources/firecrawl.js';
import { searchHackerNews } from '../sources/hackernews.js';
import { fetchRSS } from '../sources/rss.js';
import { verifyArticle, analyzeTrends } from './ai.js';
import { sendEmailNotification, buildHotspotEmailHtml } from './notifier.js';
import type { RawArticle, VerifiedArticle } from './types.js';

type BroadcastFn = (event: { type: string; data: unknown }) => void;

// Deduplicate articles by URL
function dedup(articles: RawArticle[]): RawArticle[] {
  const seen = new Set<string>();
  // Also check existing URLs in DB
  const existing = db.prepare('SELECT url FROM hotspots').all() as { url: string }[];
  for (const e of existing) seen.add(e.url);

  return articles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
}

// Save verified article to DB
function saveHotspot(article: VerifiedArticle, keywordId: number | null) {
  db.prepare(
    `INSERT OR IGNORE INTO hotspots (source, title, summary, url, score, verified, reason, keyword_id, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    article.source,
    article.title,
    article.summary,
    article.url,
    article.score,
    article.verified ? 1 : 0,
    article.reason,
    keywordId,
    article.published_at || null
  );
}

// Scan for a single keyword
async function scanKeyword(
  keyword: { id: number; keyword: string; scope: string },
  broadcast: BroadcastFn
): Promise<VerifiedArticle[]> {
  const query = keyword.keyword;
  const results: VerifiedArticle[] = [];

  // Fetch from all sources in parallel
  const [firecrawlResults, hnResults, rssResults] = await Promise.all([
    searchFirecrawl(query),
    searchHackerNews(query),
    fetchRSS(undefined, 5),
  ]);

  const allRaw = dedup([...firecrawlResults, ...hnResults, ...rssResults]);

  if (allRaw.length === 0) return results;

  // Verify each article with AI (sequential with rate limit delay)
  for (const raw of allRaw.slice(0, 5)) {
    const verified = await verifyArticle(raw, query);
    await new Promise((r) => setTimeout(r, 1000));
    if (verified.score >= 30) {
      saveHotspot(verified, keyword.id);
      results.push(verified);

      if (verified.verified && verified.score >= 60) {
        broadcast({
          type: 'new_hotspot',
          data: {
            title: verified.title,
            url: verified.url,
            summary: verified.summary,
            score: verified.score,
            source: verified.source,
            keyword: query,
          },
        });
      }
    }
  }

  return results;
}

// Full scan: all active keywords + trend analysis
export async function runFullScan(broadcast: BroadcastFn): Promise<{
  hotspots: number;
  trends: number;
}> {
  console.log('[Scanner] 开始全量扫描...');
  broadcast({ type: 'scan_start', data: { timestamp: new Date().toISOString() } });

  const keywords = db.prepare('SELECT * FROM keywords WHERE active = 1').all() as {
    id: number;
    keyword: string;
    scope: string;
  }[];

  let totalHotspots = 0;
  const allRawForTrends: RawArticle[] = [];
  const notifyItems: { title: string; url: string; summary: string; score: number }[] = [];

  for (const kw of keywords) {
    try {
      const results = await scanKeyword(kw, broadcast);
      totalHotspots += results.length;

      for (const r of results) {
        allRawForTrends.push(r);
        if (r.verified && r.score >= 60) {
          notifyItems.push({ title: r.title, url: r.url, summary: r.summary, score: r.score });
        }
      }
    } catch (e) {
      console.error(`[Scanner] keyword "${kw.keyword}" error:`, e);
    }
  }

  // Trend analysis
  let totalTrends = 0;
  if (allRawForTrends.length > 0) {
    try {
      const domain = keywords.map((k) => k.keyword).join(', ');
      const trends = await analyzeTrends(allRawForTrends, domain);
      for (const trend of trends) {
        db.prepare(
          `INSERT INTO trends (category, title, summary, heat_level, sources)
           VALUES (?, ?, ?, ?, ?)`
        ).run(trend.category, trend.title, trend.summary, trend.heat_level, JSON.stringify(trend.sources));
      }
      totalTrends = trends.length;
    } catch (e) {
      console.error('[Scanner] trend analysis error:', e);
    }
  }

  // Email notification for high-score items
  if (notifyItems.length > 0) {
    sendEmailNotification(
      `发现 ${notifyItems.length} 条高质量热点`,
      buildHotspotEmailHtml(notifyItems)
    ).catch(console.error);
  }

  broadcast({
    type: 'scan_complete',
    data: {
      timestamp: new Date().toISOString(),
      hotspots: totalHotspots,
      trends: totalTrends,
    },
  });

  console.log(`[Scanner] 扫描完成: ${totalHotspots} hotspots, ${totalTrends} trends`);
  return { hotspots: totalHotspots, trends: totalTrends };
}
