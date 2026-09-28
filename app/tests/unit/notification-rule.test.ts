import { describe, expect, it } from 'vitest';
import { matchesNotificationRule } from '../../shared/models/notification-rule';

describe('notification rules', () => {
  it('matches enabled keyword rules', () => expect(matchesNotificationRule({ id: '1', sourceId: null, keyword: 'launch', category: null, enabled: true }, { sourceId: 's', title: 'Launch update', summary: '', category: null })).toBe(true));
  it('does not match disabled rules', () => expect(matchesNotificationRule({ id: '1', sourceId: null, keyword: 'launch', category: null, enabled: false }, { sourceId: 's', title: 'Launch update', summary: '', category: null })).toBe(false));
});
