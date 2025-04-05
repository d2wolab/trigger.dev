# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands
```bash
pnpm run build                # Build all packages
pnpm run lint                 # Run linter
pnpm run typecheck            # Type check
pnpm run test --filter webapp # Run all tests for a workspace
pnpm run test ./path/to/file.test.ts --run # Run a specific test file
cd apps/webapp && pnpm run test # Run tests from specific directory
```

## Running the Application
```bash
pnpm run docker               # Start infrastructure services (PostgreSQL, Redis)
pnpm run app                  # Start webapp in development mode
# or 
pnpm run web                  # Alternative for starting webapp
# or
pnpm run dev:web              # Another alternative for starting webapp
```

## Code Style Guidelines
- **TypeScript**: Use strict mode. Types > interfaces. No enums. No default exports.
- **Imports**: Prefer isomorphic code over Node.js specific code
- **Formatting**: Double quotes, semicolons, 100 char width, 2 space indent
- **Naming**: Function declarations, no default exports
- **Error Handling**: No try/catch in tests, handle errors explicitly
- **Testing**: Never mock, stub or spy. Place tests next to source files.
- **Validation**: Use Zod extensively for validation
- **Structure**: Follow monorepo pattern with apps/, packages/, internal-packages/
- **Trigger Tasks**: Always use `@trigger.dev/sdk/v3`, export all tasks
- **Database**: Use Prisma client from `@trigger.dev/database` for PostgreSQL

## Known Issues
- Deployment indexing may fail with "Failed to fetch environment variables: Connection error" when attempting to run the indexer via `node /app/Users/shyou/AppData/Local/npm-cache/_npx/f51a09bd0abf5f10/node_modules/trigger.dev/dist/esm/entryPoints/deploy-index-controller.mjs`
- Docker builds may show warnings about sensitive data in ARG or ENV instructions for TRIGGER_SECRET_KEY