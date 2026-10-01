# Research: News Catalog and Windows Packaging

## Decisions

### Keep the source catalog bundled and reuse source management
- **Decision**: Keep a curated list of catalog entries bundled with the renderer. Each entry exposes a display name, feed URL, geographic scope, and region. Adding an entry passes its existing name, URL, and region/category through the current source-add IPC and repository path.
- **Rationale**: NewsPop already has 37 catalog entries across national, international, and regional Spanish outlets, a catalog picker, duplicate prevention, manual URL entry, and the same refresh/error flow needed for both source types. A bundled catalog is available offline and needs no new service.
- **Alternatives considered**: Fetch a live catalog from a service, which adds availability and versioning dependencies; create a separate persistence path, which duplicates existing source records.
- **Feed validation**: The current catalog was checked with the production `rss-parser` configuration and returned parseable entries for all 37 entries. Keep endpoint checks in validation because publishers can change feeds independently of app releases.

### Preserve source URL uniqueness through the existing repository
- **Decision**: Continue using the existing source record and unique URL constraint; catalog and manual entries converge on the same add operation.
- **Rationale**: This prevents duplicate sources regardless of which entry path the reader uses and preserves the existing refresh lifecycle.
- **Alternatives considered**: Separate catalog-source records, which can duplicate an already-manually-added outlet.

### Package through the existing Windows NSIS configuration
- **Decision**: Continue using electron-builder's NSIS target, set NewsPop as the product and shortcut name, and configure desktop and Start Menu shortcuts to be created by default.
- **Rationale**: The repo already builds an NSIS installer and its effective configuration supports both shortcut targets.
- **Alternatives considered**: Add a second installer framework, which is unnecessary and risks changing install/update behavior.

### Preserve the stable Windows upgrade identity
- **Decision**: Keep `appId` `com.signaldesk.news` and the internal npm package name stable; use `productName` for the visible NewsPop brand.
- **Rationale**: Windows installer identity and Electron's default profile path must not drift when visible product branding changes. The current main process stores SQLite under `app.getPath('userData')` and has a legacy SQLite fallback from `%APPDATA%/Signal Desk`.
- **Alternatives considered**: Change `appId` or derive data identity from the new display name, which can create a parallel installation/profile and make existing data appear lost.

### Migrate data and renderer preferences non-destructively
- **Decision**: Before creating a BrowserWindow/session, retain the established user-data location where possible. If a migration is required, copy missing legacy content only into an absent destination, verify database and profile preference availability, and leave the legacy copy untouched. Preserve SQLite sources/articles/read/saved states/alerts/preferences and Chromium localStorage such as `signal-desk-language`.
- **Rationale**: Application settings are split between SQLite and Electron's persisted renderer profile. Copying only the database does not prove localStorage settings survive a profile-path change.
- **Alternatives considered**: Move/delete the old profile, which weakens rollback and risks losing unrecognized settings; blindly overwrite a populated profile, which can destroy newer data.
- **Conflict rule**: If both the canonical destination and legacy profile already contain data, the canonical destination remains active; do not merge the two profiles automatically, and leave the legacy profile untouched for manual recovery.

### Reuse the existing custom icon artwork and package it consistently
- **Decision**: Use the existing NewsPop SVG artwork and six-size Windows ICO. Apply the ICO to the app executable/window and NSIS installer, uninstaller, and shortcuts.
- **Rationale**: Existing assets already express the requested brand and are accepted by electron-builder; generating multiple independent icon files would risk mismatched appearance.
- **Alternatives considered**: Replace the artwork or use unrelated per-surface icons, which undermines visual consistency.

### No external contracts are required
- **Decision**: Do not create an external API contract. Document UI and installer behavior in the feature spec and quickstart.
- **Rationale**: The catalog and installer are internal desktop features and reuse existing IPC and packaging surfaces; no new network service is introduced.

## Compatibility Invariants

- Keep `appId` equal to `com.signaldesk.news` for updates of installed copies.
- Keep the package identity stable unless migration tests prove that a change is required.
- Never remove a legacy profile or source database as part of migration.
- Never overwrite an already-populated destination profile with legacy content.
- Do not change the SQLite schema solely to represent bundled catalog entries; a selected entry becomes an ordinary NewsSource.
