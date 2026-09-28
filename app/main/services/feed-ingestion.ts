import Parser from 'rss-parser';
import { createHash } from 'node:crypto';
import type { NewsItem, NewsSource } from '../../shared/models/types';

const parser = new Parser();

export async function fetchFeed(source: NewsSource): Promise<NewsItem[]> {
  const feed = await parser.parseURL(source.url);
  const now = new Date().toISOString();
  return feed.items.filter(item => item.title && item.link).map(item => ({
    id: createHash('sha256').update(`${source.id}:${item.link}`).digest('hex'),
    sourceId: source.id,
    sourceName: source.name,
    title: item.title!.trim(),
    summary: (item.contentSnippet || item.content || '').replace(/<[^>]*>/g, '').trim().slice(0, 500),
    link: item.link!,
    publishedAt: item.isoDate || item.pubDate || now,
    fetchedAt: now,
    isRead: false,
    isSaved: false,
    category: source.category
  }));
}
