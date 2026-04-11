import { useState } from 'react';
import { triggerScan } from '../hooks/useApi';

interface Props {
  connected: boolean;
}

export default function StatusBar({ connected }: Props) {
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    if (scanning) return;
    setScanning(true);
    try {
      await triggerScan();
    } catch (e) {
      console.error('Scan trigger failed:', e);
    } finally {
      setTimeout(() => setScanning(false), 3000);
    }
  };

  return (
    <footer className="border-t border-station-border bg-station-panel/80 px-6 py-2">
      <div className="flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className={`led-dot ${connected ? 'led-green animate-pulse-glow' : 'led-red'}`} />
            <span className={connected ? 'text-signal-green' : 'text-signal-red'}>
              {connected ? 'WebSocket 已连接' : 'WebSocket 断开'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={scanning}
            className={`transition-colors bg-transparent border-none cursor-pointer font-mono text-xs ${
              scanning ? 'text-signal-amber animate-signal-blink' : 'text-text-dim hover:text-signal-amber'
            } disabled:cursor-wait`}
          >
            {scanning ? '扫描中...' : '手动扫描'}
          </button>
          <span className="text-text-dim">|</span>
          <span className="text-text-dim">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
