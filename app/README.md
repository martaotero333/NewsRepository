# NewsPop

NewsPop is a Windows desktop RSS/Atom news reader built with Electron, React, TypeScript, and SQLite.

## Development

Requirements: Node.js 20+ and npm.

```powershell
npm install
npm run dev
```

## Validation

```powershell
npm test
npm run build
```

## Windows installer

Build the Windows installer with:

```powershell
npm run dist -- --win nsis
```

The installer creates desktop and Start Menu shortcuts named NewsPop and uses the custom icon in `build/icon.ico`. The source artwork is `build/newspop-icon.svg`.

The source form includes a curated list of national Spanish, international, and regional Spanish RSS feeds. The manual URL form remains available for any other RSS or Atom feed.

The app stores its SQLite database in Electron's user data directory. Add feed URLs from the left sidebar, refresh sources manually, and use the article actions to mark stories read or save them.

## Structure

- `main/`: Electron main process, feed ingestion, persistence, IPC, and notifications
- `preload/`: context-isolated renderer bridge
- `src/renderer/`: React dashboard and visual styling
- `shared/`: shared domain models and validation
- `database/`: SQLite schema
- `tests/`: unit and integration tests
