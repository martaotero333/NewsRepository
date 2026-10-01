import { describe, expect, it } from 'vitest';
import { popularSources } from '../../src/renderer/data/popular-sources';

describe('popular RSS source catalog', () => {
  it('includes an extensive set of national, international, and local outlets', () => {
    expect(popularSources.length).toBeGreaterThanOrEqual(30);
    expect(new Set(popularSources.map(source => source.scope))).toEqual(new Set(['national', 'international', 'local']));
    expect(popularSources.some(source => source.scope === 'local' && source.region === 'Madrid')).toBe(true);
    expect(popularSources.some(source => source.scope === 'local' && source.region === 'Catalunya')).toBe(true);
  });

  it('uses unique, valid HTTPS feed URLs and non-empty labels', () => {
    const urls = popularSources.map(source => source.url);
    expect(new Set(urls).size).toBe(urls.length);
    popularSources.forEach(source => {
      expect(source.name.trim()).not.toBe('');
      expect(source.region.trim()).not.toBe('');
      expect(new URL(source.url).protocol).toBe('https:');
    });
  });
});
