# Tasks: Favorite News

**Input**: Design documents from `/specs/002-favorite-news/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Tests are included because the feature specification defines independent test criteria and acceptance scenarios.

**Organization**: Tasks are grouped by user story so each increment can be implemented and validated independently.

## Existing Capabilities to Reuse

NewsPop already stores favorite state as `NewsItem.isSaved` / `articles.is_saved`, exposes updates through article-state IPC, and has a Saved tab. Do not add a duplicate favorite field, database table, cleanup task, or IPC channel. The implementation should complete the yellow-star interaction and verify/refine the existing saved list.

## Phase 1: Setup

**Purpose**: Use the existing NewsPop application and established favorite state.

No new project scaffolding or dependencies are required.

## Phase 2: Foundational

**Purpose**: Preserve the existing persistence and read-state contract used by both user stories.

No new storage or IPC foundation is required; both stories build on the existing `articles.is_saved` state and `articles:set-state` operation.

## Phase 3: User Story 1 - Mark a news item as a favorite (Priority: P1)

**Goal**: Toggle favorite status directly from an article and identify favorites with a yellow star.

**Independent Test**: Mark an article as a favorite and confirm its star becomes yellow; unmark it and confirm the star clears while the article and read state remain unchanged.

### Tests for User Story 1

- [ ] T001 [US1] Add a repository regression test in `app/tests/unit/article-history.test.ts` verifying that toggling `isSaved` does not alter `isRead` and that both states persist after reopening the SQLite database

### Implementation for User Story 1

- [ ] T002 [US1] Replace the text Save/Unsave article action with an accessible star toggle and localized favorite labels in `app/src/renderer/main.tsx`
- [ ] T003 [US1] Style inactive, yellow active, hover, and keyboard-focus star states in `app/src/renderer/light-theme.css`

**Checkpoint**: Story 1 is independently usable; article favorite state is visibly represented and can be toggled without changing read status.

## Phase 4: User Story 2 - Review favorite news later (Priority: P2)

**Goal**: Provide a clearly named favorite list containing only favorited articles, retain empty-state guidance, and keep original story links usable.

**Independent Test**: Favorite multiple articles, open the Favorites view, confirm it contains only those articles and their original links, then relaunch and confirm the same list remains.

### Tests for User Story 2

- [ ] T004 [US2] Add unit coverage in `app/tests/unit/article-filter.test.ts` proving the favorites view includes only saved articles while retaining each article's original link

### Implementation for User Story 2

- [ ] T005 [US2] Add a reusable article-view filter for all, favorites, and read states with source and keyword filters in `app/shared/models/article-filter.ts`
- [ ] T006 [US2] Wire the article feed to the tested view filter and name the saved view Favorites/Favoritas in both locales in `app/src/renderer/main.tsx`
- [ ] T007 [US2] Refine the no-favorites empty state and ensure the existing story link remains available in `app/src/renderer/main.tsx` and `app/src/renderer/light-theme.css`

**Checkpoint**: Story 2 is independently usable; the Favorites view lists only persistent favorites and provides a useful empty state.

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete feature against its acceptance scenarios without regressing current NewsPop behavior.

- [ ] T008 [P] Update manual favorite validation steps and expected yellow-star behavior in `specs/002-favorite-news/quickstart.md`
- [ ] T009 Run favorite-focused tests, the full test suite, and the production build; fix any regressions in `app/tests/`, `app/src/renderer/`, and `app/shared/models/`

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Existing app only; no setup task is needed.
- **Foundational (Phase 2)**: Existing saved state and IPC are already available; no blocking infrastructure task is needed.
- **User Story 1 (Phase 3)**: Can begin immediately; implement the visible toggle on top of persisted `isSaved` state.
- **User Story 2 (Phase 4)**: Depends on the favorite state from the foundation; it can be developed independently of the star styling once the existing state contract is retained.
- **Polish (Phase 5)**: Depends on both user stories.

### User Story Dependencies

- **US1 (P1)**: No dependencies on US2; delivers visible favorite marking and removal.
- **US2 (P2)**: Uses the same persisted favorite state; does not depend on the star's visual implementation.

### Parallel Opportunities

- T002 and T003 touch different files and can proceed in parallel after T001 establishes the expected star-toggle contract.
- T004 can be developed independently of the US1 UI work because the saved flag and article model already exist.
- T008 can be updated in parallel with UI implementation; T009 runs after the implementation tasks.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Add the persisted-state regression test.
2. Implement the accessible star toggle and yellow active styling.
3. Validate that toggling favorite state never changes read state.

### Incremental Delivery

1. Complete US1 to mark/unmark favorites with the yellow star.
2. Complete US2 to verify and refine the dedicated Favorites list and its empty state.
3. Run quickstart scenarios, full tests, and production build.

## Task Format Validation

All implementation tasks use a checkbox, sequential task ID, story label for user-story work, and an exact project-relative file path. The parallel marker is used only for independent file work.
