# Claude Coding Guidelines for Trigger.dev

## Build/Lint/Test Commands
```bash
pnpm run build                # Build all packages
pnpm run lint                 # Run linter
pnpm run typecheck            # Type check
pnpm run test --filter webapp # Run all tests for a workspace
pnpm run test ./path/to/file.test.ts --run # Run a specific test file
cd apps/webapp && pnpm run test # Run tests from specific directory
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