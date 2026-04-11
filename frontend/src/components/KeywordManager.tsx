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
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!input.trim()) return;
    setError('');
    try {
      await onAdd(input.trim());
      setInput('');
    } catch (e: any) {
      setError(e?.message || '添加失败');
    }
  };

  const activeCount = keywords.filter((k) => k.active).length;

  return (
    <div className="glass-panel-strong p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="led-dot led-violet animate-pulse-glow" />
          <h2 className="section-title m-0 text-violet-300">
            频率调谐 · FREQUENCY TUNER
          </h2>
        </div>
        <span className="font-mono text-[10px] tracking-wider text-slate-500">
          {activeCount}/{keywords.length} ACTIVE
        </span>
      </div>

      <div className="mb-3 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="输入监听关键词…"
            className="w-full rounded-lg border border-white/[0.08] bg-slate-950/60 px-4 py-2.5 font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/10 transition-all"
          />
        </div>
        <button
          onClick={handleAdd}
          className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 font-mono text-sm text-cyan-300 transition-all hover:border-cyan-400/60 hover:bg-cyan-400/20 active:scale-95"
        >
          + 添加
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-mono text-[11px] text-rose-300">
          {error}
        </div>
      )}

      {keywords.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/10 py-6 text-center font-mono text-[11px] tracking-wider text-slate-600">
          尚未添加任何关键词
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <button
              key={kw.id}
              onClick={() => onToggle(kw.id, !kw.active)}
              className={`group relative flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-all ${
                kw.active
                  ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300 shadow-[0_0_12px_-4px_#10b981]'
                  : 'border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20'
              }`}
            >
              <span
                className={`led-dot ${kw.active ? 'led-emerald animate-pulse-glow' : ''}`}
                style={{
                  width: 6,
                  height: 6,
                  background: kw.active ? undefined : 'rgba(148,163,184,0.4)',
                  boxShadow: kw.active ? undefined : 'none',
                }}
              />
              <span>{kw.keyword}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(kw.id);
                }}
                className="ml-0.5 cursor-pointer text-slate-500 opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100"
              >
                ✕
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
