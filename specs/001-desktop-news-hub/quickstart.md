# Quickstart Validation Guide

## Prerequisites

- Node.js 20 or newer
- npm or pnpm
- Desktop environment capable of running Electron applications
- At least one valid RSS or Atom feed URL for testing

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the desktop app in development mode:
   ```bash
   npm run dev
   ```
3. Add a sample feed such as a public news source or a local RSS test endpoint.

## Validation scenarios

### Scenario 1: Add and refresh a source
- Open the app and add a valid feed URL.
- Ensure the source appears in the sidebar or source list.
- Trigger a refresh.
- Verify that the newest headlines from the source are displayed in the main feed.

### Scenario 2: Read and save articles
- Select an unread headline.
- Mark it as read and then save it to a favorites list.
- Refresh the feed again and verify the article remains marked according to the chosen state.

### Scenario 3: Filter by source and keyword
- Add at least two news sources with different topics.
- Apply a source filter and verify only matching articles remain visible.
- Apply a keyword filter and verify the filtered list updates immediately.

### Scenario 4: Handle feed errors
- Add an invalid feed URL or temporarily disconnect the network.
- Attempt a refresh.
- Confirm the app shows a clear error message and does not crash.

### Scenario 5: Notification rule
- Enable alert rules for a specific keyword or source.
- Add a matching article.
- Verify that a desktop notification appears or an in-app alert is triggered.

## Expected outcomes

- Feed entries are displayed from multiple sources in one consolidated view.
- Read and saved state persist between sessions.
- Filters update the displayed set without reloading the entire app.
- Failed feeds are surfaced as errors rather than system failures.
