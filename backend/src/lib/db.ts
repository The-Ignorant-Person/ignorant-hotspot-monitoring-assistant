import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(import.meta.dirname, '../../data/signal.db');

const db = new Database(DB_PATH);

// Performance optimizations
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT NOT NULL UNIQUE,
    scope TEXT NOT NULL DEFAULT 'all',
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS hotspots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL UNIQUE,
    score INTEGER NOT NULL DEFAULT 0,
    verified INTEGER NOT NULL DEFAULT 0,
    reason TEXT NOT NULL DEFAULT '',
    keyword_id INTEGER,
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    heat_level INTEGER NOT NULL DEFAULT 1,
    sources TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Insert default settings if not exist
const upsertSetting = db.prepare(
  `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`
);

const defaultSettings: Record<string, string> = {
  scan_interval: '30',
  email_enabled: 'false',
  email_to: '',
  email_smtp_host: '',
  email_smtp_port: '465',
  email_smtp_user: '',
  email_smtp_pass: '',
  ai_model: 'deepseek/deepseek-chat-v3.1',
  notification_browser: 'true',
};

for (const [key, value] of Object.entries(defaultSettings)) {
  upsertSetting.run(key, value);
}

export default db;
