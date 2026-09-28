# Tasks: Desktop News Aggregator

**Input**: Design documents from `/specs/001-desktop-news-hub/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create the desktop app structure for app/main, app/renderer, app/shared, app/database, app/tests, and app/preload per the implementation plan
- [X] T002 Initialize the Electron + React + TypeScript project and add dependencies in app/package.json for Electron, React, SQLite, and feed parsing
- [X] T003 [P] Configure TypeScript, linting, formatting, and build scripts in app/tsconfig.json, app/eslint.config.* and app/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create the SQLite schema for NewsSource, NewsItem, UserPreference, and NotificationRule in app/database/schema.sql
- [X] T005 [P] Implement shared model types and validation logic for sources, articles, preferences, and notifications in app/shared/models/
- [X] T006 [P] Build the RSS/Atom feed ingestion abstraction and normalization layer in app/main/services/feed-ingestion.ts
- [X] T007 Implement the refresh scheduler and source polling orchestration in app/main/services/feed-refresh.ts
- [X] T008 Create the local persistence repository layer for feed records, user settings, and saved items in app/main/services/data-repository.ts
- [X] T009 Set up the Electron preload + IPC bridge for source, article, and settings requests in app/preload/index.ts and app/main/ipc/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and monitor multiple news sources (Priority: P1) 🎯 MVP

**Goal**: Allow users to add multiple feeds and see the latest headlines from all sources in one unified stream.

**Independent Test**: Add two valid feeds, refresh the app, and confirm that the newest articles from both sources appear in the main feed list without duplication.

### Implementation for User Story 1

- [X] T010 [P] [US1] Implement the NewsSource model and validation rules in app/shared/models/types.ts and app/shared/models/validation.ts with URL validation and refresh interval requirements
- [X] T011 [P] [US1] Create the source management service in app/main/services/source-manager.ts for add, remove, enable, and refresh actions
- [X] T012 [US1] Implement the source IPC handlers and error responses in app/main/ipc/news-sources.ts for add/remove/refresh flows
- [X] T013 [US1] Build the source management UI in app/src/renderer/main.tsx and app/src/renderer/styles.css
- [X] T014 [US1] Implement feed deduplication and update logic in app/main/services/data-repository.ts and app/main/services/feed-refresh.ts so duplicate stories are not reinserted from more than one source
- [X] T015 [US1] Add source status indicators and failed-feed messaging to the renderer in app/src/renderer/main.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Filter and prioritize reading (Priority: P2)

**Goal**: Let users filter, save, and track reads so the feed stays useful during high-volume news periods.

**Independent Test**: Add multiple sources, mark at least one item as read and one as saved, then apply a source or keyword filter and verify that the displayed list matches the selected criteria.

### Implementation for User Story 2

- [X] T016 [P] [US2] Implement the NewsItem model and article state fields in app/shared/models/types.ts, including title, summary, link, publishedAt, isRead, and isSaved requirements
- [X] T017 [P] [US2] Create the article repository queries for read/save/filter operations in app/main/services/data-repository.ts
- [X] T018 [US2] Implement mark-read and save/remove-save IPC handlers in app/main/ipc/articles.ts
- [X] T019 [US2] Build the main article feed view and saved-items handling in app/src/renderer/main.tsx and app/src/renderer/styles.css
- [X] T020 [US2] Add source/category/keyword filtering and sort options in app/src/renderer/main.tsx
- [X] T021 [US2] Persist article state to the local database and restore it after relaunch in app/main/services/data-repository.ts

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Stay updated with refresh rules and alerts (Priority: P3)

**Goal**: Keep the user informed of new and relevant items with configurable refresh intervals and notification rules.

**Independent Test**: Configure a refresh cycle and a rule tied to a keyword or source, then trigger a matching feed update and confirm that a desktop alert or in-app notification appears once for that item.

### Implementation for User Story 3

- [X] T022 [P] [US3] Implement the NotificationRule model and validation in app/shared/models/notification-rule.ts with required source or keyword/category filter semantics
- [X] T023 [P] [US3] Create the notification settings persistence and rule repository in app/main/services/notification-rule-repository.ts
- [X] T024 [US3] Add the alert rule UI and configuration form in app/src/renderer/components/AlertSettings.tsx
- [X] T025 [US3] Implement desktop notification dispatch and deduplication logic in app/main/services/desktop-notifications.ts
- [X] T026 [US3] Wire auto-refresh preference handling and user-configurable intervals into app/src/renderer/components/SettingsPanel.tsx and app/main/services/settings-store.ts
- [X] T027 [US3] Trigger rule matching after each refresh and avoid repeated alerts for the same item in app/main/services/feed-refresh.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T028 [P] Add integration contract coverage for the core news flow in app/tests/integration/news-flow.spec.ts
- [X] T029 [P] Add focused unit tests for source validation, article filtering, and notification matching in app/tests/unit/
- [X] T030 Run the quickstart validation scenarios from quickstart.md and fix any regressions in app/src/renderer/, app/main/, and app/shared/
- [X] T031 Improve layout polish, empty states, and accessibility across the desktop UI in app/src/renderer/main.tsx and app/src/renderer/styles.css
- [X] T032 Final code cleanup and documentation pass across app/main, app/src/renderer, app/shared, and app/database; document setup and validation in app/README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational; no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational; may integrate with US1 but remains independently testable
- **User Story 3 (P3)**: Can start after Foundational; may integrate with US1/US2 but remains independently testable

### Parallel Opportunities

- Phase 1 tasks T001-T003 can run in parallel where team capacity allows
- Phase 2 tasks T005-T009 are parallelizable once T004 schema initialization is complete
- User Story 1 tasks T010-T015 can be worked on in parallel where file ownership is split across source management, feed refresh, and UI layers
- User Story 2 tasks T016-T021 can be parallelized across data layer, IPC layer, and renderer logic
- User Story 3 tasks T022-T027 can be parallelized across alerts config, matching service, and notification UI
- Final polish tasks T028-T032 can run in parallel on validation, unit tests, and UI refinement

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the source-add and refresh flow independently
5. Stop and confirm the dashboard is usable before continuing

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. User Story 1 → source management and feed aggregation
3. User Story 2 → saved/read filtering and prioritization
4. User Story 3 → refresh intervals and notifications
5. Polish → validation, cleanup, and accessibility improvements

### Parallel Team Strategy

With multiple engineers:

1. Team completes Setup + Foundational together
2. Developer A focuses on User Story 1
3. Developer B focuses on User Story 2
4. Developer C focuses on User Story 3
5. Final validation tasks are completed jointly
