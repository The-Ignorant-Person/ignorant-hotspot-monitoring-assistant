import type { Hotspot } from '../types';

interface Props {
  hotspots: Hotspot[];
  loading: boolean;
}

const SOURCE_BADGES: Record<string, string> = {
  firecrawl: 'badge-firecrawl',
  hackernews: 'badge-hackernews',
  rss: 'badge-rss',
  twitter: 'badge-twitter',
};

const SOURCE_LABELS: Record<string, string> = {
  firecrawl: 'Firecrawl',
  hackernews: 'HackerNews',
  rss: 'RSS',
  twitter: 'Twitter',
};

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-signal-green' : score >= 50 ? 'bg-signal-amber' : 'bg-signal-red';

  return (
    <div className="flex items-center gap-2">
      <div className="signal-bar flex-1 w-20">
        <div className={`signal-bar-fill ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-text-secondary w-8 text-right">{score}</span>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  return `${Math.floor(hours / 24)}天前`;
}

export default function HotspotFeed({ hotspots, loading }: Props) {
  return (
    <div className="station-panel p-4 flex-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="led-dot led-green" />
          <h2 className="text-sm font-mono text-signal-green tracking-wider m-0">
            信号拦截 · INTERCEPTED SIGNALS
          </h2>
        </div>
        <span className="text-xs font-mono text-text-dim">{hotspots.length} 条信号</span>
      </div>

      {loading ? (
        <div className="text-center text-text-dim font-mono text-sm py-8 animate-pulse-glow">
          正在接收信号...
        </div>
      ) : hotspots.length === 0 ? (
        <div className="text-center text-text-dim font-mono text-sm py-8">
          暂无信号 · 添加关键词并触发扫描
        </div>
      ) : (
        <div className="space-y-3">
          {hotspots.map((hotspot, i) => (
            <div
              key={hotspot.id}
              className="group station-panel-glow p-4 hover:border-signal-green/40 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${SOURCE_BADGES[hotspot.source]}`}>
                    {SOURCE_LABELS[hotspot.source]}
                  </span>
                  {hotspot.verified ? (
                    <span className="text-xs text-signal-green font-mono">✓ 已验证</span>
                  ) : (
                    <span className="text-xs text-signal-amber font-mono animate-signal-blink">⚠ 待确认</span>
                  )}
                </div>
                <span className="text-xs text-text-dim font-mono">{timeAgo(hotspot.published_at || hotspot.created_at)}</span>
              </div>

              <h3 className="text-sm font-medium text-text-primary mb-2 m-0 group-hover:text-signal-green transition-colors">
                <a
                  href={hotspot.url}
                  target="_blank"
                  rel="noreferrer"
                  className="no-underline text-inherit hover:text-signal-green"
                >
                  {hotspot.title}
                </a>
              </h3>

              <p className="text-xs text-text-secondary mb-3 m-0 leading-relaxed">{hotspot.summary}</p>

              <div className="flex items-center justify-between">
                <p className="text-xs text-text-dim italic m-0 flex-1 mr-4">AI: {hotspot.reason}</p>
                <div className="flex-shrink-0">
                  <div className="text-xs text-text-dim font-mono mb-0.5">信号强度</div>
                  <ScoreBar score={hotspot.score} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
