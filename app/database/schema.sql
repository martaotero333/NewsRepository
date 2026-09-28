CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category TEXT,
  is_enabled INTEGER NOT NULL DEFAULT 1,
  refresh_interval_minutes INTEGER NOT NULL DEFAULT 15,
  last_checked_at TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL,
  published_at TEXT NOT NULL,
  fetched_at TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  is_saved INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  UNIQUE(source_id, link)
);

CREATE TABLE IF NOT EXISTS preferences (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  refresh_interval_minutes INTEGER NOT NULL DEFAULT 15,
  enable_notifications INTEGER NOT NULL DEFAULT 1,
  default_sort_order TEXT NOT NULL DEFAULT 'newest'
);

CREATE TABLE IF NOT EXISTS notification_rules (
  id TEXT PRIMARY KEY,
  source_id TEXT REFERENCES sources(id) ON DELETE CASCADE,
  keyword TEXT,
  category TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

INSERT OR IGNORE INTO preferences (id) VALUES (1);
