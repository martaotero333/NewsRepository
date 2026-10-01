# Data Model: Favorite News

## NewsItem

Represents a source article retained in the local news collection.

| Field | Existing representation | Constraints / behavior |
|---|---|---|
| id | `articles.id` / `NewsItem.id` | Stable article identifier |
| sourceId | `articles.source_id` / `NewsItem.sourceId` | References its source |
| title | `articles.title` / `NewsItem.title` | Required display text |
| summary | `articles.summary` / `NewsItem.summary` | Optional display text |
| link | `articles.link` / `NewsItem.link` | Original story destination |
| publishedAt | `articles.published_at` / `NewsItem.publishedAt` | Publication timestamp |
| isRead | `articles.is_read` / `NewsItem.isRead` | Boolean read state; independent of favorite state |
| isSaved | `articles.is_saved` / `NewsItem.isSaved` | Boolean favorite state; persists until explicitly toggled off |

## Favorite

A favorite is the `isSaved = true` state on a NewsItem. It is not a separate record. The existing Saved view selects these items. Toggling the favorite state changes only `isSaved`; it does not delete the article or alter `isRead`.

## Persistence

- Existing SQLite table: `articles` in `app/database/schema.sql`.
- Existing repository operations: `DataRepository.listArticles()` and `DataRepository.setArticleState()` in `app/main/services/data-repository.ts`.
- No schema migration or new table is required.
- No automatic expiration is applied to the favorite flag.
