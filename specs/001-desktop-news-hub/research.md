# Research: Desktop News Aggregator

## Decision

- Use a desktop client architecture based on Electron + React for the UI and local feed processing.
- Store source configuration, saved articles, read flags, and user settings in a local SQLite database.
- Pull feed data through a scheduled refresh service with deduplication logic to prevent duplicate headlines across sources.
- Use desktop notifications only for user-enabled alert rules and high-priority source updates.

## Rationale

This product is primarily a personal news dashboard rather than a distributed platform. A local desktop client keeps the user experience simple, reduces network complexity, and avoids requiring a backend service to deliver the core functionality. The feature scope is bounded to a single-user workflow, which is well matched to local persistence and a lightweight desktop shell.

## Alternatives considered

### 1. Pure browser app
- Pros: Faster to prototype and easier to develop.
- Cons: Does not match the desktop requirement and weakens the experience for background refresh and notifications.
- Decision: Rejected because the requirement specifically targets a desktop application.

### 2. Cloud-backed aggregator service
- Pros: Better scaling and centralized data.
- Cons: Adds deployment and maintenance complexity that is not justified for a personal news reader.
- Decision: Rejected because the app needs to operate as a local desktop experience and the feature does not require shared multi-user data.

### 3. Minimal file-based storage only
- Pros: Very lightweight and easy to implement.
- Cons: Harder to manage article state, deduplication, and query filtering at scale.
- Decision: Rejected in favor of SQLite because filtering, persistence, and historical reads are key requirements.

### 4. Push-only notifications with no refresh scheduling
- Pros: Keeps the app lightweight.
- Cons: Less reliable and less predictable than scheduled polling.
- Decision: Rejected; the app needs periodic polling and refresh windows to reliably capture new stories from multiple sources.

## Key technical findings

- RSS and Atom feeds are the primary source format for v1; a parser abstraction should normalize each feed item before persistence.
- Duplicate detection should operate on a stable key such as URL + source ID + published time rather than text-only matching.
- Notification rules should be evaluated after a refresh completes, with a cooldown to avoid repeated alerts for the same item.
- Persistence should keep article state and source metadata separate to support filters, read status, and saved items without coupling them to feed refresh cycles.
