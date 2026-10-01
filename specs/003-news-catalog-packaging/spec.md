# Feature Specification: News Catalog and Windows Packaging

**Feature Branch**: `003-news-catalog-packaging`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "Create a new NewsPop feature for the next version with three improvements: add a predefined catalog of popular RSS sources while retaining manual RSS entry; configure Windows installation to create desktop and Start Menu shortcuts; add a custom NewsPop icon for the application, executable, installer, uninstaller, and shortcuts. Existing functionality must continue working, and existing application data and configuration compatibility must be preserved."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a popular news source without knowing its feed URL (Priority: P1)

A reader wants to follow a well-known news outlet but does not know its RSS address. They browse a curated catalog, select an outlet, and add it directly. Readers who need a source not listed can still enter its feed address manually.

**Why this priority**: A ready-to-use catalog reduces setup effort and makes the app easier to adopt, while retaining manual entry preserves flexibility.

**Independent Test**: Select a catalog outlet and add it without typing a URL; verify it appears among the reader's sources and can be refreshed. Then add an unlisted source through the manual URL form.

**Acceptance Scenarios**:

1. **Given** the source catalog is available, **When** the reader selects a listed outlet and chooses Add, **Then** the source is added without requiring the reader to know or enter its feed URL.
2. **Given** the catalog contains national, international, and regional/local outlets, **When** the reader browses it, **Then** they can identify each outlet and its geographic scope before adding it.
3. **Given** a source is not in the catalog, **When** the reader enters its RSS URL manually, **Then** the source can still be added through the existing manual workflow.
4. **Given** a catalog source has already been added, **When** the reader attempts to add it again, **Then** the app prevents a duplicate source or clearly reports that it is already connected.

---

### User Story 2 - Find NewsPop after installation (Priority: P2)

A Windows user installs or upgrades NewsPop and expects to find it from the desktop and Start Menu without locating the installation folder.

**Why this priority**: Reliable shortcuts make the installed desktop application discoverable and easy to launch.

**Independent Test**: Install NewsPop using the standard Windows installer and verify a NewsPop shortcut is created on both the desktop and in the Start Menu and launches the application.

**Acceptance Scenarios**:

1. **Given** a user completes a standard Windows installation, **When** they inspect the desktop, **Then** a NewsPop shortcut is present.
2. **Given** a user completes a standard Windows installation, **When** they open the Start Menu, **Then** a NewsPop shortcut is present.
3. **Given** the user launches NewsPop from either shortcut, **When** the application opens, **Then** the existing news sources, saved/read states, alerts, and preferences remain available.

---

### User Story 3 - Recognize NewsPop consistently by its custom icon (Priority: P3)

A user recognizes NewsPop by one custom visual identity wherever the application is shown during normal use and installation.

**Why this priority**: A consistent icon makes the application identifiable and gives the installer and its shortcuts a finished product identity.

**Independent Test**: Inspect the running application, installed program entry, executable, installer, uninstaller, and both shortcuts; verify each uses the same custom NewsPop artwork and the NewsPop product name.

**Acceptance Scenarios**:

1. **Given** NewsPop is running or installed, **When** the user sees the application window, executable, installer, uninstaller, or shortcut, **Then** the custom NewsPop icon is used consistently.
2. **Given** an existing NewsPop installation is upgraded, **When** the new version is installed, **Then** existing user data and configuration remain available without manual migration or re-entry.

### Edge Cases

- A reader chooses a catalog source already connected through either the catalog or manual entry; the app must not create a duplicate.
- A catalog feed becomes unavailable or invalid; the app must surface the usual source error and leave other sources and manual entry unaffected.
- A listed outlet changes or retires its feed address; the app must communicate an add/refresh failure clearly rather than appearing to add working coverage.
- A user upgrades from an earlier NewsPop installation whose data is stored under the previous application identity; the upgrade must retain or migrate that data and preferences.
- An installer is run where the user declines optional shortcuts, if the installer presents such a choice; declined shortcuts must not block installation or damage existing configuration.
- A user uninstalls and reinstalls without choosing to remove user data; saved articles, sources, alerts, and preferences remain available.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a curated catalog of at least 30 popular RSS news sources.
- **FR-002**: The catalog MUST include clearly identified national, international, and regional/local news outlets, using Spain as the national and regional/local reference market.
- **FR-003**: The system MUST allow a reader to add a selected catalog source without manually entering or knowing its RSS URL.
- **FR-004**: The existing manual RSS URL entry workflow MUST remain available and continue to accept sources that are not in the catalog.
- **FR-005**: Catalog entries MUST provide enough identifying information for a reader to distinguish the outlet and its geographic scope before adding it.
- **FR-006**: Adding an already connected catalog source MUST NOT create a duplicate source.
- **FR-007**: Catalog sources MUST use the app's existing source refresh and error-reporting behavior.
- **FR-008**: A standard Windows installation MUST create a NewsPop shortcut on the desktop and in the Start Menu.
- **FR-009**: The system MUST provide one custom NewsPop icon consistently for the application window, executable, installer, uninstaller, desktop shortcut, and Start Menu shortcut.
- **FR-010**: Installing a new version over an existing NewsPop installation MUST preserve or compatibly migrate existing sources, articles, saved/read states, alerts, language selection, refresh preferences, and other user configuration.
- **FR-011**: Installing or removing shortcuts MUST NOT delete user data or change existing app behavior outside the requested catalog and branding improvements.
- **FR-012**: Existing core workflows, including manual source entry, feed refresh, filters, favorites, read tracking, alerts, and language selection, MUST continue to work after upgrading.

### Key Entities *(include if feature involves data)*

- **Catalog Source**: A curated news outlet offered for one-step addition, identified by its display name, geographic scope, and feed destination.
- **News Source**: A source followed by the reader after adding it from the catalog or entering it manually; it continues to participate in normal refresh and error handling.
- **Installation Shortcut**: A launch entry for NewsPop made available from the Windows desktop or Start Menu and identified by the app's product name and custom icon.
- **User Data and Configuration**: The reader's existing sources, articles and states, notification rules, language, and preferences that must remain available through an upgrade.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reader can add a source from the catalog in three or fewer interactions without typing a feed URL.
- **SC-002**: The catalog contains at least 30 sources spanning national, international, and regional/local outlets.
- **SC-003**: In usability testing, at least 90% of readers can locate and add a catalog source on their first attempt.
- **SC-004**: After a standard Windows installation, both the desktop and Start Menu contain a launchable NewsPop shortcut.
- **SC-005**: All six requested application surfaces (window, executable, installer, uninstaller, desktop shortcut, Start Menu shortcut) display the same custom NewsPop icon.
- **SC-006**: In upgrade validation, 100% of pre-existing user sources, saved/read states, alerts, and preferences remain available after installing the new version.
- **SC-007**: Readers can still add an unlisted feed manually and complete a refresh after using the catalog feature.

## Assumptions

- Spain is the national market and regional/local reference because NewsPop's current interface and curated feed catalog are oriented toward Spanish-language readers; international outlets are also included.
- “Popular” means recognizable outlets selected for broad geographic and topic coverage; the catalog is curated by the application rather than generated from a live ranking.
- The catalog's feed destinations are maintained with the application and may be updated in later releases; catalog availability does not guarantee a publisher will always keep a feed online.
- The standard installer creates both shortcuts by default; any user-facing option to decline shortcut creation remains optional and does not affect user data.
- Application identity changes must retain compatibility with the existing NewsPop data and settings location; user data is retained on uninstall unless the user explicitly chooses otherwise.
