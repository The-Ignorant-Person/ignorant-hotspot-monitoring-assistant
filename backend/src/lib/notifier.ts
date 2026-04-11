import nodemailer from 'nodemailer';
import db from './db.js';

function getSettings(): Record<string, string> {
  const rows = db.prepare('SELECT * FROM settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.key] = r.value;
  return settings;
}

export async function sendEmailNotification(subject: string, html: string): Promise<boolean> {
  const s = getSettings();
  if (s.email_enabled !== 'true' || !s.email_to || !s.email_smtp_host) {
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: s.email_smtp_host,
      port: Number(s.email_smtp_port) || 465,
      secure: Number(s.email_smtp_port) === 465,
      auth: {
        user: s.email_smtp_user,
        pass: s.email_smtp_pass,
      },
    });

    await transporter.sendMail({
      from: s.email_smtp_user,
      to: s.email_to,
      subject: `[信号站] ${subject}`,
      html,
    });
    return true;
  } catch (e) {
    console.error('[Email] send error:', e);
    return false;
  }
}

export function buildHotspotEmailHtml(
  items: { title: string; url: string; summary: string; score: number }[]
): string {
  const rows = items
    .map(
      (item) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #333"><a href="${item.url}" style="color:#00ff88">${item.title}</a><br><small style="color:#999">${item.summary}</small></td><td style="padding:8px;border-bottom:1px solid #333;text-align:center;color:#00d4ff">${item.score}</td></tr>`
    )
    .join('');

  return `
    <div style="background:#0a0e1a;color:#e0e0e0;padding:20px;font-family:monospace">
      <h2 style="color:#00ff88">🛰️ 信号站 · 新热点通知</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><th style="text-align:left;padding:8px;border-bottom:2px solid #00ff88;color:#00ff88">热点</th><th style="padding:8px;border-bottom:2px solid #00ff88;color:#00ff88">评分</th></tr>
        ${rows}
      </table>
      <p style="color:#666;margin-top:16px;font-size:12px">— 信号站 SIGNAL STATION</p>
    </div>
  `;
}
