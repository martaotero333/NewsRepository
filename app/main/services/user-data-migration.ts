import { copyFileSync, cpSync, existsSync, mkdirSync, constants } from 'node:fs';
import { dirname } from 'node:path';

export type UserDataMigrationPaths = {
  legacyProfilePath: string;
  destinationProfilePath: string;
  legacyDatabasePath: string;
  destinationDatabasePath: string;
};

export function migrateUserData(paths: UserDataMigrationPaths): void {
  const {
    legacyProfilePath,
    destinationProfilePath,
    legacyDatabasePath,
    destinationDatabasePath
  } = paths;

  if (!existsSync(destinationProfilePath) && existsSync(legacyProfilePath)) {
    mkdirSync(dirname(destinationProfilePath), { recursive: true });
    cpSync(legacyProfilePath, destinationProfilePath, {
      recursive: true,
      errorOnExist: true,
      force: false
    });
    return;
  }

  if (!existsSync(destinationDatabasePath) && existsSync(legacyDatabasePath)) {
    mkdirSync(dirname(destinationDatabasePath), { recursive: true });
    copyFileSync(legacyDatabasePath, destinationDatabasePath, constants.COPYFILE_EXCL);
  }
}