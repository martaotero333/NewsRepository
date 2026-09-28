import type { NewsItem, NewsSource } from '../../shared/models/types';
import type { NotificationRule } from '../../shared/models/notification-rule';

declare module '*.css';

type RefreshResult = {
  articles: NewsItem[];
  sources: NewsSource[];
  results: Array<{ sourceId: string; count: number; error: string | null }>;
};

declare global {
  interface Window {
    newsApi: {
      listSources(): Promise<NewsSource[]>;
      addSource(input: { name: string; url: string; category: string | null }): Promise<NewsSource>;
      removeSource(id: string): Promise<void>;
      refresh(): Promise<RefreshResult>;
      listArticles(): Promise<NewsItem[]>;
      setArticleState(id: string, state: { isRead?: boolean; isSaved?: boolean }): Promise<void>;
      listNotificationRules(): Promise<NotificationRule[]>;
      addNotificationRule(rule: { sourceId: string | null; keyword: string | null; category: string | null }): Promise<NotificationRule>;
      removeNotificationRule(id: string): Promise<void>;
    };
  }
}

export {};
