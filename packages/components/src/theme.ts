/**
 * KD-ELP 主题配置
 * 导出主题变量，允许用户自定义主题
 */

import './styles/index.scss';

/**
 * 主题类型定义
 */
export interface KdElpTheme {
  // 主色调
  primary?: string;
  primaryLight3?: string;
  primaryLight5?: string;
  primaryLight7?: string;
  primaryLight9?: string;
  primaryDark2?: string;

  // 功能色
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;

  // 文字颜色
  textPrimary?: string;
  textRegular?: string;
  textSecondary?: string;
  textPlaceholder?: string;
  textDisabled?: string;

  // 边框颜色
  border?: string;
  borderLight?: string;
  borderLighter?: string;
  borderExtraLight?: string;

  // 背景颜色
  bg?: string;
  bgPage?: string;
  bgOverlay?: string;

  // 圆角
  borderRadius?: string;
  borderRadiusSmall?: string;
  borderRadiusRound?: string;

  // 字体大小
  fontSizeExtraLarge?: string;
  fontSizeLarge?: string;
  fontSizeMedium?: string;
  fontSizeBase?: string;
  fontSizeSmall?: string;
  fontSizeExtraSmall?: string;
}

/**
 * 应用主题配置
 * @param theme 主题配置对象
 */
export function applyTheme(theme: KdElpTheme = {}): void {
  // 遍历主题配置，设置CSS变量
  Object.entries(theme).forEach(([key, value]) => {
    if (value) {
      // 转换camelCase为kebab-case
      const cssVarName = `--el-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      document.documentElement.style.setProperty(cssVarName, value);
    }
  });
}

/**
 * 重置为默认主题
 */
export function resetTheme(): void {
  // 获取所有已设置的主题相关CSS变量
  const computedStyle = getComputedStyle(document.documentElement);
  const allCssVars = Array.from(document.styleSheets)
    .filter(sheet => {
      try {
        return sheet.cssRules;
      } catch (e) {
        return false;
      }
    })
    .flatMap(sheet => Array.from(sheet.cssRules))
    .filter(
      (rule): rule is CSSStyleRule =>
        rule.type === CSSRule.STYLE_RULE && (rule as CSSStyleRule).selectorText === ':root'
    )
    .flatMap(rule => Array.from(rule.style))
    .filter(prop => prop.startsWith('--el-'));

  // 删除直接在root元素上设置的CSS变量
  allCssVars.forEach(prop => {
    if (document.documentElement.style.getPropertyValue(prop)) {
      document.documentElement.style.removeProperty(prop);
    }
  });
}

export default {
  applyTheme,
  resetTheme
};
