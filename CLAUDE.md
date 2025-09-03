# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 waterfall layout component library built with TypeScript. The project uses a monorepo structure with pnpm workspaces, containing:

- **@xsin/vue-waterfall**: Core waterfall component package (`packages/waterfall/`)
- **@xsin/vue-waterfall-demo**: Demo application (`apps/demo/`)

## Architecture

### Monorepo Structure
```
├── packages/
│   └── waterfall/           # Core component library
│       ├── src/
│       │   ├── Waterfall/   # Main component
│       │   │   ├── Waterfall.vue
│       │   │   ├── types.ts
│       │   │   ├── constants.ts
│       │   │   └── hooks.ts
│       │   └── index.ts     # Package entry point
├── apps/
│   └── demo/               # Demo application using the component
└── pnpm-workspace.yaml     # Workspace configuration
```

### Component Architecture
- **Waterfall**: Main component with TypeScript generics support
- **Props**: `col`, `data`, `gutterWidth`, `isTransition`, `lazyDistance`, `loadDistance`, `interactive`
- **Emits**: `scroll`, `loadMore`, `finish`
- **Methods**: `resize()`, `mix()`

## Development Commands

### Core Commands
```bash
# Install dependencies
pnpm install

# Development
pnpm dev                    # Run demo app
pnpm build                  # Build waterfall package
pnpm build:demo            # Build demo app

# Code Quality
pnpm lint                  # Lint all packages
pnpm lint:fix             # Auto-fix lint issues
pnpm type-check           # TypeScript check

# Release
pnpm release              # Semantic release for waterfall package
```

### Package-Specific Commands
```bash
# Waterfall package
pnpm --filter @xsin/vue-waterfall build
pnpm --filter @xsin/vue-waterfall type-check
pnpm --filter @xsin/vue-waterfall lint

# Demo app
pnpm --filter @xsin/vue-waterfall-demo dev
pnpm --filter @xsin/vue-waterfall-demo build
```

## Build System

### Vite Configuration
- **Waterfall Package**: Library build with UMD and ES formats
- **Demo App**: Standard Vite app with TailwindCSS
- **TypeScript**: Full type checking with vue-tsc
- **CSS**: Less preprocessing, CSS injection

### Build Outputs
- `dist/waterfall.es.js` - ES module
- `dist/waterfall.umd.js` - UMD module
- `dist/waterfall.es.d.ts` - TypeScript declarations
- `dist/waterfall.css` - Styles

## Technology Stack

- **Vue 3**: Composition API with TypeScript
- **Build**: Vite + vue-tsc
- **Styling**: Less + TailwindCSS (demo)
- **Linting**: ESLint with @antfu/eslint-config
- **Package Manager**: pnpm with workspaces
- **CI/CD**: GitHub Actions with semantic-release

## Contributing Guidelines

### Commit Convention
Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Tests
- `chore:` - Build/tooling changes

### Development Workflow
1. Install dependencies: `pnpm install`
2. Make changes in `packages/waterfall/src/`
3. Test with demo: `pnpm dev`
4. Build and check: `pnpm build && pnpm type-check`
5. Lint: `pnpm lint:fix`

### Testing
- No unit tests currently configured
- Manual testing via demo app
- CI runs type-check and lint on PRs