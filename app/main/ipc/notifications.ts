import { ipcMain } from 'electron';
import type { DataRepository } from '../services/data-repository';

export function registerNotificationHandlers(repository: DataRepository) {
  ipcMain.handle('notifications:list', () => repository.listNotificationRules());
  ipcMain.handle('notifications:add', (_event, rule: { sourceId: string | null; keyword: string | null; category: string | null }) => repository.addNotificationRule(rule));
  ipcMain.handle('notifications:remove', (_event, id: string) => repository.removeNotificationRule(id));
}