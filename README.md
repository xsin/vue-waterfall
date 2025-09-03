# @xsin/vue-waterfall

[![Version](https://img.shields.io/npm/v/@xsin/vue-waterfall.svg?style=flat-square)](https://www.npmjs.com/package/@xsin/vue-waterfall)
[![License](https://img.shields.io/npm/l/@xsin/vue-waterfall.svg?style=flat-square)](https://github.com/xsin/vue-waterfall/blob/main/LICENSE)

<div align="right">

[English](README.en.md) | **中文**

</div>

一个现代化的 Vue 3 瀑布流布局组件，基于 TypeScript 构建，支持响应式设计、SSR、滚动加载和零依赖。

## ✨ 特性

- 🚀 **Vue 3 原生支持** - 基于 Composition API 和 `<script setup>` 语法
- 📱 **响应式布局** - 自动适应容器宽度，支持最小/最大列数限制
- 🔄 **滚动加载** - 内置滚动检测和加载更多数据功能
- 🎯 **SSR 友好** - 支持服务端渲染，可预设列数
- 🎨 **灵活配置** - 支持固定列宽、动态列宽、RTL 布局等
- 🧪 **完整测试** - 基于 Vitest 的单元测试覆盖
- 📦 **零依赖** - 不依赖任何第三方库
- 🔧 **TypeScript** - 完整的类型定义支持

## 📦 项目结构

```
vue-waterfall/
├── packages/
│   ├── vue-waterfall/           # 主组件包 @xsin/vue-waterfall
│   ├── vue-waterfall-core/      # 核心逻辑包 @xsin/vue-waterfall-core
│   ├── vite-plugin-lib/         # 构建工具包
│   └── tsconfig/                # TypeScript 配置包
├── apps/
│   └── demo/                    # 演示应用 (在线访问: https://xsin.github.io/vue-waterfall/)
└── .github/workflows/           # CI/CD 工作流
```

## 🚀 快速开始

### 在线演示

🎯 **Demo 应用**: [https://xsin.github.io/vue-waterfall/](https://xsin.github.io/vue-waterfall/)

> 在线体验组件的各种功能和配置选项，包括响应式布局、滚动加载等特性。

### 安装

```bash
npm install @xsin/vue-waterfall
# 或
pnpm add @xsin/vue-waterfall
# 或
yarn add @xsin/vue-waterfall
```

### 基本使用

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
  { id: '1', image: 'image1.jpg', title: '标题 1', content: '内容 1' },
  { id: '2', image: 'image2.jpg', title: '标题 2', content: '内容 2' },
])

// 滚动加载更多数据
function onScrollLoad() {
  // 加载更多数据的逻辑
  console.log('触发滚动加载')
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

### 滚动加载配置

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
    <!-- 默认插槽 -->
    <template #default="{ item }">
      <div class="item">{{ item.title }}</div>
    </template>
    
    <!-- 自定义滚动加载提示 -->
    <template #scrollLoader="{ isLoading, hasMore, error }">
      <div v-if="isLoading" class="loading">加载中...</div>
      <div v-else-if="!hasMore" class="no-more">没有更多数据了</div>
      <div v-else-if="error" class="error">{{ error }}</div>
    </template>
  </Waterfall>
</template>
```

## 📚 API 文档

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | `T[]` | `[]` | 数据源数组 |
| `columnWidth` | `number \| number[]` | `400` | 列宽（像素）或列宽数组 |
| `gap` | `number` | `0` | 列间距（像素） |
| `minColumns` | `number` | `1` | 最小列数 |
| `maxColumns` | `number` | - | 最大列数 |
| `rtl` | `boolean` | `false` | 是否启用 RTL 布局 |
| `ssrColumns` | `number` | `0` | SSR 预设列数 |
| `scrollContainer` | `HTMLElement \| null` | `null` | 滚动容器元素 |
| `scrollLoadThreshold` | `number` | `100` | 滚动加载触发阈值 |
| `scrollLoadDisabled` | `boolean` | `false` | 是否禁用滚动加载 |
| `scrollLoadDebounce` | `number` | `200` | 滚动加载防抖延迟 |
| `keyMapper` | `function` | - | 自定义 key 生成函数 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `redraw` | - | 重新绘制完成 |
| `redrawSkip` | - | 跳过重新绘制 |
| `scrollLoad` | - | 触发滚动加载 |
| `scrollLoadStart` | - | 开始滚动加载 |
| `scrollLoadEnd` | `error?: string` | 结束滚动加载 |

### Slots

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| `default` | `{ item, column, columnCount, row, index }` | 默认内容插槽 |
| `scrollLoader` | `{ isLoading, hasMore, error }` | 滚动加载提示插槽 |

### 暴露方法

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `setHasMore` | `(value: boolean)` | 设置是否还有更多数据 |
| `setError` | `(value: string)` | 设置错误信息 |
| `triggerScrollLoad` | - | 手动触发滚动加载 |

## 🛠️ 开发

### 环境要求

- Node.js 18+
- pnpm 8+

### 本地开发

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 运行演示应用
pnpm dev

# 运行测试
pnpm test

# 代码检查
pnpm lint
pnpm lint:fix

# TypeScript 类型检查
pnpm type-check
```

### 项目脚本

```bash
pnpm build              # 构建 vue-waterfall 包
pnpm build:demo         # 构建演示应用
pnpm dev                # 运行演示应用
pnpm pkg:dev           # 并行运行所有包的开发模式
pnpm pkg:test          # 并行运行所有包的测试
pnpm type-check        # TypeScript 类型检查
pnpm release           # 发布新版本
```

### Demo 部署

项目配置了自动化部署流程，当 `main` 分支的以下文件发生变化时，会自动构建并部署 demo 至 GitHub Pages：

- `apps/demo/**` - Demo 应用代码
- `packages/vue-waterfall/**` - 主组件包
- `packages/vue-waterfall-core/**` - 核心逻辑包

部署完成后，demo 将在 [https://xsin.github.io/vue-waterfall/](https://xsin.github.io/vue-waterfall/) 上可用。

## 🧪 测试

项目使用 Vitest 进行单元测试，测试覆盖了组件的核心功能：

- 组件安装和渲染
- SSR 列数配置
- 响应式数据变化
- 列宽和间距配置
- 滚动加载功能
- 生命周期钩子

运行测试：

```bash
pnpm test              # 运行所有测试
pnpm test:watch        # 监听模式运行测试
```

## 🔄 自动化发布

本项目使用 [semantic-release](https://semantic-release.gitbook.io/) 进行自动化版本管理和发布：

- **版本管理**：基于 [Conventional Commits](https://www.conventionalcommits.org/) 规范自动生成版本号
- **npm 发布**：自动发布到 npm 注册表
- **GitHub Release**：自动创建 GitHub 发布版本
- **Changelog**：自动生成更新日志

### 提交规范

```bash
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📄 许可证

本项目基于 [MIT 许可证](./LICENSE) 开源。

## 🙏 致谢

基于 [vue-masonry-wall](https://github.com/DerYeger/yeger/tree/main/packages/vue-masonry-wall) by [Jan Müller](https://github.com/DerYeger) 项目改写，去除 vue2 支持，增加了滚动加载等新功能。

---

<div align="center">

📖 **其他语言版本**: [English](README.en.md) | **中文**

</div>
