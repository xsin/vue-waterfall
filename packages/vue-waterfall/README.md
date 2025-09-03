<h1 align="center">@xsin/vue-waterfall</h1>

<p align="center">
    Responsive masonry layout with SSR support and zero dependencies for Vue 3.
</p>


## Features

- 📱 **Responsive**: Responsive with configurable column width and gaps. Based on `ResizeObserver`.
- 🔁 **Reactive**: Reacts to property changes.
- 🪶 **Lightweight**: Zero external dependencies. Less than 1.6 kB.
- ⬅️ **RTL**: Supports LTR and RTL layouts.

## Installation

```bash
# yarn
$ yarn add @xsin/vue-waterfall

# pnpm
$ pnpm add @xsin/vue-waterfall

# npm
$ npm install @xsin/vue-waterfall
```

## Usage

```typescript
import { createApp } from 'vue'
import Waterfall from '@xsin/vue-waterfall'

const app = createApp()

app.use(Waterfall)
```

Props:

- `items`: Array of items. Required.
- `column-width`: Minimal width of columns in `px`. Can be either a `number`, or a non-empty array of `number`s. Defaults to `300`. If an array is passed, the first value will be used for the first column, the second value for the second column, and so on. If the array is shorter than the number of columns, the pattern will be repeated starting at the first value.
- `gap`: Spacing between items in `px`. Defaults to `0`.
- `rtl`: Toggles between LTR (`false`) and RTL (`true`) layouts. Defaults to `false`.
- `ssr-columns`: Number of server-side-rendered columns. Optional.
- `scroll-container`: Scrolling `HTMLElement` parent element that will be used for restoring scroll position. If omitted, `window` is used.
- `min-columns`: Minimum number of columns. `undefined` implies no constraint. Defaults to `undefined`, but will always be at least `1` in the output.
- `max-columns`: Maximum number of columns. `undefined` implies no constraint. Defaults to `undefined`. If `min-columns` is greater than `max-columns`, `min-columns` will take precedence.
- `keyMapper`: Optional mapper function that receives an item, its column index, its row index, and its index w.r.t. the `items` array and returns a unique key. Defaults to `(_item, _column, _row, index) => index`.

```vue
<script setup lang="ts">
const items = [
  {
    title: 'First',
    description: 'The first item.',
  },
  {
    title: 'Second',
    description: 'The second item.',
  },
]
</script>

<template>
  <masonry-wall :items="items" :ssr-columns="1" :column-width="300" :gap="16">
    <template #default="{ item, index }">
      <div :style="{ height: `${(index + 1) * 100}px` }">
        <h1>{{ item.title }}</h1>
        <span>{{ item.description }}</span>
      </div>
    </template>
  </masonry-wall>
</template>
```

### Adding items, removing items, and changing items

To add/remove/change items, assign a new value to the `items` property, e.g., `items.value = [...items.value, newItem]`.
**DO NOT** push items to the array, pop items from the array, or change items of the array (e.g., `items.value.push(newItem)`), as such mutations will not be detected by the reactivity and may result in rendering issues.
This is intentional, as the deep watchers required to properly handle those mutations would be too expensive for complex item types and large arrays.

### Limitations

This library intentionally doesn't handle elements with dynamically changing height, as this would cause constant changes of the column distribution.
As a consequence, the initial height of items is used.
For images, specifying aspect ratios can prevent unbalanced distributions.

All columns have the same width, specified by the `column-width` property.
In addition, the elements of items should not set a specific width and instead be full-width, e.g., use `width: 100%`.

### Nuxt 3

Create a plugin (e.g., `plugins/vue-waterfall.ts`) with the following code:

```ts
import Waterfall from '@xsin/vue-waterfall'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Waterfall)
})
```

## Development

To serve or build the demo, the library has to be built first using `pnpm dev` or `pnpm build`.

```bash
# install dependencies
$ pnpm install

# develop in watch mode
$ pnpm dev

# build for production
$ pnpm build

# lint project files
$ pnpm lint

# run tests
$ pnpm test
```

## Disclaimer

This component originated as a modified version of [vue-masonry-wall](https://github.com/DerYeger/yeger/tree/main/packages/vue-masonry-wall) by [Jan Müller](https://github.com/DerYeger).

## License

[MIT](https://github.com/xsin/vue-waterfall/blob/main/packages/vue-waterfall/LICENSE) - 
