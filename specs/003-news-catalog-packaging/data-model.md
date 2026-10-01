# Data Model: News Catalog and Windows Packaging

## CatalogEntry

A bundled, curated choice displayed in the add-source catalog. Catalog entries are not persisted until selected.

| Field | Type / constraint | Purpose |
|---|---|---|
| name | Non-empty text | Outlet name shown to the reader |
| url | Valid feed URL; unique within catalog | Address used by the existing source workflow |
| scope | `national`, `international`, or `local` | Catalog grouping and geographic scope |
| region | Non-empty text | Country, region, or locality shown before adding |

The current catalog has 37 entries. URLs should be checked for uniqueness, supported scheme, and parseable RSS/Atom content as part of catalog validation.

## NewsSource

A source already persisted by NewsPop. Selecting a CatalogEntry creates the same record shape as manual source entry.

| Field | Existing representation | Constraint / behavior |
|---|---|---|
| id | `sources.id` / `NewsSource.id` | Stable local identifier |
| name | `sources.name` / `NewsSource.name` | Required source display name |
| url | `sources.url` / `NewsSource.url` | Required; unique in the existing repository |
| category | `sources.category` / `NewsSource.category` | Optional; catalog selection may use its region |
| isEnabled | `sources.is_enabled` / `NewsSource.isEnabled` | Existing source behavior |
| refresh metadata | Existing source fields | Continues to use normal refresh and error handling |

Catalog add and manual add must resolve to the same NewsSource and duplicate URL rule.

## UserProfile

Represents the existing local data and configuration that must remain available across upgrades.

- **SQLite profile**: Sources, articles, read/saved flags, notification rules, refresh and other persisted preferences.
- **Renderer profile**: Language preference stored as localStorage key `signal-desk-language`, plus any future persisted renderer preferences.
- Migration must preserve a populated destination, copy missing data only when safe, and leave the legacy source untouched for rollback.
- If both legacy and destination profiles are populated, the destination profile is authoritative; no automatic merge occurs and the legacy profile remains untouched.

## InstallationIdentity

Windows packaging identity and user-visible artwork. This is release metadata rather than a SQLite entity.

- Stable update identifier: existing `appId` `com.signaldesk.news`.
- User-visible product/shortcut name: `NewsPop`.
- Icon asset: one custom NewsPop design represented by source artwork and a multi-resolution Windows icon used across app and installer surfaces.
- Install locations: Windows application install folder, desktop shortcut, and Start Menu shortcut.
