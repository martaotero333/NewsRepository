import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { DataRepository } from '../../main/services/data-repository';

describe('notification rule persistence', () => {
  let directory: string;
  let repository: DataRepository;

  afterEach(() => {
    repository?.close();
    if (directory) rmSync(directory, { recursive: true, force: true });
  });

  it('deletes a saved notification rule by id', () => {
    directory = mkdtempSync(join(tmpdir(), 'signal-desk-alerts-'));
    repository = new DataRepository(join(directory, 'test.db'), join(process.cwd(), 'database/schema.sql'));
    const rule = repository.addNotificationRule({ sourceId: null, keyword: 'election', category: null });

    repository.removeNotificationRule(rule.id);

    expect(repository.listNotificationRules()).toEqual([]);
  });
});