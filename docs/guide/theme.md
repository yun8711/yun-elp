# 主题定制指南

KD-ELP 组件库支持主题定制，您可以使用我们提供的工具轻松地自定义和应用主题。

## 默认主题

KD-ELP 组件库默认提供了一套基于 Element Plus 的自定义主题，它在保持 Element Plus 良好设计的同时，进行了一些调整以更好地适应业务需求。

默认主题包括以下几个方面的自定义：

1. **色彩系统**：主色调、功能色、文字颜色、边框颜色和背景色
2. **字体**：字体大小、行高等
3. **圆角**：不同元素的圆角大小
4. **阴影**：不同层级的阴影效果

## 使用方式

### 基本使用

在使用 KD-ELP 组件库时，默认主题会自动应用，无需额外配置：

```js
import { createApp } from 'vue';
import KdElp from 'kd-elp';
import 'kd-elp/style'; // 导入样式会自动应用默认主题
import App from './App.vue';

const app = createApp(App);
app.use(KdElp);
app.mount('#app');
```

### 运行时自定义主题

您可以在运行时动态修改主题：

```js
import { createApp } from 'vue';
import KdElp, { applyTheme } from 'kd-elp';
import 'kd-elp/style';
import App from './App.vue';

const app = createApp(App);
app.use(KdElp);

// 应用自定义主题
applyTheme({
  primary: '#1677ff', // 修改主色调
  success: '#52c41a', // 修改成功色
  danger: '#ff4d4f', // 修改危险色
  borderRadius: '6px', // 修改圆角
  fontSizeBase: '16px' // 修改基础字体大小
});

app.mount('#app');
```

### 重置为默认主题

您可以随时重置回默认主题：

```js
import { resetTheme } from 'kd-elp/theme';

// 重置为默认主题
resetTheme();
```

## 主题变量

KD-ELP 主题系统基于 CSS 变量实现，所有的主题变量都以 `--el-` 为前缀。以下是可以自定义的主题变量：

### 主色调

| 变量名                       | 默认值  | 描述      |
| ---------------------------- | ------- | --------- |
| `--el-color-primary`         | #1890ff | 主色      |
| `--el-color-primary-light-3` | #4dabff | 主色亮色3 |
| `--el-color-primary-light-5` | #80c2ff | 主色亮色5 |
| `--el-color-primary-light-7` | #b3daff | 主色亮色7 |
| `--el-color-primary-light-9` | #e6f5ff | 主色亮色9 |
| `--el-color-primary-dark-2`  | #146ccc | 主色暗色2 |

### 功能色

| 变量名               | 默认值  | 描述   |
| -------------------- | ------- | ------ |
| `--el-color-success` | #52c41a | 成功色 |
| `--el-color-warning` | #faad14 | 警告色 |
| `--el-color-danger`  | #f5222d | 危险色 |
| `--el-color-info`    | #8c8c8c | 信息色 |

### 中性色

| 变量名                        | 默认值  | 描述           |
| ----------------------------- | ------- | -------------- |
| `--el-text-color-primary`     | #262626 | 主要文字色     |
| `--el-text-color-regular`     | #595959 | 常规文字色     |
| `--el-text-color-secondary`   | #8c8c8c | 次要文字色     |
| `--el-text-color-placeholder` | #bfbfbf | 占位符文字色   |
| `--el-text-color-disabled`    | #d9d9d9 | 禁用状态文字色 |

### 边框

| 变量名                          | 默认值  | 描述       |
| ------------------------------- | ------- | ---------- |
| `--el-border-color`             | #e8e8e8 | 边框色     |
| `--el-border-color-light`       | #f0f0f0 | 较浅边框色 |
| `--el-border-color-lighter`     | #f5f5f5 | 更浅边框色 |
| `--el-border-color-extra-light` | #fafafa | 最浅边框色 |

### 圆角

| 变量名                      | 默认值 | 描述         |
| --------------------------- | ------ | ------------ |
| `--el-border-radius-base`   | 4px    | 基础圆角     |
| `--el-border-radius-small`  | 2px    | 小圆角       |
| `--el-border-radius-round`  | 20px   | 圆形按钮圆角 |
| `--el-border-radius-circle` | 100%   | 圆形圆角     |

### 字体

| 变量名                       | 默认值 | 描述     |
| ---------------------------- | ------ | -------- |
| `--el-font-size-extra-large` | 20px   | 特大字号 |
| `--el-font-size-large`       | 18px   | 大字号   |
| `--el-font-size-medium`      | 16px   | 中等字号 |
| `--el-font-size-base`        | 14px   | 基础字号 |
| `--el-font-size-small`       | 13px   | 小字号   |
| `--el-font-size-extra-small` | 12px   | 特小字号 |

## 通过 CSS 文件覆盖

除了使用 JavaScript API 修改主题外，您还可以通过创建 CSS 文件覆盖变量来自定义主题：

```css
/* my-theme.css */
:root {
  --el-color-primary: #1677ff;
  --el-border-radius-base: 6px;
  --el-font-size-base: 16px;
}
```

然后在您的入口文件中导入这个 CSS：

```js
import 'kd-elp/style'; // 先导入基础样式
import './my-theme.css'; // 再导入自定义主题
```

## 不同的主题切换

您可以实现多主题切换功能：

```js
// 浅色主题
const lightTheme = {
  primary: '#1890ff',
  bg: '#ffffff',
  textPrimary: '#262626'
};

// 深色主题
const darkTheme = {
  primary: '#177ddc',
  bg: '#141414',
  textPrimary: '#ffffff'
};

// 切换主题函数
function toggleTheme(isDark) {
  if (isDark) {
    applyTheme(darkTheme);
  } else {
    applyTheme(lightTheme);
  }
}
```

## 组件级别样式覆盖

除了全局主题配置外，您还可以单独覆盖特定组件的样式：

```css
/* 覆盖按钮样式 */
.k-button.el-button--primary {
  font-weight: bold;
  letter-spacing: 1px;
}

/* 覆盖输入框样式 */
.el-input .el-input__inner {
  font-size: 16px;
}
```

## 最佳实践

1. **避免直接修改 Element Plus 类**：优先使用 KD-ELP 提供的主题变量进行定制
2. **保持一致性**：在整个应用程序中保持颜色、字体等一致
3. **运行时与构建时结合**：对于动态主题切换，使用运行时API；对于静态主题，可以使用CSS文件覆盖
4. **使用设计令牌（Design Tokens）**：将主题变量看作设计令牌，跨平台保持一致
