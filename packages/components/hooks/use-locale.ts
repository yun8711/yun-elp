/**
 * 国际化钩子函数
 * 用于在组件中使用国际化文本
 */
import { computed, inject, type Ref } from '@vue/runtime-core';
import { getLocale, localeContextKey } from '../locale';
import type { LocaleType } from '../locale';
import type { YunElpLanguage } from '../locale/type';

/**
 * 在组件中使用国际化的hook
 * @returns 国际化相关方法
 */
export function useLocale() {
  // 尝试从上下文中获取国际化配置
  const locale: LocaleType | undefined = inject(localeContextKey, 'zh-cn');

  // 获取实际使用的语言包
  const resolvedLocale: Ref<YunElpLanguage> = computed(() => {
    // 如果没有注入的locale，则使用默认的
    return getLocale(locale);
  });

  /**
   * 翻译函数
   * @param path 翻译路径，如 'button.confirm'
   * @param options 翻译参数
   * @returns 翻译后的文本
   */
  const t = (path: string, options?: Record<string, any>) => {
    if (!path) return '';

    // 解析路径
    const paths = path.split('.');
    let current: YunElpLanguage = resolvedLocale.value;
    let value: any;
    for (let i = 0; i < paths.length; i++) {
      const key = paths[i];;
      value = current[key as keyof YunElpLanguage];
      if (i === paths.length - 1) return value || path;
      if (!value) return path;
      current = value;
    }

    // 处理参数替换
    if (options && value) {
      return replaceParams(value, options);
    }

    return value || path;
  };

  /**
   * 替换文本中的参数
   * @param text 文本
   * @param params 参数
   * @returns 替换后的文本
   */
  const replaceParams = (text: string, params: Record<string, any>) => {
    return text.replace(/\{(\w+)\}/g, (_, key) => {
      return params[key] ?? `{${key}}`;
    });
  };

  return {
    t,
    locale: resolvedLocale
  };
}
