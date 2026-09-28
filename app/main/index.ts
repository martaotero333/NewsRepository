import { app, BrowserWindow } from 'electron';
import { join } from 'node:path';
import { DataRepository } from './services/data-repository';
import { registerNewsSourceHandlers } from './ipc/news-sources';
import { registerArticleHandlers } from './ipc/articles';
import { refreshAll } from './services/feed-refresh';
import { registerNotificationHandlers } from './ipc/notifications';

let repository: DataRepository;

function createWindow() {
  const window = new BrowserWindow({ width: 1440, height: 900, minWidth: 900, minHeight: 650, webPreferences: { preload: join(__dirname, '../preload/index.js'), contextIsolation: true, nodeIntegration: false } });
  if (process.env.ELECTRON_RENDERER_URL) window.loadURL(process.env.ELECTRON_RENDERER_URL); else window.loadFile(join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(() => {
  repository = new DataRepository(join(app.getPath('userData'), 'signal-desk.sqlite'), join(__dirname, '../../database/schema.sql'));
  registerNewsSourceHandlers(repository);
  registerArticleHandlers(repository);
  registerNotificationHandlers(repository);
  createWindow();
  const refreshTimer = setInterval(() => { void refreshAll(repository); }, 15 * 60 * 1000);
  app.on('before-quit', () => clearInterval(refreshTimer));
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { repository?.close(); if (process.platform !== 'darwin') app.quit(); });
