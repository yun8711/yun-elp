import type { Language } from 'element-plus/es/locale';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import ja from 'element-plus/es/locale/lang/ja';
import ar from 'element-plus/es/locale/lang/ar';
import { defaultLocale, type LocaleType } from './index';

const elementPlusLocales: Record<LocaleType, Language> = {
  'zh-cn': zhCn,
  en,
  ja,
  ar
};

/**
 * 根据 yun-elp locale 获取对应的 Element Plus 语言包
 */
export function getElementPlusLocale(locale: LocaleType = defaultLocale): Language {
  return elementPlusLocales[locale] ?? elementPlusLocales[defaultLocale];
}
