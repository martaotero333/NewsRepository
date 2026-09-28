import { describe, expect, it } from 'vitest';
import { validateSource } from '../../shared/models/validation';
import { matchesNotificationRule } from '../../shared/models/notification-rule';

describe('news flow integration contract', () => {
  it('accepts a valid source and matches its configured alert rule', () => {
    const source = { name: 'World Desk', url: 'https://example.com/feed.xml', category: 'world' };
    expect(validateSource(source)).toBeNull();
    expect(matchesNotificationRule(
      { id: 'rule-1', sourceId: 'source-1', keyword: 'election', category: 'world', enabled: true },
      { sourceId: 'source-1', title: 'Election results update', summary: 'Latest coverage', category: 'world' }
    )).toBe(true);
  });
});
