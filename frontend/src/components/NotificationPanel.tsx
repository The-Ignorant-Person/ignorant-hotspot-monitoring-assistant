import type { Notification } from '../types';

interface Props {
  notifications: Notification[];
  onClear: () => void;
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString('zh-CN', { hour12: false });
}

const TYPE_COLORS: Record<string, string> = {
  connected: 'text-cyan-300',
  scan_complete: 'text-emerald-300',
  scan_start: 'text-cyan-300',
  new_hotspot: 'text-amber-300',
  error: 'text-rose-300',
};

const TYPE_PREFIXES: Record<string, string> = {
  connected: 'SYS',
  scan_complete: 'SCAN',
  scan_start: 'SCAN',
  new_hotspot: 'SIG',
  error: 'ERR',
};

export default function NotificationPanel({ notifications, onClear }: Props) {
  return (
    <div className="glass-panel-strong p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="led-dot led-amber animate-pulse-glow" />
          <h2 className="section-title m-0 text-amber-300">通信日志 · COMM LOG</h2>
        </div>
        <button
          onClick={onClear}
          className="cursor-pointer border-none bg-transparent font-mono text-[10px] text-slate-500 transition-colors hover:text-slate-300"
        >
          清除
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto rounded-lg border border-white/[0.06] bg-slate-950/60 p-3 font-mono text-[11px] leading-relaxed">
        {notifications.length === 0 ? (
          <div className="text-slate-600">等待信号…</div>
        ) : (
          <div className="space-y-1">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-2 animate-fade-in-up">
                <span className="flex-shrink-0 text-slate-600">[{formatTime(n.timestamp)}]</span>
                <span className={`flex-shrink-0 ${TYPE_COLORS[n.type] || 'text-slate-500'}`}>
                  [{TYPE_PREFIXES[n.type] || 'INFO'}]
                </span>
                <span className="text-slate-300 break-all">{n.message}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-1 text-cyan-300">
          <span className="animate-signal-blink">▌</span>
        </div>
      </div>
    </div>
  );
}
