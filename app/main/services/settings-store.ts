import type Database from 'better-sqlite3';

export class SettingsStore {
  constructor(private readonly db: Database.Database) {}
  get() { return this.db.prepare('SELECT refresh_interval_minutes as refreshIntervalMinutes, enable_notifications as enableNotifications, default_sort_order as defaultSortOrder FROM preferences WHERE id = 1').get(); }
  update(input: { refreshIntervalMinutes?: number; enableNotifications?: boolean; defaultSortOrder?: string }) { this.db.prepare('UPDATE preferences SET refresh_interval_minutes = COALESCE(?, refresh_interval_minutes), enable_notifications = COALESCE(?, enable_notifications), default_sort_order = COALESCE(?, default_sort_order) WHERE id = 1').run(input.refreshIntervalMinutes ?? null, input.enableNotifications === undefined ? null : input.enableNotifications ? 1 : 0, input.defaultSortOrder ?? null); return this.get(); }
}
