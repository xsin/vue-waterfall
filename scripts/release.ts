#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')

interface PackageInfo {
  name: string
  path: string
  version: string
  hasChanges: boolean
}

interface CommitInfo {
  hash: string
  message: string
  author: string
  date: string
  type: 'major' | 'minor' | 'patch' | 'none'
  scope?: string
  description: string
  breaking?: boolean
}

/**
 * 获取所有包的版本信息
 */
function getPackages(): PackageInfo[] {
  const packages = [
    { name: '@xsin/vue-waterfall', path: 'packages/vue-waterfall' },
    { name: '@xsin/vue-waterfall-core', path: 'packages/vue-waterfall-core' },
    { name: '@xsin/vite-plugin-lib', path: 'packages/vite-plugin-lib' },
  ]

  return packages.map((pkg) => {
    const packageJsonPath = join(__dirname, '..', pkg.path, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    return {
      ...pkg,
      version: packageJson.version,
      hasChanges: false,
    }
  })
}

/**
 * 分析 commit 信息，确定版本类型
 */
function analyzeCommit(message: string): { type: 'major' | 'minor' | 'patch' | 'none', scope?: string, description: string, breaking: boolean } {
  const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(([a-z0-9-]+)\))?(!)?: (.+)$/
  const match = message.match(conventionalCommitRegex)

  if (!match) {
    return { type: 'none', description: message, breaking: false }
  }

  const [, type, , scope, breaking, description] = match
  const isBreaking = breaking === '!' || description.includes('BREAKING CHANGE')

  let versionType: 'major' | 'minor' | 'patch' = 'patch'

  if (isBreaking) {
    versionType = 'major'
  }
  else if (type === 'feat') {
    versionType = 'minor'
  }
  else if (['fix', 'perf'].includes(type)) {
    versionType = 'patch'
  }

  return {
    type: versionType,
    scope,
    description,
    breaking: isBreaking,
  }
}

/**
 * 获取自上次发布以来的所有 commit
 */
