import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AddSourceInput, NewsItem, NewsSource } from '../../shared/models/types';
import type { NotificationRule } from '../../shared/models/notification-rule';

export class DataRepository {
  private readonly db: Database.Database;

  constructor(databasePath: string, schemaPath: string) {
    this.db = new Database(databasePath);
    this.db.pragma('foreign_keys = ON');
    this.db.exec(readFileSync(schemaPath, 'utf8'));
  }

  listSources(): NewsSource[] {
    return this.db.prepare(`SELECT id, name, url, category, is_enabled as isEnabled, refresh_interval_minutes as refreshIntervalMinutes, last_checked_at as lastCheckedAt, error_message as errorMessage FROM sources ORDER BY name`).all() as NewsSource[];
  }

  addSource(input: AddSourceInput): NewsSource {
    const source = { id: randomUUID(), ...input, isEnabled: true, refreshIntervalMinutes: 15, lastCheckedAt: null, errorMessage: null };
    this.db.prepare(`INSERT INTO sources (id, name, url, category, created_at) VALUES (?, ?, ?, ?, ?)`).run(source.id, source.name.trim(), source.url.trim(), source.category?.trim() || null, new Date().toISOString());
    return source;
  }

  removeSource(id: string): void { this.db.prepare('DELETE FROM sources WHERE id = ?').run(id); }

  saveArticles(items: NewsItem[]): void {
    const statement = this.db.prepare(`INSERT INTO articles (id, source_id, title, summary, link, published_at, fetched_at, category) VALUES (@id, @sourceId, @title, @summary, @link, @publishedAt, @fetchedAt, @category) ON CONFLICT(source_id, link) DO UPDATE SET title=excluded.title, summary=excluded.summary, published_at=excluded.published_at`);
    const transaction = this.db.transaction(() => items.forEach(item => statement.run(item)));
    transaction();
  }

  listArticles(): NewsItem[] {
    return this.db.prepare(`SELECT a.id, a.source_id as sourceId, s.name as sourceName, a.title, a.summary, a.link, a.published_at as publishedAt, a.is_read as isRead, a.is_saved as isSaved, a.category FROM articles a JOIN sources s ON s.id = a.source_id ORDER BY datetime(a.published_at) DESC`).all().map((item: any) => ({ ...item, isRead: Boolean(item.isRead), isSaved: Boolean(item.isSaved) })) as NewsItem[];
  }

  setArticleState(id: string, state: { isRead?: boolean; isSaved?: boolean }): void {
    if (state.isRead !== undefined) this.db.prepare('UPDATE articles SET is_read = ? WHERE id = ?').run(state.isRead ? 1 : 0, id);
    if (state.isSaved !== undefined) this.db.prepare('UPDATE articles SET is_saved = ? WHERE id = ?').run(state.isSaved ? 1 : 0, id);
  }

  listNotificationRules(): NotificationRule[] {
    return this.db.prepare('SELECT id, source_id as sourceId, keyword, category, enabled FROM notification_rules ORDER BY created_at DESC').all().map((row: any) => ({ ...row, enabled: Boolean(row.enabled) })) as NotificationRule[];
  }

  addNotificationRule(rule: Omit<NotificationRule, 'id' | 'enabled'>): NotificationRule {
    const result = { ...rule, id: randomUUID(), enabled: true };
    this.db.prepare('INSERT INTO notification_rules (id, source_id, keyword, category, created_at) VALUES (?, ?, ?, ?, ?)').run(result.id, result.sourceId, result.keyword, result.category, new Date().toISOString());
    return result;
  }
  
  removeNotificationRule(id: string): void {
    this.db.prepare('DELETE FROM notification_rules WHERE id = ?').run(id);
  }

  markSourceChecked(id: string, errorMessage: string | null): void { this.db.prepare('UPDATE sources SET last_checked_at = ?, error_message = ? WHERE id = ?').run(new Date().toISOString(), errorMessage, id); }
  close(): void { this.db.close(); }
}
