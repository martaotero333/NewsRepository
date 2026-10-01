import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { migrateUserData } from '../../main/services/user-data-migration';

describe('user data migration', () => {
  let directory: string;

  afterEach(() => {
    if (directory) rmSync(directory, { recursive: true, force: true });
  });

  function createMigrationPaths() {
    directory = mkdtempSync(join(tmpdir(), 'newspop-user-data-migration-'));
    const legacyProfilePath = join(directory, 'legacy-profile');
    const destinationProfilePath = join(directory, 'destination-profile');
    const legacyDatabasePath = join(legacyProfilePath, 'signal-desk.sqlite');
    const destinationDatabasePath = join(destinationProfilePath, 'signal-desk.sqlite');
    const legacyRendererProfilePath = join(legacyProfilePath, 'renderer-profile');
    const destinationRendererProfilePath = join(destinationProfilePath, 'renderer-profile');
    const legacyLocalStoragePath = join(legacyRendererProfilePath, 'Local Storage', 'leveldb');

    mkdirSync(legacyLocalStoragePath, { recursive: true });
    writeFileSync(legacyDatabasePath, 'legacy-sqlite-data');
    writeFileSync(join(legacyLocalStoragePath, '000005.ldb'), 'legacy-renderer-profile-data');
    writeFileSync(join(legacyLocalStoragePath, 'legacy-only.ldb'), 'legacy-only-profile-data');
    writeFileSync(join(legacyRendererProfilePath, 'Preferences'), JSON.stringify({ language: 'es' }));

    return {
      legacyProfilePath,
      destinationProfilePath,
      legacyDatabasePath,
      destinationDatabasePath,
      legacyRendererProfilePath,
      destinationRendererProfilePath,
      legacyLocalStoragePath
    };
  }

  it('copies the legacy database and renderer profile when the destination does not exist', () => {
    const paths = createMigrationPaths();

    migrateUserData(paths);

    expect(readFileSync(paths.destinationDatabasePath, 'utf8')).toBe('legacy-sqlite-data');
    expect(readFileSync(join(paths.destinationRendererProfilePath, 'Local Storage', 'leveldb', '000005.ldb'), 'utf8'))
      .toBe('legacy-renderer-profile-data');
    expect(JSON.parse(readFileSync(join(paths.destinationRendererProfilePath, 'Preferences'), 'utf8')))
      .toEqual({ language: 'es' });
  });

  it('keeps an existing destination profile authoritative without merging legacy-only files', () => {
    const paths = createMigrationPaths();
    const destinationLevelDbPath = join(paths.destinationRendererProfilePath, 'Local Storage', 'leveldb');
    mkdirSync(destinationLevelDbPath, { recursive: true });
    writeFileSync(paths.destinationDatabasePath, 'destination-sqlite-data');
    writeFileSync(join(destinationLevelDbPath, '000005.ldb'), 'destination-renderer-profile-data');
    writeFileSync(join(paths.destinationRendererProfilePath, 'Preferences'), JSON.stringify({ language: 'en' }));

    migrateUserData(paths);

    expect(readFileSync(paths.destinationDatabasePath, 'utf8')).toBe('destination-sqlite-data');
    expect(readFileSync(join(destinationLevelDbPath, '000005.ldb'), 'utf8')).toBe('destination-renderer-profile-data');
    expect(JSON.parse(readFileSync(join(paths.destinationRendererProfilePath, 'Preferences'), 'utf8')))
      .toEqual({ language: 'en' });
    expect(() => readFileSync(join(paths.destinationRendererProfilePath, 'Local Storage', 'leveldb', 'legacy-only.ldb')))
      .toThrow();
  });

  it('leaves all legacy database and renderer-profile files untouched after migration', () => {
    const paths = createMigrationPaths();
    const legacyDbBefore = readFileSync(paths.legacyDatabasePath);
    const legacyLevelDbBefore = readFileSync(join(paths.legacyLocalStoragePath, '000005.ldb'));
    const legacyPreferencesBefore = readFileSync(join(paths.legacyRendererProfilePath, 'Preferences'));

    migrateUserData(paths);

    expect(readFileSync(paths.legacyDatabasePath)).toEqual(legacyDbBefore);
    expect(readFileSync(join(paths.legacyLocalStoragePath, '000005.ldb'))).toEqual(legacyLevelDbBefore);
    expect(readFileSync(join(paths.legacyRendererProfilePath, 'Preferences'))).toEqual(legacyPreferencesBefore);
  });
});
