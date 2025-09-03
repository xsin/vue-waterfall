# @xsin/vue-waterfall

[![Version](https://img.shields.io/npm/v/@xsin/vue-waterfall.svg?style=flat-square)](https://www.npmjs.com/package/@xsin/vue-waterfall)
[![License](https://img.shields.io/npm/l/@xsin/vue-waterfall.svg?style=flat-square)](https://github.com/xsin/vue-waterfall/blob/main/LICENSE)

<div align="right">

**English** | [中文](README.md)

</div>

A modern Vue 3 waterfall layout component built with TypeScript, supporting responsive design, SSR, infinite scroll, and zero dependencies.

## ✨ Features

- 🚀 **Vue 3 Native Support** - Built on Composition API and `<script setup>` syntax
- 📱 **Responsive Layout** - Automatically adapts to container width with min/max column limits
- 🔄 **Infinite Scroll** - Built-in scroll detection and load more data functionality
- 🎯 **SSR Friendly** - Supports server-side rendering with preset column count
- 🎨 **Flexible Configuration** - Supports fixed column width, dynamic column width, RTL layout, etc.
- 🧪 **Complete Testing** - Unit test coverage based on Vitest
- 📦 **Zero Dependencies** - No dependency on any third-party libraries
- 🔧 **TypeScript** - Complete type definition support

## 📦 Project Structure

```
vue-waterfall/
├── packages/
│   ├── vue-waterfall/           # Main component package @xsin/vue-waterfall
│   ├── vue-waterfall-core/      # Core logic package @xsin/vue-waterfall-core
│   ├── vite-plugin-lib/         # Build tools package
│   └── tsconfig/                # TypeScript configuration package
├── apps/
│   └── demo/                    # Demo application (Online: https://xsin.github.io/vue-waterfall/)
└── .github/workflows/           # CI/CD workflows
```

## 🚀 Quick Start

### Online Demo

🎯 **Demo Application**: [https://xsin.github.io/vue-waterfall/](https://xsin.github.io/vue-waterfall/)

> Experience various component features and configuration options online, including responsive layout, infinite scroll, and other features.

### Installation

```bash
npm install @xsin/vue-waterfall
# or
pnpm add @xsin/vue-waterfall
# or
yarn add @xsin/vue-waterfall
```

### Basic Usage

```vue
<script setup lang="ts">
import { Waterfall } from '@xsin/vue-waterfall'

interface Item {
  id: string
  image: string
  title: string
  content: string
}

const dataSource = ref<Item[]>([
  { id: '1', image: 'image1.jpg', title: 'Title 1', content: 'Content 1' },
  { id: '2', image: 'image2.jpg', title: 'Title 2', content: 'Content 2' },
])

// Load more data on scroll
function onScrollLoad() {
  // Logic for loading more data
  console.log('Triggered scroll load')
}
</script>

<template>
  <Waterfall
    :items="dataSource"
    :column-width="300"
    :gap="16"
    :min-columns="2"
    :max-columns="4"
    @scroll-load="onScrollLoad"
  >
    <template #default="{ item, column, row, index }">
      <div class="waterfall-item">
        <img :src="item.image" :alt="item.title">
        <h3>{{ item.title }}</h3>
        <p>{{ item.content }}</p>
      </div>
    </template>
  </Waterfall>
</template>
```

### Infinite Scroll Configuration

```vue
<template>
  <Waterfall
    :items="dataSource"
    :scroll-load-threshold="100"
    :scroll-load-debounce="200"
    :scroll-load-disabled="false"
    @scroll-load="loadMore"
    @scroll-load-start="onLoadStart"
    @scroll-load-end="onLoadEnd"
  >
    <!-- Default slot -->
    <template #default="{ item }">
      <div class="item">{{ item.title }}</div>
    </template>
    
    <!-- Custom scroll load indicator -->
    <template #scrollLoader="{ isLoading, hasMore, error }">
      <div v-if="isLoading" class="loading">Loading...</div>
      <div v-else-if="!hasMore" class="no-more">No more data</div>
      <div v-else-if="error" class="error">{{ error }}</div>
    </template>
  </Waterfall>
</template>
```

## 📚 API Documentation

### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `T[]` | `[]` | Data source array |
| `columnWidth` | `number \| number[]` | `400` | Column width (pixels) or column width array |
| `gap` | `number` | `0` | Column gap (pixels) |
| `minColumns` | `number` | `1` | Minimum number of columns |
| `maxColumns` | `number` | - | Maximum number of columns |
| `rtl` | `boolean` | `false` | Whether to enable RTL layout |
| `ssrColumns` | `number` | `0` | SSR preset column count |
| `scrollContainer` | `HTMLElement \| null` | `null` | Scroll container element |
| `scrollLoadThreshold` | `number` | `100` | Scroll load trigger threshold |
| `scrollLoadDisabled` | `boolean` | `false` | Whether to disable scroll loading |
| `scrollLoadDebounce` | `number` | `200` | Scroll load debounce delay |
| `keyMapper` | `function` | - | Custom key generation function |

### Events

| Event Name | Parameters | Description |
|------------|------------|-------------|
| `redraw` | - | Redraw completed |
| `redrawSkip` | - | Redraw skipped |
| `scrollLoad` | - | Scroll load triggered |
| `scrollLoadStart` | - | Scroll load started |
| `scrollLoadEnd` | `error?: string` | Scroll load ended |

### Slots

| Slot Name | Scope Parameters | Description |
|-----------|------------------|-------------|
| `default` | `{ item, column, columnCount, row, index }` | Default content slot |
| `scrollLoader` | `{ isLoading, hasMore, error }` | Scroll load indicator slot |

### Exposed Methods

| Method Name | Parameters | Description |
|-------------|------------|-------------|
| `setHasMore` | `(value: boolean)` | Set whether there is more data |
| `setError` | `(value: string)` | Set error message |
| `triggerScrollLoad` | - | Manually trigger scroll load |

## 🛠️ Development

### Requirements

- Node.js 18+
- pnpm 8+

### Local Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run demo application
pnpm dev

# Run tests
pnpm test

# Code linting
pnpm lint
pnpm lint:fix

# TypeScript type checking
pnpm type-check
```

### Project Scripts

```bash
pnpm build              # Build vue-waterfall package
pnpm build:demo         # Build demo application
pnpm dev                # Run demo application
pnpm pkg:dev           # Run development mode for all packages in parallel
pnpm pkg:test          # Run tests for all packages in parallel
pnpm type-check        # TypeScript type checking
pnpm release           # Release new version
```

### Demo Deployment

The project is configured with an automated deployment workflow. When the following files change on the `main` branch, the demo will be automatically built and deployed to GitHub Pages:

- `apps/demo/**` - Demo application code
- `packages/vue-waterfall/**` - Main component package
- `packages/vue-waterfall-core/**` - Core logic package

After deployment, the demo will be available at [https://xsin.github.io/vue-waterfall/](https://xsin.github.io/vue-waterfall/).

## 🧪 Testing

The project uses Vitest for unit testing, covering the core functionality of the component:

- Component installation and rendering
- SSR column count configuration
- Responsive data changes
- Column width and gap configuration
- Infinite scroll functionality
- Lifecycle hooks

Run tests:

```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
```

## 🔄 Automated Release

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated version management and release:

- **Version Management**: Automatically generates version numbers based on [Conventional Commits](https://www.conventionalcommits.org/) specification
- **npm Publishing**: Automatically publishes to npm registry
- **GitHub Release**: Automatically creates GitHub releases
- **Changelog**: Automatically generates changelog

### Commit Convention

```bash
feat: new feature
fix: bug fix
docs: documentation update
style: code style adjustment
refactor: code refactoring
test: testing related
chore: build process or auxiliary tool changes
```

## 📄 License

This project is open source under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

Based on [vue-masonry-wall](https://github.com/DerYeger/yeger/tree/main/packages/vue-masonry-wall) by [Jan Müller](https://github.com/DerYeger), rewritten to remove Vue 2 support and add new features like infinite scroll.

---

<div align="center">

📖 **Other Language Versions**: **English** | [中文](README.md)

</div>
