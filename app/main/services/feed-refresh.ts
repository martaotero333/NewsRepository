import type { DataRepository } from './data-repository';
import { fetchFeed } from './feed-ingestion';
import { notifyMatchingItems } from './desktop-notifications';
import type { NewsItem } from '../../shared/models/types';

export async function refreshAll(repository: DataRepository) {
  const refreshedItems: NewsItem[] = [];
  const results = await Promise.all(repository.listSources().filter(source => source.isEnabled).map(async source => {
    try {
      const items = await fetchFeed(source);
      repository.saveArticles(items);
      refreshedItems.push(...items);
      repository.markSourceChecked(source.id, null);
      return { sourceId: source.id, count: items.length, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to refresh source.';
      repository.markSourceChecked(source.id, message);
      return { sourceId: source.id, count: 0, error: message };
    }
  }));
  const articles = repository.listArticles();
  notifyMatchingItems(refreshedItems, repository.listNotificationRules());
  return { results, articles, sources: repository.listSources() };
}
