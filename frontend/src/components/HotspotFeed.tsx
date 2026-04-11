import type { Hotspot } from '../types';
import { CardSpotlight } from './ui/card-spotlight';

interface Props {
  hotspots: Hotspot[];
  loading: boolean;
}

const SOURCE_BADGES: Record<string, string> = {
  firecrawl: 'badge badge-firecrawl',
  hackernews: 'badge badge-hackernews',
  rss: 'badge badge-rss',
  twitter: 'badge badge-twitter',
};

const SOURCE_LABELS: Record<string, string> = {
  firecrawl: 'Firecrawl',
  hackernews: 'HN',
  rss: 'RSS',
  twitter: 'Twitter',
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e';
  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-10 w-10 flex-shrink-0">
      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-semibold tabular-nums"
        style={{ color }}
      >
        {score}
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  return `${Math.floor(hours / 24)}天前`;
}

export default function HotspotFeed({ hotspots, loading }: Props) {
  return (
    <div className="glass-panel-strong relative overflow-hidden p-5">
      {/* header bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="led-dot led-cyan animate-pulse-glow" />
          <h2 className="section-title m-0 text-cyan-300">
            信号拦截 · INTERCEPTED SIGNALS
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-slate-500">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5">
            {hotspots.length} 条
          </span>
        </div>
      </div>

      {/* divider with shimmer */}
      <div className="mb-4 h-px w-full overflow-hidden bg-white/[0.06]">
        {loading && <div className="h-full w-full animate-shimmer" />}
      </div>

      {loading && hotspots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
          <div className="font-mono text-xs tracking-wider text-slate-500">正在接收信号...</div>
        </div>
      ) : hotspots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-2 font-mono text-sm text-slate-400">暂无信号</div>
          <div className="font-mono text-[11px] text-slate-600">添加关键词并触发扫描</div>
        </div>
      ) : (
        <div className="space-y-3">
          {hotspots.map((hotspot, i) => (
            <CardSpotlight
              key={hotspot.id}
              className="animate-fade-in-up p-4"
              color="rgba(34, 211, 238, 0.18)"
            >
              <div
                style={{ animationDelay: `${Math.min(i, 8) * 0.06}s` }}
                className="animate-fade-in-up"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={SOURCE_BADGES[hotspot.source] ?? 'badge badge-rss'}>
                      {SOURCE_LABELS[hotspot.source] ?? hotspot.source}
                    </span>
                    {hotspot.verified ? (
                      <span className="font-mono text-[10px] tracking-wider text-emerald-400">
                        ✓ VERIFIED
                      </span>
                    ) : (
                      <span className="animate-signal-blink font-mono text-[10px] tracking-wider text-amber-400">
                        ⚠ PENDING
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {timeAgo(hotspot.published_at || hotspot.created_at)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 mb-1.5 text-[14px] font-medium leading-snug text-slate-100 transition-colors hover:text-cyan-300">
                      <a
                        href={hotspot.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-inherit no-underline"
                      >
                        {hotspot.title}
                      </a>
                    </h3>
                    <p className="m-0 line-clamp-2 text-[12px] leading-relaxed text-slate-400">
                      {hotspot.summary}
                    </p>
                    {hotspot.reason && (
                      <p className="m-0 mt-2 line-clamp-1 font-mono text-[10px] italic text-slate-600">
                        ▸ AI: {hotspot.reason}
                      </p>
                    )}
                  </div>
                  <ScoreRing score={hotspot.score} />
                </div>
              </div>
            </CardSpotlight>
          ))}
        </div>
      )}
    </div>
  );
}
