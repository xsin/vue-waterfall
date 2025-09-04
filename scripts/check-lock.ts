#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')

type PackageManager = 'pnpm' | 'npm' | 'yarn'

interface LockFileInfo {
  manager: PackageManager
  file: string
  command: string
}

const LOCK_FILES: LockFileInfo[] = [
  { manager: 'pnpm', file: 'pnpm-lock.yaml', command: 'pnpm install' },
  { manager: 'npm', file: 'package-lock.json', command: 'npm install' },
  { manager: 'yarn', file: 'yarn.lock', command: 'yarn install' },
]

/**
 * 检测项目使用的包管理器
 */
function detectPackageManager(): PackageManager {
  // 按优先级检查锁文件
  for (const { manager, file } of LOCK_FILES) {
    if (existsSync(join(__dirname, '..', file))) {
      return manager
    }
  }
  
  // 默认使用 pnpm
  return 'pnpm'
}

/**
 * 获取指定包管理器的锁文件信息
 */
function getLockFileInfo(manager: PackageManager): LockFileInfo {
  const info = LOCK_FILES.find(item => item.manager === manager)
  if (!info) {
    throw new Error(`不支持的包管理器: ${manager}`)
  }
  return info
}

/**
 * 检查锁文件状态
 */
function checkLockFileStatus(lockFile: string): string {
  try {
    return execSync(`git status --porcelain ${lockFile}`, { encoding: 'utf-8' }).trim()
  }
  catch (error) {
    // 如果文件不存在，返回空字符串
    return ''
  }
}

/**
 * 执行安装命令
 */
function runInstallCommand(command: string): void {
  console.log(`🔄 运行 ${command} 更新依赖...`)
  execSync(command, { stdio: 'inherit' })
}

/**
 * 检查所有锁文件状态
 */
function checkAllLockFiles(): { manager: PackageManager, file: string, hasChanges: boolean }[] {
  return LOCK_FILES.map(({ manager, file }) => ({
    manager,
    file,
    hasChanges: checkLockFileStatus(file).length > 0,
  }))
}

/**
 * 提交锁文件
 */
function commitLockFiles(changedFiles: string[]): void {
  if (changedFiles.length === 0) {
    console.log('ℹ️  没有锁文件需要提交')
    return
  }

  console.log(`📝 检测到以下锁文件有更改: ${changedFiles.join(', ')}`)
  
  // 检查是否在交互式环境中
  if (!process.stdin.isTTY) {
    console.log('⚠️  非交互式环境，自动提交锁文件')
    try {
      // 添加所有更改的锁文件
      changedFiles.forEach(file => {
        execSync(`git add ${file}`, { stdio: 'inherit' })
      })
      
      // 提交
      execSync('git commit -m "chore: update lock files"', { stdio: 'inherit' })
      console.log('✅ 锁文件已提交')
    }
    catch (error) {
      console.error('❌ 提交锁文件失败:', error)
      process.exit(1)
    }
    return
  }

  console.log('是否提交这些锁文件？(y/N)')
  
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding('utf8')

  process.stdin.once('data', (data) => {
    const input = data.toString().toLowerCase().trim()
    process.stdin.setRawMode(false)
    process.stdin.pause()

    if (input === 'y' || input === 'yes') {
      try {
        // 添加所有更改的锁文件
        changedFiles.forEach(file => {
          execSync(`git add ${file}`, { stdio: 'inherit' })
        })
        
        // 提交
        execSync('git commit -m "chore: update lock files"', { stdio: 'inherit' })
        console.log('✅ 锁文件已提交')
      }
      catch (error) {
        console.error('❌ 提交锁文件失败:', error)
        process.exit(1)
      }
    }
    else {
      console.log('❌ 已取消提交锁文件')
      process.exit(1)
    }
  })
}

/**
 * 检查并更新锁文件
 */
export function checkLock(): void {
  try {
    console.log('🔍 检查锁文件状态...')
    
    // 检测包管理器
    const packageManager = detectPackageManager()
    const lockFileInfo = getLockFileInfo(packageManager)
    
    console.log(`📦 检测到包管理器: ${packageManager}`)
    console.log(`📄 锁文件: ${lockFileInfo.file}`)
    
    // 检查当前锁文件状态
    const currentStatus = checkLockFileStatus(lockFileInfo.file)
    
    if (currentStatus) {
      console.log(`⚠️  检测到 ${lockFileInfo.file} 有未提交的更改`)
      
      // 运行安装命令
      runInstallCommand(lockFileInfo.command)
      
      // 检查所有锁文件状态
      const allLockFiles = checkAllLockFiles()
      const changedFiles = allLockFiles
        .filter(({ hasChanges }) => hasChanges)
        .map(({ file }) => file)
      
      if (changedFiles.length > 0) {
        commitLockFiles(changedFiles)
      }
      else {
        console.log('ℹ️  锁文件无需更新')
      }
    }
    else {
      console.log(`✅ ${lockFileInfo.file} 状态正常`)
      
      // 即使当前锁文件正常，也检查是否有其他锁文件存在
      const allLockFiles = checkAllLockFiles()
      const changedFiles = allLockFiles
        .filter(({ hasChanges }) => hasChanges)
        .map(({ file }) => file)
      
      if (changedFiles.length > 0) {
        console.log('⚠️  检测到其他锁文件有未提交的更改')
        commitLockFiles(changedFiles)
      }
    }
  }
  catch (error) {
    console.error('❌ 检查锁文件失败:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  checkLock()
}
