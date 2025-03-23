/**
 * 主题配置工具
 * 用于生成主题变量和配置
 */

// 默认主题配置
const defaultTheme = {
  // 主色调
  primary: '#1890ff',
  primaryLight3: '#4dabff',
  primaryLight5: '#80c2ff',
  primaryLight7: '#b3daff',
  primaryLight9: '#e6f5ff',
  primaryDark2: '#146ccc',

  // 功能色
  success: '#52c41a',
  warning: '#faad14',
  danger: '#f5222d',
  info: '#8c8c8c',

  // 文字颜色
  textPrimary: '#262626',
  textRegular: '#595959',
  textSecondary: '#8c8c8c',
  textPlaceholder: '#bfbfbf',
  textDisabled: '#d9d9d9',

  // 边框颜色
  border: '#e8e8e8',
  borderLight: '#f0f0f0',
  borderLighter: '#f5f5f5',
  borderExtraLight: '#fafafa',

  // 背景颜色
  bg: '#ffffff',
  bgPage: '#f5f5f5',
  bgOverlay: '#ffffff',

  // 圆角
  borderRadius: '4px',
  borderRadiusSmall: '2px',
  borderRadiusRound: '20px',

  // 字体大小
  fontSizeExtraLarge: '20px',
  fontSizeLarge: '18px',
  fontSizeMedium: '16px',
  fontSizeBase: '14px',
  fontSizeSmall: '13px',
  fontSizeExtraSmall: '12px',
}

/**
 * 生成CSS变量声明
 * @param {Object} theme - 主题配置对象
 * @returns {string} CSS变量声明块
 */
function generateCSSVariables (theme = defaultTheme) {
  const variables = []

  // 转换camelCase属性为kebab-case CSS变量
  for (const [key, value] of Object.entries(theme)) {
    // 转换camelCase为kebab-case
    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    variables.push(`  --el-${kebabKey}: ${value};`)
  }

  return `:root {\n${variables.join('\n')}\n}`
}

/**
 * 生成SCSS变量
 * @param {Object} theme - 主题配置对象
 * @returns {string} SCSS变量声明块
 */
function generateSCSSVariables (theme = defaultTheme) {
  const variables = []

  for (const [key, value] of Object.entries(theme)) {
    // 转换camelCase为kebab-case
    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    variables.push(`$el-${kebabKey}: ${value};`)
  }

  return variables.join('\n')
}

module.exports = {
  defaultTheme,
  generateCSSVariables,
  generateSCSSVariables,
}
