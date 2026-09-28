import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { DataRepository } from '../../main/services/data-repository';

describe('article history persistence', () => {
  let directory: string;
  let repository: DataRepository;

  afterEach(() => {
    repository?.close();
    if (directory) rmSync(directory, { recursive: true, force: true });
  });

  it('keeps saved and read articles available after restart, including entries older than the latest 500', () => {
    directory = mkdtempSync(join(tmpdir(), 'signal-desk-history-'));
    const databasePath = join(directory, 'test.db');
    const schemaPath = join(process.cwd(), 'database/schema.sql');
    repository = new DataRepository(databasePath, schemaPath);
    const source = repository.addSource({ name: 'Test source', url: 'https://example.com/feed.xml', category: null });
    const fetchedAt = new Date().toISOString();
    const articles = Array.from({ length: 501 }, (_, index) => ({
      id: `article-${index}`,
      sourceId: source.id,
      sourceName: source.name,
      title: `Story ${index}`,
      summary: '',
      link: `https://example.com/story-${index}`,
      publishedAt: new Date(Date.UTC(2020, 0, 1, 0, 0, index)).toISOString(),
      fetchedAt,
      isRead: false,
      isSaved: false,
      category: null
    }));

    repository.saveArticles(articles);
    repository.setArticleState('article-0', { isRead: true, isSaved: true });
    repository.close();
    repository = new DataRepository(databasePath, schemaPath);

    const history = repository.listArticles();
    const oldestArticle = history.find(article => article.id === 'article-0');
    expect(history).toHaveLength(501);
    expect(oldestArticle).toMatchObject({ isRead: true, isSaved: true });
  });
});
