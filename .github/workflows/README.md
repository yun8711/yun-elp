# GitHub Actions 文档部署说明

## 功能说明

此工作流会在推送到 `main` 分支时自动构建和部署组件文档到 GitHub Pages。

## 工作流程

1. **触发条件**: 推送到 `main` 分支或手动触发
2. **构建步骤**:
   - 安装依赖
   - 构建组件库
   - 构建主题样式
   - 构建解析器
   - 构建文档
3. **部署**: 将构建好的文档部署到 GitHub Pages

## 配置要求

### 1. 启用 GitHub Pages

在你的 GitHub 仓库中：

1. 进入 **Settings** → **Pages**
2. **Source** 选择 **GitHub Actions**
3. 保存设置

### 2. 验证配置

确保以下文件已正确配置：

- `.github/workflows/deploy-docs.yml` - 工作流文件
- `docs/.vitepress/config/index.ts` - 文档配置（base URL 已配置为 `/yun-elp/`）

## 访问文档

部署成功后，文档将在以下地址可用：
```
https://yun8711.github.io/yun-elp/
```

## 手动触发

你也可以在 GitHub Actions 页面手动触发文档部署：

1. 进入 **Actions** 标签页
2. 选择 **Deploy Docs** 工作流
3. 点击 **Run workflow**

## 故障排除

如果部署失败，请检查：

1. **构建日志**: 查看 Actions 中的详细日志
2. **依赖问题**: 确保所有依赖都正确安装
3. **权限问题**: 确保仓库有写入 Pages 的权限
4. **Base URL**: 确保文档配置中的 base URL 正确

## 测试验证

### 1. 快速配置检查

运行配置验证脚本：

```bash
node scripts/test-github-actions.js
```

这个脚本会检查：
- 工作流文件语法和配置完整性
- 必要的 package.json 脚本是否存在

### 2. 完整工作流测试

运行完整的工作流模拟测试：

```bash
node scripts/test-workflow.js
```

这个脚本会按顺序执行所有构建步骤，验证整个流程是否正常工作。

### 3. 单独测试各构建步骤

```bash
# 构建组件库
pnpm build:comp

# 构建样式
pnpm build:style

# 构建解析器
pnpm build:resolver

# 构建文档
pnpm build:docs

# 复制包配置
pnpm build:pkg
```

### 4. GitHub Actions 测试

**方法一：自动触发**
- 推送到 `main` 分支，工作流会自动运行

**方法二：手动触发**
- 在 GitHub 仓库的 **Actions** 标签页
- 选择 **Deploy Docs** 工作流
- 点击 **Run workflow** 按钮

**方法三：测试分支**
- 创建测试分支并推送
- 修改工作流触发条件添加测试分支
- 推送到测试分支验证

## 本地预览

在本地开发时，可以运行：

```bash
# 安装依赖
pnpm install

# 构建组件库
pnpm build:comp

# 启动文档开发服务器
pnpm docs:dev
```
