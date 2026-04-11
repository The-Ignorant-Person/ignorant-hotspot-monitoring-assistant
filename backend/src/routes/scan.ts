import { Router } from 'express';
import { runFullScan } from '../lib/scanner.js';

type BroadcastFn = (event: { type: string; data: unknown }) => void;

let scanning = false;
let broadcastRef: BroadcastFn | null = null;

export function setScanBroadcast(fn: BroadcastFn) {
  broadcastRef = fn;
}

const router = Router();

// POST /api/scan - trigger manual scan
router.post('/', async (_req, res) => {
  if (scanning) {
    res.status(429).json({ error: 'Scan already in progress' });
    return;
  }
  if (!broadcastRef) {
    res.status(500).json({ error: 'Broadcast not initialized' });
    return;
  }

  scanning = true;
  res.json({ message: 'Scan started' });

  try {
    await runFullScan(broadcastRef);
  } catch (e) {
    console.error('[Scan Route] error:', e);
  } finally {
    scanning = false;
  }
});

export default router;
