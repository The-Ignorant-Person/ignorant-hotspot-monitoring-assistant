import type { Notification } from '../types';

interface Props {
  notifications: Notification[];
  onClear: () => void;
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString('zh-CN', { hour12: false });
}

const TYPE_COLORS: Record<string, string> = {
  connected: 'text-signal-cyan',
  scan_complete: 'text-signal-green',
  scan_start: 'text-signal-cyan',
  new_hotspot: 'text-signal-amber',
  error: 'text-signal-red',
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
    <div className="station-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="led-dot led-amber animate-pulse-glow" />
          <h2 className="text-sm font-mono text-signal-amber tracking-wider m-0">
            通信日志 · COMM LOG
          </h2>
        </div>
        <button
          onClick={onClear}
          className="text-xs font-mono text-text-dim hover:text-text-secondary bg-transparent border-none cursor-pointer transition-colors"
        >
          清除
        </button>
      </div>

      <div className="bg-station-bg rounded border border-station-border p-3 max-h-64 overflow-y-auto font-mono text-xs space-y-1">
        {notifications.length === 0 ? (
          <div className="text-text-dim">等待信号...</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="flex gap-2 leading-relaxed animate-fade-in-up">
              <span className="text-text-dim flex-shrink-0">[{formatTime(n.timestamp)}]</span>
              <span className={`flex-shrink-0 ${TYPE_COLORS[n.type] || 'text-text-dim'}`}>
                [{TYPE_PREFIXES[n.type] || 'INFO'}]
              </span>
              <span className="text-text-secondary">{n.message}</span>
            </div>
          ))
        )}
        <div className="flex items-center gap-1 text-signal-green mt-1">
          <span className="animate-signal-blink">▌</span>
        </div>
      </div>
    </div>
  );
}
