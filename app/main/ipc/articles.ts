import { ipcMain } from 'electron';
import type { DataRepository } from '../services/data-repository';

export function registerArticleHandlers(repository: DataRepository) {
  ipcMain.handle('articles:list', () => repository.listArticles());
  ipcMain.handle('articles:set-state', (_event, id: string, state: { isRead?: boolean; isSaved?: boolean }) => repository.setArticleState(id, state));
}
