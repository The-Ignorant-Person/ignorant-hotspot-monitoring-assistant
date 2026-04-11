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
        className="station-panel px-4 py-2 text-sm font-mono text-text-secondary hover:text-signal-cyan hover:border-signal-cyan/30 transition-colors cursor-pointer w-full text-left"
      >
        ⚙ 系统设置 · SETTINGS
      </button>
    );
  }

  const emailEnabled = local.email_enabled === 'true';
  const browserNotification = local.notification_browser !== 'false';

  return (
    <div className="station-panel p-4 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="led-dot led-cyan" />
          <h2 className="text-sm font-mono text-signal-cyan tracking-wider m-0">
            系统设置 · SETTINGS
          </h2>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-xs font-mono text-text-dim hover:text-text-secondary bg-transparent border-none cursor-pointer"
        >
          收起
        </button>
      </div>

      {/* Notification Settings */}
      <div className="mb-4">
        <h3 className="text-xs font-mono text-text-dim mb-2 m-0 tracking-wider">通知方式</h3>
        <div className="space-y-2">
          <ToggleRow
            label="浏览器通知"
            enabled={browserNotification}
            onChange={() => setLocal({ ...local, notification_browser: browserNotification ? 'false' : 'true' })}
          />
          <ToggleRow
            label="邮件通知"
            enabled={emailEnabled}
            onChange={() => setLocal({ ...local, email_enabled: emailEnabled ? 'false' : 'true' })}
          />
          {emailEnabled && (
            <input
              type="email"
              value={local.email_to || ''}
              onChange={(e) => setLocal({ ...local, email_to: e.target.value })}
              placeholder="接收通知的邮箱地址..."
              className="w-full bg-station-bg border border-station-border rounded px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-signal-cyan/50 transition-colors mt-1"
            />
          )}
        </div>
      </div>

      {/* Scan Interval */}
      <div className="mb-4">
        <h3 className="text-xs font-mono text-text-dim mb-2 m-0 tracking-wider">扫描频率</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-text-secondary">每</span>
          <select
            value={local.scan_interval || '30'}
            onChange={(e) => setLocal({ ...local, scan_interval: e.target.value })}
            className="bg-station-bg border border-station-border rounded px-3 py-1.5 text-sm font-mono text-text-primary focus:outline-none focus:border-signal-cyan/50"
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
          </select>
          <span className="text-sm font-mono text-text-secondary">分钟扫描一次</span>
        </div>
      </div>

      {/* AI Model */}
      <div className="mb-4">
        <h3 className="text-xs font-mono text-text-dim mb-2 m-0 tracking-wider">AI 模型</h3>
        <select
          value={local.ai_model || 'deepseek/deepseek-chat-v3.1'}
          onChange={(e) => setLocal({ ...local, ai_model: e.target.value })}
          className="w-full bg-station-bg border border-station-border rounded px-3 py-1.5 text-sm font-mono text-text-primary focus:outline-none focus:border-signal-cyan/50"
        >
          <option value="deepseek/deepseek-chat-v3.1">DeepSeek V3.1 (超便宜)</option>
          <option value="deepseek/deepseek-chat">DeepSeek V3</option>
          <option value="deepseek/deepseek-r1">DeepSeek R1 (推理)</option>
          <option value="anthropic/claude-sonnet-4">Claude Sonnet 4</option>
          <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
        </select>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2 bg-signal-green/10 border border-signal-green/30 rounded text-signal-green text-sm font-mono hover:bg-signal-green/20 transition-colors cursor-pointer disabled:opacity-50"
      >
        {saving ? '保存中...' : '保存设置'}
      </button>
    </div>
  );
}

function ToggleRow({
  label,
  enabled,
  onChange,
  disabled,
  hint,
}: {
  label: string;
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm font-mono ${disabled ? 'text-text-dim' : 'text-text-secondary'}`}>
        {label}
        {hint && <span className="text-xs text-signal-amber ml-2">({hint})</span>}
      </span>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer border-none ${
          enabled ? 'bg-signal-green/30' : 'bg-station-border'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
            enabled ? 'left-5 bg-signal-green shadow-[0_0_6px_#00ff88]' : 'left-0.5 bg-text-dim'
          }`}
        />
      </button>
    </div>
  );
}
