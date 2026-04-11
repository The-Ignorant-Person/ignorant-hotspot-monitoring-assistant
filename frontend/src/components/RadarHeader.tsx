import { useState, useEffect } from 'react';

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
    <header className="station-panel border-b border-station-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Radar */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-signal-green/30" />
            <div className="absolute inset-2 rounded-full border border-signal-green/20" />
            <div className="absolute inset-4 rounded-full border border-signal-green/10" />
            <div className="absolute inset-0 animate-radar origin-center">
              <div
                className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
                style={{ background: 'linear-gradient(90deg, #00ff88, transparent)' }}
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-signal-green led-green" />
            <div className="absolute top-3 right-4 w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse-glow" />
            <div className="absolute bottom-4 right-3 w-1 h-1 rounded-full bg-signal-amber animate-pulse-glow" style={{ animationDelay: '0.7s' }} />
          </div>

          <div>
            <h1 className="text-xl font-bold font-mono text-signal-green text-glow-green tracking-wider m-0">
              SIGNAL STATION
            </h1>
            <p className="text-xs text-text-secondary font-mono tracking-widest m-0">
              热点信号监控中心
            </p>
          </div>
        </div>

        {/* Center: LED Stats */}
        <div className="flex gap-6">
          <LedCounter label="拦截信号" value={totalHotspots} color="green" />
          <LedCounter label="监听频率" value={activeKeywords} color="cyan" />
          <LedCounter label="信号源" value={3} color="amber" />
        </div>

        {/* Right: System Clock */}
        <div className="text-right font-mono">
          <div className="text-signal-green text-sm text-glow-green">
            {time.toLocaleTimeString('zh-CN', { hour12: false })}
          </div>
          <div className="text-text-dim text-xs">
            {time.toLocaleDateString('zh-CN')}
          </div>
          <div className="flex items-center gap-1.5 justify-end mt-1">
            <span className={`led-dot ${connected ? 'led-green animate-pulse-glow' : 'led-red'}`} />
            <span className={`text-xs ${connected ? 'text-signal-green' : 'text-signal-red'}`}>
              {connected ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function LedCounter({ label, value, color }: { label: string; value: number; color: 'green' | 'cyan' | 'amber' }) {
  const colorMap = {
    green: 'text-signal-green text-glow-green',
    cyan: 'text-signal-cyan text-glow-cyan',
    amber: 'text-signal-amber text-glow-amber',
  };

  return (
    <div className="text-center">
      <div className={`text-2xl font-mono font-bold ${colorMap[color]} tabular-nums`}>
        {String(value).padStart(3, '0')}
      </div>
      <div className="text-xs text-text-dim font-mono tracking-wider">{label}</div>
    </div>
  );
}
