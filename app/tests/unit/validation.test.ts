import { describe, expect, it } from 'vitest';
import { validateSource } from '../../shared/models/validation';

describe('validateSource', () => {
  it('requires a source name', () => expect(validateSource({ name: '', url: 'https://example.com/feed.xml', category: null })).toBe('Source name is required.'));
  it('rejects invalid URLs', () => expect(validateSource({ name: 'News', url: 'not-a-url', category: null })).toBe('Enter a valid feed URL.'));
  it('accepts a valid source', () => expect(validateSource({ name: 'News', url: 'https://example.com/feed.xml', category: null })).toBeNull());
});
