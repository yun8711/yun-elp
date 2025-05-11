/**
 * KD-ELP 国际化(i18n)配置
 * 基于 Element Plus 的国际化系统，添加自定义的语言内容
 */

// 导入 Element Plus 的语言包
// 使用Element Plus的类型
import type { Language } from 'element-plus/es/locale';
import elementEnUS from 'element-plus/es/locale/lang/en';
import elementZhCN from 'element-plus/es/locale/lang/zh-cn';
// 导入自定义语言包
import enUS from './lang/en-US';
import zhCN from './lang/zh-CN';

// 定义支持的语言代码
export type LocaleType = 'zh-CN' | 'en-US';

// 扩展后的语言包类型
export interface KdElpLocale extends Language {
  kdelp: typeof zhCN;
}

// 合并 Element Plus 语言包和自定义语言包
const mergeLanguages = (elementLocale: Language, customLocale: any): KdElpLocale => {
  return {
    ...elementLocale,
    kdelp: {
      ...customLocale
    }
  };
};

// 导出合并后的语言包
export const locales: Record<LocaleType, KdElpLocale> = {
  'en-US': mergeLanguages(elementEnUS, enUS),
  'zh-CN': mergeLanguages(elementZhCN, zhCN)
};

// 默认语言：简体中文
export const defaultLocale: LocaleType = 'zh-CN';

// 当前语言
let currentLocale: LocaleType = defaultLocale;

/**
 * 获取当前语言包
 * @returns 当前语言包
 */
export const getLocale = (): KdElpLocale => {
  return locales[currentLocale];
};

/**
 * 设置当前语言
 * @param locale 语言代码 ('zh-CN' | 'en-US')
 */
export const setLocale = (locale: LocaleType): boolean => {
  if (locales[locale]) {
    currentLocale = locale;
    return true;
  }
  return false;
};

/**
 * 获取当前语言代码
 * @returns 当前语言代码
 */
export const getLocaleCode = (): LocaleType => {
  return currentLocale;
};

export default {
  locales,
  defaultLocale,
  getLocale,
  setLocale,
  getLocaleCode
};
