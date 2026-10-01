import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSource } from '../../shared/models/validation';
import { matchesNotificationRule } from '../../shared/models/notification-rule';
import { addSource } from '../../main/services/source-manager';
import { DataRepository } from '../../main/services/data-repository';
import { popularSources } from '../../src/renderer/data/popular-sources';

describe('news flow integration contract', () => {
  let directory: string;
  let repository: DataRepository;

  afterEach(() => {
    repository?.close();
    if (directory) rmSync(directory, { recursive: true, force: true });
  });

  it('accepts a valid source and matches its configured alert rule', () => {
    const source = { name: 'World Desk', url: 'https://example.com/feed.xml', category: 'world' };
    expect(validateSource(source)).toBeNull();
    expect(matchesNotificationRule(
      { id: 'rule-1', sourceId: 'source-1', keyword: 'election', category: 'world', enabled: true },
      { sourceId: 'source-1', title: 'Election results update', summary: 'Latest coverage', category: 'world' }
    )).toBe(true);
  });

  it('persists catalog and manually entered sources through the same source-management flow', () => {
    directory = mkdtempSync(join(tmpdir(), 'newspop-source-flow-'));
    repository = new DataRepository(join(directory, 'test.db'), join(process.cwd(), 'database/schema.sql'));
    const catalogBefore = JSON.parse(JSON.stringify(popularSources));
    const catalogEntry = popularSources[0];
    const catalogSource = addSource(repository, {
      name: catalogEntry.name,
      url: catalogEntry.url,
      category: catalogEntry.region
    });
    const manualSource = addSource(repository, {
      name: 'Manual News',
      url: 'https://manual.example.com/rss.xml',
      category: 'world'
    });

    expect(repository.listSources()).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: catalogSource.id, name: catalogEntry.name, url: catalogEntry.url, category: catalogEntry.region }),
      expect.objectContaining({ id: manualSource.id, name: 'Manual News', url: 'https://manual.example.com/rss.xml', category: 'world' })
    ]));
    expect(repository.listSources()).toHaveLength(2);
    expect(popularSources).toEqual(catalogBefore);
  });

  it('rejects adding a catalog RSS URL again through manual entry', () => {
    directory = mkdtempSync(join(tmpdir(), 'newspop-source-duplicate-'));
    repository = new DataRepository(join(directory, 'test.db'), join(process.cwd(), 'database/schema.sql'));
    const catalogEntry = popularSources[0];

    addSource(repository, { name: catalogEntry.name, url: catalogEntry.url, category: catalogEntry.region });

    expect(() => addSource(repository, {
      name: 'Duplicate entered manually',
      url: catalogEntry.url,
      category: null
    })).toThrow(/UNIQUE constraint failed: sources\.url/);
    expect(repository.listSources()).toHaveLength(1);
  });
});
