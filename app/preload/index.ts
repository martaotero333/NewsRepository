import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('newsApi', {
  listSources: () => ipcRenderer.invoke('sources:list'),
  addSource: (input: { name: string; url: string; category: string | null }) => ipcRenderer.invoke('sources:add', input),
  removeSource: (id: string) => ipcRenderer.invoke('sources:remove', id),
  refresh: () => ipcRenderer.invoke('sources:refresh'),
  listArticles: () => ipcRenderer.invoke('articles:list'),
  setArticleState: (id: string, state: { isRead?: boolean; isSaved?: boolean }) => ipcRenderer.invoke('articles:set-state', id, state),
  listNotificationRules: () => ipcRenderer.invoke('notifications:list'),
  addNotificationRule: (rule: { sourceId: string | null; keyword: string | null; category: string | null }) => ipcRenderer.invoke('notifications:add', rule),
  removeNotificationRule: (id: string) => ipcRenderer.invoke('notifications:remove', id)
});
