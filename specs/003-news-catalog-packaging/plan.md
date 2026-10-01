# Implementation Plan: News Catalog and Windows Packaging

**Branch**: `003-news-catalog-packaging` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-news-catalog-packaging/spec.md`

## Summary

Provide a curated, categorized source catalog while preserving arbitrary manual RSS entry; package NewsPop for Windows with desktop/Start Menu shortcuts and a consistent custom icon; and maintain update compatibility for both SQLite data and renderer preferences. Reuse the existing catalog, Electron Builder NSIS configuration, icon assets, source-add IPC, stable `appId`, and non-destructive legacy database fallback. Verify or extend startup profile migration so Electron `localStorage` settings such as language survive changes in product identity.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20+

**Primary Dependencies**: Electron 44, React, electron-vite, rss-parser, better-sqlite3, electron-builder 26, Vitest

**Storage**: Existing SQLite database for sources, articles, alerts, and preferences; Electron Chromium profile/localStorage for language preference

**Testing**: Vitest unit/integration tests, production renderer/main build, live RSS parsing checks, and Windows NSIS install/upgrade validation

**Target Platform**: Windows 10+ x64 desktop, NSIS installer

**Project Type**: Existing Electron desktop application

**Performance Goals**: Catalog selection adds a source through the existing source workflow; startup migration runs once only when legacy data must be preserved.

**Constraints**: Keep the existing `appId` stable for in-place Windows upgrades; do not overwrite an existing user-data destination or delete legacy data; preserve SQLite records and Chromium profile preferences; keep manual feed entry and current app workflows working. No new runtime service is introduced for the bundled catalog.

**Scale/Scope**: One bundled catalog of at least 30 sources, currently 37 entries across Spanish national, international, and Spanish regional outlets; single-user local desktop installations.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution contains only unreplaced template placeholders and defines no enforceable project gates. Practical checks: reuse existing source-add and packaging infrastructure; avoid replacing user data during migration; test packaged install/upgrade behavior as well as app workflows.

## Project Structure

### Documentation (this feature)

```text
specs/003-news-catalog-packaging/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
```text
app/
├── build/
│   ├── icon.ico
│   └── newspop-icon.svg
├── main/
│   ├── index.ts
│   ├── ipc/news-sources.ts
│   └── services/feed-ingestion.ts
├── package.json
├── src/renderer/
│   ├── data/popular-sources.ts
│   └── main.tsx
└── tests/
    ├── integration/
    └── unit/
```

**Structure Decision**: Keep the source catalog as bundled application data and add selected entries through existing source IPC/persistence. Continue to package with electron-builder/NSIS and the existing ICO asset. Preserve `appId` and stable package identity; initialize any legacy profile/data copy before the Electron window/session opens, copy only when the target is absent, and never delete the source profile. Do not create new remote contracts or a catalog database table.

## Complexity Tracking

No constitution gate violations were identified.
