# 发布流程说明

本项目已弃用 semantic-release，改用自定义的发布脚本 `scripts/release.ts`。

## 发布流程

### 1. 准备工作

确保你的工作目录是干净的，没有未提交的更改：

```bash
git status
```

如果有未提交的更改，请先提交：

```bash
git add .
git commit -m "feat: your changes"
```

### 2. 运行发布脚本

```bash
pnpm release
```

脚本会自动：

1. **检查工作目录状态**：确保没有未提交的更改
2. **分析 commit 信息**：根据 conventional commit 规范分析变更类型
3. **计算新版本号**：
   - `feat:` → 次版本号 +1
   - `fix:` 或 `perf:` → 修订版本号 +1
   - `BREAKING CHANGE` 或 `!` → 主版本号 +1
4. **生成 Changelog**：按类型分组显示变更内容
5. **更新版本号**：自动更新所有包的 `package.json` 版本
6. **创建 Git 标签**：创建版本标签
7. **推送更改**：推送代码和标签到远程仓库

### 3. 自动发布

当标签推送到 GitHub 后，GitHub Actions 会自动：

1. 构建所有包
2. 发布到 npm 仓库

## Conventional Commit 规范

发布脚本支持标准的 conventional commit 格式：

```
<type>(<scope>)?: <description>

[!] 或 [BREAKING CHANGE: <description>]
```

### 类型说明

- `feat:` - 新功能（次版本号 +1）
- `fix:` - 修复 bug（修订版本号 +1）
- `perf:` - 性能优化（修订版本号 +1）
- `docs:` - 文档更新（不影响版本号）
- `style:` - 代码格式调整（不影响版本号）
- `refactor:` - 代码重构（不影响版本号）
- `test:` - 测试相关（不影响版本号）
- `build:` - 构建相关（不影响版本号）
- `ci:` - CI/CD 相关（不影响版本号）
- `chore:` - 其他维护工作（不影响版本号）

### 示例

```bash
# 新功能
git commit -m "feat: add responsive layout support"

# 修复 bug
git commit -m "fix: resolve memory leak in resize observer"

# 破坏性变更
git commit -m "feat!: change API interface to use options object"

# 带作用域
git commit -m "feat(core): add debounce utility function"
```

## 手动发布（可选）

如果需要手动发布到 npm，可以在各个包目录下运行：

```bash
cd packages/vue-waterfall
pnpm publish --no-git-checks --access public
```

## 注意事项

1. **版本号同步**：所有包的版本号会自动同步
2. **Changelog 自动生成**：基于 commit 信息自动生成
3. **Git 标签**：自动创建和推送版本标签
4. **CI/CD 集成**：GitHub Actions 自动处理 npm 发布

## 故障排除

### 常见问题

1. **工作目录不干净**：确保所有更改都已提交
2. **权限问题**：确保有推送代码和标签的权限
3. **npm 认证**：确保 `NPM_TOKEN` 环境变量已设置

### 重置发布

如果发布出现问题，可以：

```bash
# 删除本地标签
git tag -d v<version>

# 删除远程标签
git push origin :refs/tags/v<version>

# 重置到上一个提交
git reset --hard HEAD~1
```
