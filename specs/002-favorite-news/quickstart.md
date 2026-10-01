# Quickstart: Favorite News Validation

## Prerequisites

- Node.js 20+ and npm
- NewsPop dependencies installed in `app/`
- At least one feed containing article entries

## Automated checks

From `app/` run:

```powershell
npm test
npm run build
```

## Manual scenarios

1. Start the desktop app with `npm run dev` and load articles from a feed.
2. In the All view, use the star toggle on an article to mark it as a favorite. Confirm the star becomes yellow and the Favorites/Favoritas count increases.
3. Toggle the same article read/unread and then toggle the star again. Confirm the read state remains unchanged when favorite status changes.
4. Open the Favorites/Favoritas view. Confirm it contains only favorited items and not unread-only or non-favorited articles. Open one article's original story link to confirm it still works.
5. Toggle the star off. Confirm the article leaves the Favorites/Favoritas view but remains in the general feed and continues to keep its original read state.
6. Mark a story as a favorite, close and relaunch the app, then open Favorites/Favoritas. Confirm the favorite persists across application restarts.
7. With no favorites, open Favorites/Favoritas and confirm the empty state clearly tells the user to star an article to save it here.

## Current behavior summary

- Favorites are represented by the existing `isSaved` state and the yellow star toggle.
- Favorite state is independent from read/unread state.
- The Favorites/Favoritas view contains only saved articles.
- The original story link remains available from favorite items.
- Favorites are persisted locally across app restarts until the user removes them.
