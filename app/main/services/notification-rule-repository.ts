import { randomUUID } from 'node:crypto';
import type Database from 'better-sqlite3';
import type { NotificationRule } from '../../shared/models/notification-rule';

export class NotificationRuleRepository {
  constructor(private readonly db: Database.Database) {}
  list(): NotificationRule[] { return this.db.prepare('SELECT id, source_id as sourceId, keyword, category, enabled FROM notification_rules ORDER BY created_at DESC').all().map((row: any) => ({ ...row, enabled: Boolean(row.enabled) })) as NotificationRule[]; }
  add(rule: Omit<NotificationRule, 'id' | 'enabled'>): NotificationRule { const result = { ...rule, id: randomUUID(), enabled: true }; this.db.prepare('INSERT INTO notification_rules (id, source_id, keyword, category, created_at) VALUES (?, ?, ?, ?, ?)').run(result.id, result.sourceId, result.keyword, result.category, new Date().toISOString()); return result; }
}
