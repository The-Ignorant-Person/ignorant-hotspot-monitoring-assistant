import { useState } from 'react';
import type { Keyword } from '../types';

interface Props {
  keywords: Keyword[];
  onAdd: (keyword: string, scope?: string) => Promise<any>;
  onToggle: (id: number, active: boolean) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}

export default function KeywordManager({ keywords, onAdd, onToggle, onRemove }: Props) {
  const [input, setInput] = useState('');

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      await onAdd(input.trim());
      setInput('');
    } catch (e: any) {
      alert(e.message || 'Failed to add keyword');
    }
  };

  return (
    <div className="station-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="led-dot led-cyan" />
        <h2 className="text-sm font-mono text-signal-cyan tracking-wider m-0">
          频率调谐 · FREQUENCY TUNER
        </h2>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="输入监听关键词..."
          className="flex-1 bg-station-bg border border-station-border rounded px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-signal-cyan/50 transition-colors"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-signal-cyan/10 border border-signal-cyan/30 rounded text-signal-cyan text-sm font-mono hover:bg-signal-cyan/20 transition-colors cursor-pointer"
        >
          + 添加
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <div
            key={kw.id}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono transition-all cursor-pointer ${
              kw.active
                ? 'bg-signal-green/10 border border-signal-green/30 text-signal-green'
                : 'bg-station-border/30 border border-station-border text-text-dim'
            }`}
            onClick={() => onToggle(kw.id, !kw.active)}
          >
            <span className={`led-dot ${kw.active ? 'led-green animate-pulse-glow' : 'bg-text-dim'}`} style={{ width: 6, height: 6 }} />
            <span>{kw.keyword}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(kw.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-signal-red ml-1 transition-opacity bg-transparent border-none cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-text-dim font-mono">
        活跃频率: {keywords.filter((k) => k.active).length} / {keywords.length}
      </div>
    </div>
  );
}
