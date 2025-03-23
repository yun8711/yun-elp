export default {
  git: {
    // 发布新版本时的提交信息
    commitMessage: "chore: release v${version}",
    // Git标签的格式
    tagName: "v${version}",
    // 是否推送变更到远程仓库
    push: true
  },
  npm: {
    // 不发布到npm仓库
    publish: false
  },
  github: {
    // 是否创建GitHub发布
    release: true,
    // 发布的名称格式
    releaseName: "v${version}"
  },
  plugins: {
    "@release-it/conventional-changelog": {
      // 使用Angular提交规范
      preset: "angular",
      // 变更日志文件路径
      infile: "CHANGELOG.md"
    }
  }
} 