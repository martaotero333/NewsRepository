import type { NewsItem } from './types';

export type ArticleView = 'all' | 'saved' | 'read' | 'favorites';

export type ArticleFilterOptions = {
  activeView?: ArticleView;
  activeSource?: string;
  query?: string;
};

export function filterArticles(
  articles: NewsItem[],
  { activeView = 'all', activeSource = 'all', query = '' }: ArticleFilterOptions = {}
): NewsItem[] {
  const normalizedView = activeView === 'favorites' ? 'saved' : activeView;
  const normalizedQuery = query.trim().toLowerCase();

  return articles.filter(article => {
    const textMatch = !normalizedQuery || `${article.title} ${article.summary}`.toLowerCase().includes(normalizedQuery);
    const viewMatch = normalizedView === 'all' || (normalizedView === 'saved' ? article.isSaved : article.isRead);
    const sourceMatch = activeSource === 'all' || article.sourceId === activeSource;

    return textMatch && viewMatch && sourceMatch;
  });
}
