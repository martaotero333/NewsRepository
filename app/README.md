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

The app stores its SQLite database in Electron's user data directory. Add feed URLs from the left sidebar, refresh sources manually, and use the article actions to mark stories read or save them.

## Structure

- `main/`: Electron main process, feed ingestion, persistence, IPC, and notifications
- `preload/`: context-isolated renderer bridge
- `src/renderer/`: React dashboard and visual styling
- `shared/`: shared domain models and validation
- `database/`: SQLite schema
- `tests/`: unit and integration tests
