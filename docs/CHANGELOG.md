# Changelog

## 0.1.1

### 🐛 Fixes

- 将vue添加至peerDependencies (30960ad)
- Update import statements from MasonryWall to Waterfall and adjust environment requirements in README files (39b9bf9)
- Enhance publish workflow to support manual triggers and version extraction from package.json (367ef5f)
- Add npm authentication setup in publish workflow for secure package publishing (9a22750)


# Changelog

## 0.1.0

### ✨ Features

- Implement scroll loading feature in Demo component and enhance vue-waterfall-core with scroll load events and callbacks (1d0046e)

### 🐛 Fixes

- Migrate from semantic-release to custom release script and update package configurations for improved versioning and changelog management (61d26c2)
- Swap npm and git plugins in release.config.mjs for correct asset handling and disable npm publishing (39e215a)
- Add semantic-release changelog and git plugins to package.json and pnpm-lock.yaml for enhanced release management (ab640fb)
- Clean up pnpm-lock.yaml by removing unused semantic-release dependencies to optimize package management (92eb452)
- Update package.json and workflows to use npx for semantic-release and configure npm registry for publishing (62c3420)
- Update npm registry configuration in .npmrc and publish workflow for improved package management (212fb01)
- Remove npm registry configuration from .npmrc to streamline package management (deb4a33)
- Simplify concurrency group definition in publish workflow (098637d)
- Remove type check step from publish workflow to simplify CI process (7ae3ec2)
- Refactor build configuration in vite-plugin-lib to streamline entry and format handling (f646e6c)
- Update publish workflow to conditionally publish packages based on commit messages (9a78ecc)
- remove duplicated workflow files (083f4a8)
- Update GitHub Actions workflow to use latest versions of configure-pages and upload-pages-artifact (5d87000)
- Refactor build scripts in package.json and update workflows to use new build commands (5b85623)
- Remove vite-plugin-css-injected-by-js from pnpm-lock.yaml to streamline dependencies (f135fb1)
- Update build scripts and workflows to use parallel execution and simplify commands (a2cefdf)
- add release workflow (83aee63)
- Enhance vue-waterfall package, add linting scripts, refactor Waterfall component, implement scroll loading feature, and update tests for plugin installation. (942c241)


# Changelog

## 0.1.0

- 初始版本发布
- 支持 Vue 3 瀑布流布局
- 支持 SSR
- 零依赖设计
