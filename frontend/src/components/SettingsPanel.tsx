import { useState, useEffect } from 'react';

interface Props {
  settings: Record<string, string>;
  onUpdate: (updates: Record<string, string>) => Promise<void>;
}

export default function SettingsPanel({ settings, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(local);
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="glass-panel w-full cursor-pointer px-5 py-3 text-left font-mono text-xs tracking-wider text-slate-400 transition-all hover:border-cyan-400/30 hover:text-cyan-300"
      >
        ⚙ 系统设置 · SETTINGS
      </button>
    );
  }

  const emailEnabled = local.email_enabled === 'true';
  const browserNotification = local.notification_browser !== 'false';

  return (
    <div className="glass-panel-strong animate-fade-in-up p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="led-dot led-cyan animate-pulse-glow" />
          <h2 className="section-title m-0 text-cyan-300">系统设置 · SETTINGS</h2>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="cursor-pointer border-none bg-transparent font-mono text-[10px] text-slate-500 hover:text-slate-300"
        >
          收起
        </button>
      </div>

      {/* Notifications */}
      <div className="mb-4">
        <h3 className="m-0 mb-2 font-mono text-[10px] tracking-[0.16em] text-slate-500">
          通知方式
        </h3>
        <div className="space-y-2">
          <ToggleRow
            label="浏览器通知"
            enabled={browserNotification}
            onChange={() =>
              setLocal({
                ...local,
                notification_browser: browserNotification ? 'false' : 'true',
              })
            }
          />
          <ToggleRow
            label="邮件通知"
            enabled={emailEnabled}
            onChange={() =>
              setLocal({ ...local, email_enabled: emailEnabled ? 'false' : 'true' })
            }
          />
          {emailEnabled && (
            <input
              type="email"
              value={local.email_to || ''}
              onChange={(e) => setLocal({ ...local, email_to: e.target.value })}
              placeholder="接收通知的邮箱地址…"
              className="mt-1 w-full rounded-lg border border-white/[0.08] bg-slate-950/60 px-3 py-2 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-cyan-400/40 focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Scan interval */}
      <div className="mb-4">
        <h3 className="m-0 mb-2 font-mono text-[10px] tracking-[0.16em] text-slate-500">
          扫描频率
        </h3>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400">每</span>
          <select
            value={local.scan_interval || '30'}
            onChange={(e) => setLocal({ ...local, scan_interval: e.target.value })}
            className="rounded-lg border border-white/[0.08] bg-slate-950/60 px-3 py-1.5 font-mono text-xs text-slate-100 focus:border-cyan-400/40 focus:outline-none"
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
          </select>
          <span className="font-mono text-xs text-slate-400">分钟扫描一次</span>
        </div>
      </div>

      {/* AI model */}
      <div className="mb-4">
        <h3 className="m-0 mb-2 font-mono text-[10px] tracking-[0.16em] text-slate-500">
          AI 模型
        </h3>
        <select
          value={local.ai_model || 'deepseek/deepseek-chat-v3.1'}
          onChange={(e) => setLocal({ ...local, ai_model: e.target.value })}
          className="w-full rounded-lg border border-white/[0.08] bg-slate-950/60 px-3 py-2 font-mono text-xs text-slate-100 focus:border-cyan-400/40 focus:outline-none"
        >
          <option value="deepseek/deepseek-chat-v3.1">DeepSeek V3.1 (超便宜)</option>
          <option value="deepseek/deepseek-chat">DeepSeek V3</option>
          <option value="deepseek/deepseek-r1">DeepSeek R1 (推理)</option>
          <option value="anthropic/claude-sonnet-4">Claude Sonnet 4</option>
          <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-lg border border-emerald-400/30 bg-emerald-400/10 py-2.5 font-mono text-xs tracking-wider text-emerald-300 transition-all hover:border-emerald-400/60 hover:bg-emerald-400/20 active:scale-[0.98] disabled:opacity-50"
      >
        {saving ? '保存中…' : '保存设置'}
      </button>
    </div>
  );
}

function ToggleRow({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-xs text-slate-300">{label}</span>
      <button
        onClick={onChange}
        className={`relative h-5 w-10 cursor-pointer rounded-full border-none transition-colors ${
          enabled ? 'bg-emerald-400/30' : 'bg-white/[0.06]'
        }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
            enabled
              ? 'left-5 bg-emerald-400 shadow-[0_0_8px_#10b981]'
              : 'left-0.5 bg-slate-500'
          }`}
        />
      </button>
    </div>
  );
}
