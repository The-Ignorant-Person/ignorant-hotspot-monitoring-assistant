import { useState } from 'react';
import { triggerScan } from '../hooks/useApi';
import { HoverBorderGradient } from './ui/hover-border-gradient';

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
    <footer className="border-t border-white/[0.06] bg-slate-950/40 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4 font-mono text-[10px] tracking-wider">
          <div className="flex items-center gap-2">
            <span className={`led-dot ${connected ? 'led-emerald animate-pulse-glow' : 'led-rose'}`} />
            <span className={connected ? 'text-emerald-400' : 'text-rose-400'}>
              {connected ? 'WS · CONNECTED' : 'WS · DISCONNECTED'}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-500">SIGNAL STATION v1.0</span>
        </div>

        <HoverBorderGradient onClick={handleScan} disabled={scanning}>
          <span className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                scanning ? 'animate-pulse bg-amber-400' : 'bg-cyan-400'
              }`}
            />
            {scanning ? '扫描中…' : '手动扫描'}
          </span>
        </HoverBorderGradient>
      </div>
    </footer>
  );
}
