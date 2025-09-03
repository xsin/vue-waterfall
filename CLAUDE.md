# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 waterfall layout component library with TypeScript support, featuring a monorepo structure with pnpm workspaces. The architecture separates core logic from Vue-specific implementations for framework portability.

## Architecture

### Monorepo Structure
```
├── packages/
│   ├── vue-waterfall/          # Vue 3 component wrapper
│   ├── vue-waterfall-core/     # Framework-agnostic core logic
│   └── tsconfig/               # Shared TypeScript configs
├── apps/
│   └── demo/                   # Demo application
└── pnpm-workspace.yaml         # Workspace configuration
```

### Core Architecture
- **Layered Design**: Vue wrapper → Core algorithm → Framework adapter
- **TypeScript Generics**: Full type safety with `<T>` support
- **Responsive**: Dynamic column calculation based on container width
- **SSR Compatible**: Server-side rendering support
- **Scroll Loading**: Built-in infinite scroll with debouncing

## Development Commands

### Package Management
```bash
# Install dependencies
pnpm install

# Development
pnpm dev                    # Run demo app
pnpm build                  # Build waterfall package
pnpm build:demo            # Build demo app

# Quality
pnpm lint                  # Lint all packages
pnpm lint:fix             # Auto-fix lint issues
pnpm type-check           # TypeScript check
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

### Build System
- **Vite**: Library build with ES/UMD outputs
- **TypeScript**: vue-tsc for type checking
- **pnpm catalogs**: Shared dependency management
- **Semantic Release**: Automated versioning

## Component API

### Props (`Waterfall<T>`)
- `items: T[]` - Array of items to display
- `columnWidth: number | [number, ...number[]]` - Column width(s)
- `gap: number` - Gap between items (default: 10)
- `rtl: boolean` - Right-to-left support
- `minColumns: number` - Minimum column count
- `maxColumns: number` - Maximum column count
- `ssrColumns: number` - SSR column count
- `scrollLoadThreshold: number` - Scroll load trigger distance
- `scrollLoadDisabled: boolean` - Disable scroll loading
- `scrollLoadDebounce: number` - Debounce delay (default: 200ms)

### Events
- `redraw` - Layout recalculated
- `redrawSkip` - Layout recalculation skipped
- `scrollLoadStart` - Scroll loading begins
- `scrollLoadEnd` - Scroll loading completes
- `scrollLoad` - Scroll threshold reached

### Algorithm
- **Greedy Placement**: Items placed in shortest column
- **Dynamic Calculation**: Column count based on container width
- **Resize Observer**: Debounced layout recalculation
- **Scroll Detection**: Threshold-based infinite scroll

## Key Technologies

- **Vue 3**: Composition API with `<script setup>`
- **TypeScript**: Full generic support with strict typing
- **Vite**: Modern build tooling
- **pnpm**: Monorepo workspace management
- **ESLint**: @antfu/eslint-config for code quality

## Quality Gates

- **Type Checking**: vue-tsc with strict mode
- **Linting**: ESLint with auto-fix
- **No Tests**: Manual testing via demo app
- **CI/CD**: GitHub Actions with semantic-release

## Common Patterns

### Vue Integration
```typescript
// Component usage
<Waterfall :items="photos" :column-width="300" @scroll-load="loadMore">
  <template #item="{ item }">
    <img :src="item.url" :alt="item.alt" />
  </template>
</Waterfall>
```

### Core Hook Usage
```typescript
const { getColumnWidthTarget, isLoading } = useWaterfall({
  items: ref([]),
  columns: ref([]),
  columnWidth: ref(300),
  gap: ref(10),
  // ... other props
})
```