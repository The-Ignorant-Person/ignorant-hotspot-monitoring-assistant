import type { Trend } from '../types';

interface Props {
  trends: Trend[];
  loading: boolean;
}

function HeatBars({ level }: { level: number }) {
  return (
    <div className="flex items-end gap-[3px]">
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= level;
        const color = level >= 4 ? '#10b981' : level >= 3 ? '#22d3ee' : '#f59e0b';
        return (
          <div
            key={i}
            className="w-1 rounded-sm transition-all"
            style={{
              height: `${6 + i * 3}px`,
              background: active ? color : 'rgba(148,163,184,0.15)',
              boxShadow: active ? `0 0 6px ${color}66` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

export default function TrendRadar({ trends, loading }: Props) {
  return (
    <div className="glass-panel-strong p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="led-dot led-emerald animate-pulse-glow" />
        <h2 className="section-title m-0 text-emerald-300">趋势雷达 · TREND RADAR</h2>
      </div>

      {loading ? (
        <div className="py-6 text-center font-mono text-xs text-slate-500 animate-pulse">
          AI 分析中…
        </div>
      ) : trends.length === 0 ? (
        <div className="py-6 text-center font-mono text-xs text-slate-600">暂无趋势数据</div>
      ) : (
        <div className="space-y-2.5">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="group rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-cyan-400/20 hover:bg-white/[0.04]"
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="self-start rounded border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-violet-300">
                    {trend.category}
                  </span>
                  <span className="text-[12px] font-medium leading-snug text-slate-200">
                    {trend.title}
                  </span>
                </div>
                <HeatBars level={trend.heat_level} />
              </div>
              <p className="m-0 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                {trend.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
