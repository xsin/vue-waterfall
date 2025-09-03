# GitHub Actions 工作流说明

本项目使用 GitHub Actions 进行自动化测试、构建和发布。

## 工作流概览

### 1. 测试工作流 (test)
- **触发条件**：推送到 main 分支或创建 PR
- **功能**：安装依赖、代码检查、构建测试
- **运行环境**：Ubuntu Latest

### 2. 发布工作流 (release)
- **触发条件**：
  - 推送 Git 标签（如 `v1.0.0`）
  - 手工触发（workflow_dispatch）
- **功能**：构建包、发布到 npm
- **运行环境**：Ubuntu Latest

### 3. 预览发布工作流 (pkg-pr-new)
- **触发条件**：推送到 main 分支或创建 PR
- **功能**：发布到 pkg.pr.new 预览服务
- **运行环境**：Ubuntu Latest

## 手工触发发布

### 方法 1：通过 GitHub 界面

1. 进入 GitHub 仓库页面
2. 点击 **Actions** 标签页
3. 选择 **Release and Publish** 工作流
4. 点击 **Run workflow** 按钮
5. 点击 **Run workflow** 确认

**注意**：手工触发时，版本号会自动从 `packages/vue-waterfall/package.json` 中读取，无需手动输入。

### 方法 2：通过 GitHub CLI

```bash
# 安装 GitHub CLI
# macOS
brew install gh

# 登录
gh auth login

# 触发工作流
gh workflow run "Release and Publish"
```

## 手工触发参数

| 参数 | 描述 | 必填 | 默认值 |
|------|------|------|--------|
| `force_release` | 强制发布（即使没有新提交） | ❌ | false |

## 发布流程详解

### 自动发布（Git 标签触发）

1. **创建标签**：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **工作流自动执行**：
   - 提取版本号：`v1.0.0` → `1.0.0`
   - 构建所有包
   - 设置 npm 认证
   - 发布到 npm 仓库

### 手工发布

1. **触发工作流**：通过 GitHub 界面或 CLI
2. **版本号读取**：自动从 `package.json` 读取当前版本号
3. **工作流执行**：
   - 使用 package.json 中的版本号
   - 构建所有包
   - 设置 npm 认证
   - 发布到 npm 仓库

## 环境变量

### 必需的环境变量

- `NPM_TOKEN`：npm 发布认证 token
- `GITHUB_TOKEN`：GitHub 操作权限 token（自动提供）

### 环境变量设置

在 GitHub 仓库设置中配置：

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 添加 `NPM_TOKEN`：
   - 名称：`NPM_TOKEN`
   - 值：从 npm 获取的访问 token

## 故障排除

### 常见问题

1. **认证失败**：
   - 检查 `NPM_TOKEN` 是否正确设置
   - 确认 token 有发布权限

2. **构建失败**：
   - 检查依赖是否正确安装
   - 查看构建日志中的具体错误

3. **发布失败**：
   - 确认版本号格式正确
   - 检查包名是否已存在

### 日志查看

1. 进入 **Actions** 标签页
2. 点击具体的工作流运行
3. 查看各个步骤的日志输出

## 最佳实践

1. **版本号管理**：使用语义化版本号（如：1.0.0、1.1.0、2.0.0）
2. **标签命名**：使用 `v` 前缀（如：`v1.0.0`）
3. **测试验证**：发布前确保所有测试通过
4. **文档更新**：发布后及时更新 CHANGELOG 和文档
