# vue-waterfall

[![Version](https://img.shields.io/npm/v/@xsin/vue-waterfall.svg?style=flat-square)](https://www.npmjs.com/package/@xsin/vue-waterfall)
[![License](https://img.shields.io/npm/l/@xsin/vue-waterfall.svg?style=flat-square)](https://github.com/xsin/vue-waterfall/blob/main/LICENSE)

一个现代化的 Vue 3 瀑布流布局组件，基于 TypeScript 构建，支持响应式设计、图片懒加载和动态数据加载。

## 📦 项目结构

```
vue-waterfall/
├── packages/
│   └── waterfall/           # 核心组件包 @xsin/vue-waterfall
├── apps/
│   └── demo/                # 演示应用
└── .github/workflows/       # CI/CD 工作流
```

## 🚀 快速开始

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

const dataSource = ref([
  { id: 1, image: 'image1.jpg', title: 'Title 1' },
  { id: 2, image: 'image2.jpg', title: 'Title 2' },
])

function loadMore() {
  // 加载更多数据
}
</script>

<template>
  <Waterfall
    :data="dataSource"
    :col="3"
    :gutter-width="16"
    @load-more="loadMore"
  >
    <template #item="{ record, index }">
      <div class="item">
        <img :src="record.image" :alt="record.title">
        <h3>{{ record.title }}</h3>
      </div>
    </template>
  </Waterfall>
</template>
```

## 📚 详细文档

- **[组件 API 文档](./packages/waterfall/README.md)** - 完整的 Props、Events、Methods 说明
- **[演示应用](./apps/demo/)** - 在线演示和示例代码
- **[更新日志](./packages/waterfall/CHANGELOG.md)** - 版本更新记录

## 🛠️ 开发

### 环境要求

- Node.js 24+
- pnpm 10+

### 本地开发

```bash
# 安装依赖
pnpm install

# 构建组件包
pnpm build

# 运行演示应用
pnpm dev

# 代码检查
pnpm lint
```

### 项目脚本

```bash
pnpm build          # 构建 waterfall 包
pnpm build:demo     # 构建演示应用
pnpm dev            # 运行演示应用
pnpm type-check     # TypeScript 类型检查
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

基于 [vue-waterfall-next](https://github.com/PineSongCN/vue-waterfall-next) 项目改写，适配 Vue 3 和 TypeScript。
