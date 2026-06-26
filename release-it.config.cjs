module.exports = {
  git: {
    // Git标签的格式
    tagName: 'v${version}',
    // 是否推送变更到远程仓库
    push: true,
    // 是否使用使用分支的标签来确定最新标签，默认 false，即只考虑主分支
    getLatestTagFromAllRefs: true,
    // 指定release-it 运行时当前分支，可以用数组指定多个
    requireBranch: ['main'], // 只有在master 才可以运行release-it
    // 是否在运行release-it之前，保持工作区干净，也就是所有文件已提交
    requireCleanWorkingDir: true,
    // 是否需要上游分支，如果没有上游分支，git push 不知道如何推送。一般在git 未推送到远程前设置为false
    requireUpstream: false,
    // 是否允许空提交，也就是在发新版本前，到上个版本之间，必须有commit，默认为false，即允许空提交
    requireCommits: true, // 不允许空提交发版
    // 完成升级后，提交的消息
    commitMessage: 'chore(release): 升级版本 ${version}'
  },
  npm: {
    // 不在 release-it 流程内发布 npm；主包见 publish:main，MCP 见 publish:mcp
    publish: false,
    //忽略 package.json 中的version 字段，使用git tag，默认 false
    ignoreVersion: false
  },
  github: {
    // 是否创建GitHub发布
    release: false,
    // 发布的名称格式
    releaseName: 'v${version}'
  },
  hooks: {
    // 在版本号更新后同步到 elp、mcp-server，并将修改加入 git 暂存区
    'after:bump':
      'tsx scripts/sync-version.ts && git add packages/elp/package.json packages/mcp-server/package.json'
  },
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      header: '# 📋 更新历史 \n\n',
      preset: {
        name: 'conventionalcommits',
        types: [
          { type: 'feat', section: 'Features' },
          { type: 'fix', section: 'Bug Fixes' },
          { type: 'style', section: 'Styles' },
          { type: 'refactor', section: 'Refactors' },
          { type: 'perf', section: 'Performance Improvements' }
        ]
      }
    }
  }
};
