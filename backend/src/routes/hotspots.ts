import { Router } from 'express';
import db from '../lib/db.js';

const router = Router();

// GET /api/hotspots - list hotspots with optional filters
router.get('/', (req, res) => {
  const { source, verified, keyword_id, limit = '50' } = req.query;

  let sql = 'SELECT * FROM hotspots WHERE 1=1';
  const params: any[] = [];

  if (source) {
    sql += ' AND source = ?';
    params.push(source);
  }
  if (verified !== undefined) {
    sql += ' AND verified = ?';
    params.push(verified === 'true' ? 1 : 0);
  }
  if (keyword_id) {
    sql += ' AND keyword_id = ?';
    params.push(keyword_id);
  }

  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(Number(limit));

  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

// GET /api/hotspots/stats - quick stats
router.get('/stats', (_req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM hotspots').get() as any;
  const verified = db.prepare('SELECT COUNT(*) as count FROM hotspots WHERE verified = 1').get() as any;
  const bySource = db.prepare(
    'SELECT source, COUNT(*) as count FROM hotspots GROUP BY source'
  ).all();
  res.json({
    total: total.count,
    verified: verified.count,
    bySource,
  });
});

// DELETE /api/hotspots/:id
router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM hotspots WHERE id = ?').run(req.params.id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  res.json({ success: true });
});

export default router;
