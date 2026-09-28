import { ipcMain } from 'electron';
import type { DataRepository } from '../services/data-repository';
import { addSource } from '../services/source-manager';
import { refreshAll } from '../services/feed-refresh';

export function registerNewsSourceHandlers(repository: DataRepository) {
  ipcMain.handle('sources:list', () => repository.listSources());
  ipcMain.handle('sources:add', (_event, input) => addSource(repository, input));
  ipcMain.handle('sources:remove', (_event, id: string) => repository.removeSource(id));
  ipcMain.handle('sources:refresh', () => refreshAll(repository));
}
