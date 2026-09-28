import { Notification } from 'electron';
import type { NewsItem } from '../../shared/models/types';
import { matchesNotificationRule } from '../../shared/models/notification-rule';
import type { NotificationRule } from '../../shared/models/notification-rule';

const notifiedItemIds = new Set<string>();

export function notifyMatchingItems(items: NewsItem[], rules: NotificationRule[]) {
  for (const item of items) {
    if (notifiedItemIds.has(item.id)) continue;
    for (const rule of rules) {
      if (matchesNotificationRule(rule, item)) {
        new Notification({ title: item.sourceName, body: item.title }).show();
        notifiedItemIds.add(item.id);
        break;
      }
    }
  }
}
