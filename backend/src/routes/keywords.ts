import { Router } from 'express';
import db from '../lib/db.js';

const router = Router();

// GET /api/keywords - list all keywords
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM keywords ORDER BY created_at DESC').all();
  res.json(rows);
});

// POST /api/keywords - add keyword
router.post('/', (req, res) => {
  const { keyword, scope = 'all' } = req.body;
  if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
    res.status(400).json({ error: 'keyword is required' });
    return;
  }
  try {
    const info = db.prepare(
      'INSERT INTO keywords (keyword, scope) VALUES (?, ?)'
    ).run(keyword.trim(), scope);
    const row = db.prepare('SELECT * FROM keywords WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(row);
  } catch (e: any) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'keyword already exists' });
      return;
    }
    throw e;
  }
});

// PATCH /api/keywords/:id - toggle active
router.patch('/:id', (req, res) => {
  const { active } = req.body;
  const info = db.prepare('UPDATE keywords SET active = ? WHERE id = ?').run(
    active ? 1 : 0,
    req.params.id
  );
  if (info.changes === 0) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  const row = db.prepare('SELECT * FROM keywords WHERE id = ?').get(req.params.id);
  res.json(row);
});

// DELETE /api/keywords/:id
router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM keywords WHERE id = ?').run(req.params.id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  res.json({ success: true });
});

export default router;
