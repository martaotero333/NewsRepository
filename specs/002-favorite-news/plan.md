# Implementation Plan: Favorite News

**Branch**: `002-favorite-news` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-favorite-news/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Allow readers to mark articles as favorites, identify them with a yellow star, and consult them in a dedicated persistent list. Reuse NewsPop's existing article `isSaved` state, SQLite persistence, article-state IPC, and Saved tab rather than introducing a duplicate favorite store or table.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20+

**Primary Dependencies**: Electron, React, better-sqlite3, Vitest

**Storage**: Existing local SQLite `articles.is_saved` column

**Testing**: Vitest unit/integration suite and Electron production build

**Target Platform**: Windows desktop; renderer remains cross-platform Electron UI

**Project Type**: Existing Electron desktop application

**Performance Goals**: Favorite toggles update the visible article immediately after local persistence; filtering remains immediate for the local article collection.

**Constraints**: Favorites must persist across relaunches, remain independent from read status, and must not introduce automatic expiry or deletion. Existing manual source management and saved/read behavior must remain intact.

**Scale/Scope**: Single-user local library of RSS/Atom articles and their read/favorite states.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution contains only unreplaced template placeholders and defines no enforceable project gates. Practical checks: reuse the existing persistence model, avoid duplicate state, keep IPC context isolated, and validate the favorite toggle and list behavior with focused tests.

## Project Structure

### Documentation (this feature)

```text
specs/002-favorite-news/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
app/
├── main/
│   ├── ipc/articles.ts
│   └── services/data-repository.ts
├── database/schema.sql
├── preload/index.ts
├── shared/models/types.ts
├── src/renderer/
│   ├── main.tsx
│   └── light-theme.css
└── tests/
    ├── integration/news-flow.spec.ts
    └── unit/article-history.test.ts
```

**Structure Decision**: Keep favorites in the existing article record as `isSaved`. Extend the existing article action/view rather than adding a second favorite repository or IPC surface. UI changes belong in the renderer; persistence and read/favorite independence are covered through the existing repository and IPC contract.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
