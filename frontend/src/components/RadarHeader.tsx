import { useState, useEffect } from 'react';
import { Spotlight } from './ui/spotlight';
import { AnimatedNumber } from './ui/animated-number';

interface Props {
  totalHotspots: number;
  activeKeywords: number;
  connected: boolean;
}

export default function RadarHeader({ totalHotspots, activeKeywords, connected }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative overflow-hidden border-b border-white/[0.06] bg-slate-950/40 backdrop-blur-md">
      <Spotlight />
      <div className="relative z-10 mx-auto flex w-full max-w-[1480px] items-center justify-between px-6 py-5">
        {/* Brand + radar */}
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border border-cyan-400/40" />
            <div className="absolute inset-2 rounded-full border border-cyan-400/25" />
            <div className="absolute inset-4 rounded-full border border-cyan-400/15" />
            <div className="absolute inset-0 origin-center animate-radar">
              <div
                className="absolute left-1/2 top-1/2 h-0.5 w-1/2 origin-left"
                style={{ background: 'linear-gradient(90deg, #22d3ee, transparent)' }}
              />
            </div>
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]" />
          </div>

          <div>
            <h1 className="m-0 font-mono text-xl font-bold tracking-[0.18em] text-gradient-tech">
              SIGNAL · STATION
            </h1>
            <p className="m-0 mt-0.5 font-mono text-[10px] tracking-[0.32em] text-slate-500">
              热点信号监控中心 · INTELLIGENCE FEED
            </p>
          </div>
        </div>

        {/* LED Stats */}
        <div className="hidden gap-8 md:flex">
          <LedCounter label="拦截信号" subLabel="SIGNALS" value={totalHotspots} color="cyan" />
          <LedCounter label="监听频率" subLabel="FREQ" value={activeKeywords} color="violet" />
          <LedCounter label="信号源" subLabel="SOURCE" value={3} color="emerald" />
        </div>

        {/* Clock */}
        <div className="text-right font-mono">
          <div className="text-glow-cyan text-base text-cyan-300 tabular-nums">
            {time.toLocaleTimeString('zh-CN', { hour12: false })}
          </div>
          <div className="text-[10px] tracking-wider text-slate-500">
            {time.toLocaleDateString('zh-CN')}
          </div>
          <div className="mt-1 flex items-center justify-end gap-1.5">
            <span className={`led-dot ${connected ? 'led-emerald animate-pulse-glow' : 'led-rose'}`} />
            <span className={`text-[10px] tracking-wider ${connected ? 'text-emerald-400' : 'text-rose-400'}`}>
              {connected ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function LedCounter({
  label,
  subLabel,
  value,
  color,
}: {
  label: string;
  subLabel: string;
  value: number;
  color: 'cyan' | 'violet' | 'emerald';
}) {
  const colorMap = {
    cyan: 'text-cyan-300 text-glow-cyan',
    violet: 'text-violet-300 text-glow-violet',
    emerald: 'text-emerald-300 text-glow-emerald',
  };

  return (
    <div className="text-center">
      <div className={`font-mono text-2xl font-bold tabular-nums ${colorMap[color]}`}>
        <AnimatedNumber value={value} />
      </div>
      <div className="font-mono text-[9px] tracking-[0.2em] text-slate-500">
        {subLabel} · {label}
      </div>
    </div>
  );
}
