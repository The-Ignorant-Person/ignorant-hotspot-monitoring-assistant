import { Router } from 'express';
import db from '../lib/db.js';

const router = Router();

// GET /api/trends - list recent trends
router.get('/', (req, res) => {
  const { limit = '20' } = req.query;
  const rows = db.prepare(
    'SELECT * FROM trends ORDER BY created_at DESC LIMIT ?'
  ).all(Number(limit));

  // Parse sources JSON string back to array
  const parsed = (rows as any[]).map((r) => ({
    ...r,
    sources: JSON.parse(r.sources),
  }));
  res.json(parsed);
});

export default router;