function getCommitsSinceLastRelease(): CommitInfo[] {
  try {
    // 获取所有标签
    const tags = execSync('git tag --sort=-version:refname', { encoding: 'utf-8' }).trim().split('\n')
    const lastTag = tags[0] || ''

    // 获取自上次发布以来的 commit
    const range = lastTag ? `${lastTag}..HEAD` : 'HEAD'
    const commits = execSync(`git log ${range} --pretty=format:"%H|%s|%an|%ad" --date=short`, { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(line => line.length > 0)
      .map((line) => {
        const [hash, message, author, date] = line.split('|')
        const analysis = analyzeCommit(message)

        return {
          hash,
          message,
          author,
          date,
          ...analysis,
        }
      })
      .filter(commit => commit.type !== 'none')

    return commits
  }
  catch (error) {
    console.error('获取 commit 信息失败:', error)
    return []
  }
}

/**
 * 计算新的版本号
 */
function calculateNewVersion(currentVersion: string, commits: CommitInfo[]): string {
  if (commits.length === 0)
    return currentVersion

  const hasBreaking = commits.some(commit => commit.breaking)
  const hasFeature = commits.some(commit => commit.type === 'minor')

  let [major, minor, patch] = currentVersion.split('.').map(Number)

  if (hasBreaking || commits.some(commit => commit.type === 'major')) {
    major++
    minor = 0
    patch = 0
  }
  else if (hasFeature) {
    minor++
    patch = 0
  }
  else {
    patch++
  }

  return `${major}.${minor}.${patch}`
}

/**
 * 生成 changelog 内容
 */
function generateChangelog(commits: CommitInfo[], newVersion: string): string {
  if (commits.length === 0) {
    return `# Changelog\n\n## ${newVersion}\n\n- 无变更\n`
  }

  const groupedCommits = commits.reduce((groups, commit) => {
    const type = commit.type === 'major' ? 'breaking' : commit.type === 'minor' ? 'features' : 'fixes'
    if (!groups[type])
      groups[type] = []
    groups[type].push(commit)
    return groups
  }, {} as Record<string, CommitInfo[]>)

  let changelog = `# Changelog\n\n## ${newVersion}\n\n`

  if (groupedCommits.breaking?.length) {
    changelog += `### 🚨 Breaking Changes\n\n`
    groupedCommits.breaking.forEach((commit) => {
      changelog += `- ${commit.description} (${commit.hash.slice(0, 7)})\n`
    })
    changelog += '\n'
  }

  if (groupedCommits.features?.length) {
    changelog += `### ✨ Features\n\n`
    groupedCommits.features.forEach((commit) => {
      changelog += `- ${commit.description} (${commit.hash.slice(0, 7)})\n`
    })
    changelog += '\n'
  }

  if (groupedCommits.fixes?.length) {
    changelog += `### 🐛 Fixes\n\n`
    groupedCommits.fixes.forEach((commit) => {
      changelog += `- ${commit.description} (${commit.hash.slice(0, 7)})\n`
    })
    changelog += '\n'
  }

  return changelog
}

/**
 * 更新包的版本号
 */
function updatePackageVersion(packagePath: string, newVersion: string): void {
  const packageJsonPath = join(__dirname, '..', packagePath, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

  packageJson.version = newVersion
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)

  console.log(`✅ 更新 ${packageJson.name} 版本到 ${newVersion}`)
}

/**
 * 更新 changelog 文件
 */
function updateChangelog(newChangelog: string): void {
  const changelogPath = join(__dirname, '..', 'docs/CHANGELOG.md')

  // 如果 changelog 文件不存在，创建它
  if (!existsSync(changelogPath)) {
    writeFileSync(changelogPath, newChangelog)
  }
  else {
    // 在现有内容前插入新的 changelog
    const existingContent = readFileSync(changelogPath, 'utf-8')
    const updatedContent = `${newChangelog}\n${existingContent}`
    writeFileSync(changelogPath, updatedContent)
  }

  console.log('✅ 更新 CHANGELOG.md')
}

/**
 * 创建 git 标签
 */
function createGitTag(version: string): void {
  try {
    execSync(`git tag v${version}`, { stdio: 'inherit' })
    console.log(`✅ 创建标签 v${version}`)
  }
  catch (error) {
    console.error('创建标签失败:', error)
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  try {
    console.log('🚀 开始发布流程...\n')

    // 检查是否有未提交的更改
    const hasUncommittedChanges = execSync('git status --porcelain', { encoding: 'utf-8' }).trim().length > 0
    if (hasUncommittedChanges) {
      console.error('❌ 有未提交的更改，请先提交所有更改')
      process.exit(1)
    }

    // 获取包信息
    const packages = getPackages()
    console.log('📦 检测到的包:')
    packages.forEach(pkg => console.log(`  - ${pkg.name}: ${pkg.version}`))
    console.log()

    // 获取 commit 信息
    const commits = getCommitsSinceLastRelease()
    console.log(`📝 检测到 ${commits.length} 个相关 commit`)

    if (commits.length === 0) {
      console.log('ℹ️  没有需要发布的更改')
      return
    }

    // 计算新版本号
    const currentVersion = packages[0].version
    const newVersion = calculateNewVersion(currentVersion, commits)

    if (newVersion === currentVersion) {
      console.log('ℹ️  版本号无需更新')
      return
    }

    console.log(`🔄 版本号: ${currentVersion} → ${newVersion}\n`)

    // 生成 changelog
    const changelog = generateChangelog(commits, newVersion)
    console.log('📋 生成的 Changelog:')
    console.log(changelog)

    // 询问是否继续
    console.log('\n是否继续发布？(y/N)')
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    process.stdin.once('data', async (data) => {
      const input = data.toString().toLowerCase().trim()
      process.stdin.setRawMode(false)
      process.stdin.pause()

      if (input === 'y' || input === 'yes') {
        try {
          // 更新所有包的版本号
          packages.forEach(pkg => updatePackageVersion(pkg.path, newVersion))

          // 更新 changelog
          updateChangelog(changelog)

          // 提交更改
          execSync('git add .', { stdio: 'inherit' })
          execSync(`git commit -m "chore(release): ${newVersion}"`, { stdio: 'inherit' })

          // 创建标签
          createGitTag(newVersion)

          // 推送更改和标签
          execSync('git push origin main', { stdio: 'inherit' })
          execSync('git push --tags', { stdio: 'inherit' })

          console.log('\n🎉 发布流程完成！')
          console.log(`📦 新版本: ${newVersion}`)
          console.log('🚀 包将在 GitHub Actions 中自动发布到 npm')
        }
        catch (error) {
          console.error('❌ 发布流程失败:', error)
          process.exit(1)
        }
      }
      else {
        console.log('❌ 发布已取消')
        process.exit(0)
      }
    })
  }
  catch (error) {
    console.error('❌ 发布脚本执行失败:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main }
