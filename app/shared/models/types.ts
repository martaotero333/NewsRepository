export type NewsSource = {
  id: string;
  name: string;
  url: string;
  category: string | null;
  isEnabled: boolean;
  refreshIntervalMinutes: number;
  lastCheckedAt: string | null;
  errorMessage: string | null;
};

export type NewsItem = {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  summary: string;
  link: string;
  publishedAt: string;
  isRead: boolean;
  isSaved: boolean;
  category: string | null;
};

export type AddSourceInput = Pick<NewsSource, 'name' | 'url' | 'category'>;
