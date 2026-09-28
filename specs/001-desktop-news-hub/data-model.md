# Data Model: Desktop News Aggregator

## Core Entities

### NewsSource

Represents a publication or feed that contributes news items.

**Fields**:
- id: unique source identifier
- name: human-readable source label
- url: source feed URL
- category: optional classification such as politics, sports, technology
- isEnabled: whether the source is active
- refreshIntervalMinutes: default polling interval for that source
- lastCheckedAt: timestamp of most recent refresh
- createdAt: creation timestamp

**Relationships**:
- One source can produce many NewsItem records.
- One source can have many NotificationRule records.

**Validation rules**:
- URL must be valid and reachable or treated as a source error instead of a crash.
- Name must be non-empty.
- Refresh interval must be a positive integer.

### NewsItem

Represents an individual article, headline, or post fetched from a feed.

**Fields**:
- id: unique article identifier
- sourceId: the source that produced the item
- title: article headline
- summary: short description or excerpt
- link: canonical article URL
- publishedAt: timestamp from the feed
- fetchedAt: time the app ingested the item
- isRead: whether the user has opened or marked it as read
- isSaved: whether the item is bookmarked for later
- category: normalized topic if available

**Relationships**:
- Many items belong to one source.
- Each item may be referenced by saved lists and alert processing.

**Validation rules**:
- Title and link should be non-empty.
- Duplicate item detection should avoid storing multiple copies of the same story from the same source.
- Read/saved flags should default to false when first fetched.

### UserPreference

Stores application-level settings chosen by the user.

**Fields**:
- id: unique preference set identifier
- refreshIntervalMinutes: default polling cadence
- theme: light or dark UI mode
- enableNotifications: whether alerts are active
- defaultSortOrder: newest-first or source-first
- createdAt/updatedAt: audit timestamps

**Relationships**:
- One preference set is used by one user profile.

**Validation rules**:
- Refresh interval must be positive.
- Sort order must be an allowed value.

### NotificationRule

Defines a user-generated condition for alerts when new items match criteria.

**Fields**:
- id: unique alert rule identifier
- sourceId: optional source-specific restriction
- keyword: optional keyword filter
- category: optional category match
- enabled: whether the rule is active
- createdAt: creation timestamp

**Relationships**:
- One source may have multiple rules.
- Rules are evaluated during feed refresh and trigger alerts when a new item matches.

**Validation rules**:
- At least one match filter must be defined.
- Source or keyword/category must be valid and non-empty.

## State transitions

### Feed refresh lifecycle
- Inactive source -> Refresh scheduled -> Fetch attempt -> Success or failure -> Persist item updates -> Alert evaluation -> Return to ready state

### Article lifecycle
- New article -> Unread -> Read or saved -> Archived history

### Notification lifecycle
- Rule created -> Enabled -> Matching item arrives -> Notification emitted -> Rule remains active until disabled or deleted

## Relationship summary

- NewsSource 1..* NewsItem
- NewsSource 1..* NotificationRule
- UserPreference 1..1 application settings
