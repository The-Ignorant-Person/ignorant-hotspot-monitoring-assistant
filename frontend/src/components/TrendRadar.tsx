import type { Trend } from '../types';

interface Props {
  trends: Trend[];
  loading: boolean;
}

function HeatBars({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5 items-end">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm transition-all"
          style={{
            height: `${8 + i * 3}px`,
            background:
              i <= level
                ? level >= 4
                  ? '#00ff88'
                  : level >= 3
                    ? '#00d4ff'
                    : '#ff8800'
                : '#1e293b',
            boxShadow:
              i <= level
                ? level >= 4
                  ? '0 0 4px #00ff8866'
                  : 'none'
                : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function TrendRadar({ trends, loading }: Props) {
  return (
    <div className="station-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="led-dot led-green" />
        <h2 className="text-sm font-mono text-signal-green tracking-wider m-0">
          趋势雷达 · TREND RADAR
        </h2>
      </div>

      {loading ? (
        <div className="text-center text-text-dim font-mono text-sm py-4 animate-pulse-glow">
          分析中...
        </div>
      ) : trends.length === 0 ? (
        <div className="text-center text-text-dim font-mono text-sm py-4">
          暂无趋势数据
        </div>
      ) : (
        <div className="space-y-3">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="bg-station-bg/50 border border-station-border rounded p-3 hover:border-signal-green/20 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-signal-cyan/10 border border-signal-cyan/30 text-signal-cyan">
                    {trend.category}
                  </span>
                  <span className="text-sm font-medium text-text-primary">{trend.title}</span>
                </div>
                <HeatBars level={trend.heat_level} />
              </div>
              <p className="text-xs text-text-secondary m-0 mb-2">{trend.summary}</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-text-dim font-mono">来源:</span>
                {trend.sources.map((s) => (
                  <span key={s} className="text-xs text-text-dim font-mono">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
