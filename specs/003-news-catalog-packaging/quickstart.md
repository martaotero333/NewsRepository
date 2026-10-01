# Quickstart: News Catalog and Windows Packaging

## Prerequisites

- Windows 10+ x64 for installer scenarios
- Node.js 20+ and npm
- Dependencies installed under `app/`
- Network access for live feed checks

## Automated validation

From `app/` run:

```powershell
npm test
npm run build
npm run dist -- --win nsis
```

Expected outcomes:

- All unit and integration tests pass.
- The Electron main, preload, and renderer production bundles build.
- A NewsPop NSIS installer and unpacked `NewsPop.exe` are produced.
- The effective package configuration retains the existing `appId`, sets the NewsPop product and shortcut names, enables desktop and Start Menu shortcuts, and points all requested icon surfaces to the custom icon.

## Source catalog scenarios

1. Start NewsPop and add one national, one international, and one regional/local catalog entry without entering a URL.
2. Confirm each appears in the source list, refreshes through the regular refresh action, and displays the existing source status/error state.
3. Attempt to add an already-connected catalog URL and confirm no duplicate source is created.
4. Add an unlisted RSS URL using the existing manual source form and confirm it continues to work.
5. Run the catalog endpoint validation with the application's configured parser and headers. Confirm there are at least 30 unique entries spanning all three scopes and record endpoints that need maintenance.

## Windows clean install

1. Build `npm run dist -- --win nsis`.
2. Install the generated NewsPop installer using the standard installation flow.
3. Confirm a NewsPop shortcut appears on the desktop and in the Start Menu and that both launch the app.
4. Inspect the running window, executable, installer, uninstaller, desktop shortcut, and Start Menu shortcut. Confirm they use the same custom icon.

## Windows upgrade and data compatibility

1. Prepare a legacy profile containing sources, articles with distinct read/saved states, notification rules, refresh preferences, and Spanish language selection.
2. Install the new version over the existing NewsPop installation.
3. Launch from both shortcuts and confirm every prepared source, article state, alert, preference, and language selection remains available.
4. Repeat with both a legacy profile and an already-populated destination profile; confirm the destination remains active, no data is automatically merged or overwritten, and the legacy profile remains intact.
5. Confirm legacy profile/database files remain present after migration so the upgrade is non-destructive.
6. Uninstall and reinstall without selecting an explicit user-data removal option; confirm user data remains available.

## Existing workflow regression checks

- Manually add an RSS URL not in the catalog.
- Refresh sources and confirm feed failures remain isolated and clearly reported.
- Confirm saved/read lists, filters, alerts, and language switching still work after installation and upgrade.
