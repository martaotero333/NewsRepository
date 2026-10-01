# Feature Specification: Favorite News

**Feature Branch**: `002-favorite-news`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "Añadir la posibilidad de marcar noticias como favoritas y consultar posteriormente la lista de noticias favoritas. Visualmente que se represente con una estrella amarilla."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mark a news item as a favorite (Priority: P1)

A reader sees an article they want to keep and marks it as a favorite. A visible yellow star makes its favorite status easy to recognize, and the reader can undo the action later.

**Why this priority**: Marking an item is the essential action needed to build a useful favorites list.

**Independent Test**: From a displayed news item, mark it as a favorite and confirm that it is clearly shown with a yellow star; remove the favorite and confirm the indicator disappears.

**Acceptance Scenarios**:

1. **Given** a news item that is not a favorite, **When** the reader marks it as a favorite, **Then** the item is added to favorites and a yellow star is visible.
2. **Given** a news item that is a favorite, **When** the reader removes it from favorites, **Then** it is no longer in the favorites list and its yellow star is removed.
3. **Given** a news item is marked as read or unread, **When** the reader changes its favorite status, **Then** its read status remains unchanged.

---

### User Story 2 - Review favorite news later (Priority: P2)

A reader opens a dedicated favorites view to find previously selected articles and return to their original stories.

**Why this priority**: The ability to review favorites later is the user value delivered by saving them.

**Independent Test**: Mark multiple articles as favorites, open the favorites view, and confirm it lists those items and allows opening their original stories.

**Acceptance Scenarios**:

1. **Given** the reader has marked one or more articles as favorites, **When** they open the favorites view, **Then** only those articles are listed.
2. **Given** the reader has favorites from an earlier session, **When** they reopen the application and visit the favorites view, **Then** the same favorites remain available.
3. **Given** the reader has no favorites, **When** they open the favorites view, **Then** a clear empty state is shown.

### Edge Cases

- Removing the favorite status must not remove the article from the general news feed or change its read status.
- A favorite remains available when its source publishes newer articles.
- If a source is unavailable, previously marked favorites remain reviewable.
- If a favorite article cannot be opened because its original link is unavailable, it remains listed and its favorite status is retained.
- Repeatedly selecting the favorite control must not create duplicate entries.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow readers to mark a displayed news item as a favorite and remove that status later.
- **FR-002**: The system MUST represent favorite status with a clearly visible yellow star.
- **FR-003**: The system MUST provide a dedicated view that lists only the reader's favorite news items.
- **FR-004**: The system MUST preserve favorite status across application restarts and MUST NOT automatically clear favorites daily.
- **FR-005**: The system MUST allow readers to open a favorite item at its original story link.
- **FR-006**: The system MUST keep favorite status independent from whether an item is read or unread.
- **FR-007**: The system MUST show a clear empty state when no items have been marked as favorites.
- **FR-008**: Removing an item from favorites MUST remove it from the favorites view without deleting the article from the general feed.

### Key Entities *(include if feature involves data)*

- **NewsItem**: A news story displayed to the reader, including its title, source, publication date, original link, read status, and favorite status.
- **Favorite**: The reader's choice to retain a news item for later access; it remains associated with that item until the reader removes it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reader can mark or unmark a displayed news item as a favorite in no more than two interactions.
- **SC-002**: The favorites view contains every favorited article and no non-favorited articles after a change in favorite status.
- **SC-003**: Favorite status remains unchanged after application restart and after the passage of a day, unless the reader explicitly removes it.
- **SC-004**: In usability testing, at least 90% of readers can locate and open a previously favorited article within 10 seconds.
- **SC-005**: Readers can identify favorite items by their yellow star without opening the article.

## Assumptions

- Favorites are stored for the current local user and do not require account sign-in or cross-device synchronization.
- Favorite status is retained until the reader explicitly removes it; no automatic expiration is applied.
- The existing news feed continues to provide each article's original link.
