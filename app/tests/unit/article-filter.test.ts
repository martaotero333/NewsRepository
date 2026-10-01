import { describe, expect, it } from 'vitest';
import { filterArticles } from '../../shared/models/article-filter';
import type { NewsItem } from '../../shared/models/types';

describe('article favorites view filter', () => {
  it('includes only saved articles and keeps each original story link', () => {
    const articles: NewsItem[] = [
      {
        id: 'a-1',
        sourceId: 'source-1',
        sourceName: 'Test source',
        title: 'Unread and not saved',
        summary: 'This article is not saved',
        link: 'https://example.com/unread-unsaved',
        publishedAt: '2026-01-01T00:00:00.000Z',
        fetchedAt: '2026-01-01T00:00:00.000Z',
        isRead: false,
        isSaved: false,
        category: 'news'
      },
      {
        id: 'a-2',
        sourceId: 'source-1',
        sourceName: 'Test source',
        title: 'Read and saved',
        summary: 'This article is saved but also read',
        link: 'https://example.com/read-saved',
        publishedAt: '2026-01-02T00:00:00.000Z',
        fetchedAt: '2026-01-02T00:00:00.000Z',
        isRead: true,
        isSaved: true,
        category: 'news'
      },
      {
        id: 'a-3',
        sourceId: 'source-2',
        sourceName: 'Another source',
        title: 'Unread and saved',
        summary: 'This article is saved but unread',
        link: 'https://example.com/unread-saved',
        publishedAt: '2026-01-03T00:00:00.000Z',
        fetchedAt: '2026-01-03T00:00:00.000Z',
        isRead: false,
        isSaved: true,
        category: 'feature'
      }
    ];

    const favoriteView = filterArticles(articles, { activeView: 'saved' });

    expect(favoriteView.map(article => article.id)).toEqual(['a-2', 'a-3']);
    expect(favoriteView.every(article => article.isSaved)).toBe(true);
    expect(favoriteView.every(article => /^https:\/\//.test(article.link))).toBe(true);
    expect(favoriteView).toEqual([
      expect.objectContaining({ id: 'a-2', link: 'https://example.com/read-saved' }),
      expect.objectContaining({ id: 'a-3', link: 'https://example.com/unread-saved' })
    ]);
  });
});
