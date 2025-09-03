/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'docs/CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['docs/CHANGELOG.md'],
      },
    ],
    [
      '@semantic-release/npm',
      {
        // pnpm 的 catalog 协议与 npm 不兼容，因此不使用 npm 插件发布
        npmPublish: false,
      },
    ],
    '@semantic-release/github',
  ],
}
