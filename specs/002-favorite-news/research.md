# Research: Favorite News

## Decisions

### Reuse the existing saved-article state
- **Decision**: Represent a favorite with the existing `NewsItem.isSaved` / SQLite `articles.is_saved` state.
- **Rationale**: The application already persists this state, exposes it through article-state IPC, and has a Saved view. A second favorite flag/table would duplicate behavior and risk inconsistent lists.
- **Alternatives considered**: Add a separate Favorite entity/table or rename saved state. Both add migration and synchronization work without user value for this single-user feature.

### Use a star toggle on each article
- **Decision**: Provide a compact accessible star control that toggles the existing favorite state and renders yellow when active.
- **Rationale**: Directly satisfies the requested visual signal and keeps marking/unmarking within one interaction.
- **Alternatives considered**: Retain a text-only Save action, which does not satisfy the star requirement; put controls only in the favorites list, which makes toggling less direct.

### Reuse the existing Saved view
- **Decision**: Present saved/favorite items through the existing Saved tab, improving its label or empty state only if needed to communicate favorites clearly.
- **Rationale**: The existing renderer already filters by `isSaved`, maintains counts, and exposes an empty state.
- **Alternatives considered**: Add a second Favorites tab, which duplicates the same articles and confuses users.

### Preserve current local retention
- **Decision**: Do not add expiry or cleanup. Keep the existing SQLite state update and source/article retention semantics.
- **Rationale**: Existing storage is local and persistent, and the feature explicitly requires favorites to survive relaunches and daily boundaries.
- **Alternatives considered**: A new persistence mechanism or scheduled cleanup; both conflict with the user requirements.

## Constraints

- Do not change read/unread semantics when toggling favorite state.
- Keep the current preload context isolation and article IPC path.
- Removing a favorite must not delete its article from the general feed.
