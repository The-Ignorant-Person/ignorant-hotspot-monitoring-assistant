import { Router } from 'express';
import db from '../lib/db.js';

const router = Router();

// GET /api/settings - get all settings as key-value object
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

// PUT /api/settings - batch update settings
router.put('/', (req, res) => {
  const updates = req.body as Record<string, string>;
  const upsert = db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  );

  const updateMany = db.transaction((entries: [string, string][]) => {
    for (const [key, value] of entries) {
      upsert.run(key, String(value));
    }
  });

  updateMany(Object.entries(updates));
  res.json({ success: true });
});

export default router;
