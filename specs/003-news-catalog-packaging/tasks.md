# Tasks: News Catalog and Windows Packaging

**Input**: Design documents from `/specs/003-news-catalog-packaging/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Test tasks are included because the feature spec provides independent test criteria and acceptance scenarios for catalog behavior, installer surfaces, and profile compatibility.

**Organization**: Tasks are grouped by user story for independently testable increments. Existing catalog, NSIS, icon, source-add and SQLite capabilities should be reused and extended only where acceptance checks reveal gaps.

## Existing Capabilities to Reuse

NewsPop already has a 37-entry bundled catalog, manual RSS entry, source URL uniqueness, an NSIS installer with desktop/Start Menu shortcut settings, custom SVG/ICO artwork, a stable `appId`, and a legacy SQLite fallback. Do not add a new catalog service, duplicate source table, new installer framework, or new `appId`. The key known gap to validate is preserving renderer-profile settings such as `signal-desk-language` when legacy user data is copied.

## Phase 1: Setup

**Purpose**: Work in the existing NewsPop project; no new dependencies or scaffolding are required.

## Phase 2: Foundational

**Purpose**: Establish regression coverage for non-destructive user-profile migration before changing startup behavior.

- [x] T001 [P] Add migration tests in `app/tests/unit/user-data-migration.test.ts` proving an absent destination receives the legacy database and renderer profile, while a populated destination remains authoritative, is not overwritten or merged, and the legacy source remains intact

## Phase 3: User Story 1 - Add a catalog source without knowing its RSS URL (Priority: P1)

**Goal**: Keep the catalog and manual source entry as two paths into the same NewsPop source-add and refresh workflow.

**Independent Test**: Select a catalog entry without entering a URL, confirm it is added once and refreshes; then add an unlisted source through the manual URL form.

### Tests for User Story 1

- [x] T002 [P] [US1] Extend source-flow coverage in `app/tests/integration/news-flow.spec.ts` to verify a catalog entry and a manually entered feed use the same persisted NewsSource behavior and duplicate URLs are not inserted twice

### Implementation for User Story 1

- [x] T003 [US1] Verify or refine catalog selection, duplicate feedback, and manual URL entry in `app/src/renderer/main.tsx`; keep the bundled catalog at 30 or more unique feed URLs across national, international, and local scopes in `app/src/renderer/data/popular-sources.ts`

**Checkpoint**: Readers can add catalog and unlisted sources, and both types use the existing refresh and source-error behavior.

## Phase 4: User Story 2 - Find and upgrade NewsPop safely (Priority: P2)

**Goal**: Create desktop and Start Menu shortcuts and preserve the existing installation's data and preferences during upgrade.

**Independent Test**: Build and install NewsPop, confirm both shortcuts launch it, then upgrade a seeded legacy profile and confirm sources, articles/states, alerts, SQLite preferences, and language selection remain available without overwriting or deleting profile data.

### Tests for User Story 2

- [x] T004 [P] [US2] Add Windows packaging configuration checks in `app/tests/unit/windows-packaging.test.ts` for the stable `appId`, NewsPop product/shortcut names, default desktop and Start Menu shortcut creation, and configured icon paths

### Implementation for User Story 2

- [x] T005 [US2] Verify or configure NSIS to create NewsPop desktop and Start Menu shortcuts by default while retaining the existing `appId` and internal package identity in `app/package.json`
- [x] T006 [US2] Implement non-destructive legacy-profile migration in `app/main/services/user-data-migration.ts`: migrate the SQLite database and renderer profile/localStorage only when the canonical destination is absent; if both profiles contain data, keep the destination authoritative and leave the legacy profile untouched
- [x] T007 [US2] Run profile migration before opening the repository or creating a BrowserWindow, and keep the selected user-data path stable for the Chromium renderer profile in `app/main/index.ts`

**Checkpoint**: A clean install creates both shortcuts; an upgrade retains data and settings without destructive overwrite or automatic merge.

## Phase 5: User Story 3 - Recognize NewsPop by one custom icon (Priority: P3)

**Goal**: Use the same NewsPop artwork on all requested Windows and running-app surfaces.

**Independent Test**: Inspect the app window, executable, installer, uninstaller, desktop shortcut, and Start Menu shortcut; verify each displays the same icon.

### Implementation for User Story 3

- [x] T008 [US3] Configure or verify the existing `app/build/icon.ico` and `app/build/newspop-icon.svg` are consistently used by the executable, BrowserWindow, installer, uninstaller, desktop shortcut, and Start Menu shortcut in `app/package.json` and `app/main/index.ts`

**Checkpoint**: All six application surfaces use the same custom NewsPop icon without changing the stable Windows update identity.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Make the compatibility behavior repeatable and verify current NewsPop workflows still work.

- [x] T009 [P] Document catalog, clean-install, upgrade, profile-conflict, and icon inspection scenarios in `specs/003-news-catalog-packaging/quickstart.md`
- [x] T010 Run focused catalog/migration/packaging tests, the full test suite, production build, Windows NSIS packaging, and the quickstart upgrade checks; fix regressions in `app/tests/`, `app/main/`, `app/src/renderer/`, and `app/package.json`

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Existing project and dependencies are already present.
- **Foundational (Phase 2)**: T001 defines migration behavior before startup/profile changes.
- **User Story 1 (Phase 3)**: Can proceed independently using existing source-add infrastructure.
- **User Story 2 (Phase 4)**: T004 precedes packaging changes; T001 precedes profile migration; T006 precedes startup wiring in T007.
- **User Story 3 (Phase 5)**: Uses the existing icon asset and follows shortcut/package configuration in T005.
- **Polish (Phase 6)**: T010 follows implementation and runs release-level checks.

### User Story Dependencies

- **US1 (P1)**: Independent; catalog and manual source addition reuse existing NewsSource behavior.
- **US2 (P2)**: Depends on migration coverage T001; otherwise independent from US1.
- **US3 (P3)**: Depends on the same Windows package identity/configuration established for US2, but not on catalog behavior.

### Parallel Opportunities

- T001, T002, and T004 work in separate test files and can be prepared in parallel.
- T003 can proceed in parallel with the packaging tests/configuration because it owns renderer files.
- T005 and T006 touch separate files after their corresponding tests; T009 documentation can be updated alongside implementation.
- T007 follows T006; T008 follows package identity/shortcut settings to avoid conflicting edits to `app/package.json`.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Add source-flow regression coverage.
2. Confirm catalog selection, duplicate handling, and manual URL entry share existing source behavior.
3. Validate at least 30 unique catalog entries across all required geographic scopes.

### Incremental Delivery

1. Complete US1 catalog/manual source workflow.
2. Complete US2 desktop/Start Menu shortcuts and non-destructive profile migration.
3. Complete US3 icon consistency across all six requested surfaces.
4. Run full tests, production build, NSIS package, and upgrade validation.

## Task Format Validation

All tasks use checkbox markers and sequential IDs; user-story tasks carry `[US1]`, `[US2]`, or `[US3]`; `[P]` appears only on independent work; each task names the project-relative file(s) to modify or validate.
