/**
 * yun-elp 国际化(i18n)配置
 */
import type { YunElpLanguage } from './type';
// 导入自定义语言包
import en from './lang/en-US';
import zhCn from './lang/zh-CN';

// 定义支持的语言代码
export type LocaleType = 'zh-cn' | 'en';

// 导出合并后的语言包
export const locales = {
  en: en,
  'zh-cn': zhCn
};

// 默认语言：简体中文
export const defaultLocale: LocaleType = 'zh-cn';

// 当前语言
let currentLocale: LocaleType = defaultLocale;

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

/**
 * 获取当前语言包
 * @returns 当前语言包
 */
export const getLocale = (locale: LocaleType = defaultLocale): YunElpLanguage => {
  return locales[locale];
};

export default {
  locales,
  defaultLocale,
  getLocale,
  setLocale,
  getLocaleCode
};
