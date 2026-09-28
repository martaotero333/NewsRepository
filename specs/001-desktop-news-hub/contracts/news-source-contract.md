# Contract: News Source Configuration

## Purpose

This contract defines how the desktop app accepts a news source configuration for feed registration and refresh behavior.

## Request model

```json
{
  "id": "source-001",
  "name": "Reuters World",
  "url": "https://example.com/feed.xml",
  "category": "world",
  "isEnabled": true,
  "refreshIntervalMinutes": 15
}
```

## Response model

```json
{
  "status": "success",
  "sourceId": "source-001",
  "message": "Source added successfully",
  "lastCheckedAt": "2026-09-24T12:00:00Z"
}
```

## Error response

```json
{
  "status": "error",
  "code": "INVALID_FEED_URL",
  "message": "The provided URL does not return a valid RSS or Atom feed."
}
```

## Contract rules

- The app must validate URL syntax before persisting the source.
- A feed refresh should return both successful items and error states without crashing the UI.
- Source settings must persist locally so the user can reopen the app without reconfiguring every feed.
