import cron from 'node-cron';
import { runFullScan } from './scanner.js';
import db from './db.js';

type BroadcastFn = (event: { type: string; data: unknown }) => void;

let currentTask: cron.ScheduledTask | null = null;

export function initScheduler(broadcast: BroadcastFn) {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'scan_interval'").get() as { value: string } | undefined;
  const minutes = Number(row?.value) || 30;

  startScheduler(minutes, broadcast);
  console.log(`⏱️  定时扫描已启动: 每 ${minutes} 分钟`);
}

export function startScheduler(minutes: number, broadcast: BroadcastFn) {
  if (currentTask) {
    currentTask.stop();
  }

  // node-cron expression: every N minutes
  const expression = `*/${minutes} * * * *`;
  currentTask = cron.schedule(expression, () => {
    runFullScan(broadcast).catch((e) => {
      console.error('[Scheduler] scan error:', e);
      broadcast({ type: 'error', data: { message: 'Scan failed: ' + String(e) } });
    });
  });
}

export function stopScheduler() {
  if (currentTask) {
    currentTask.stop();
    currentTask = null;
  }
}
