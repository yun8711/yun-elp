import type { KdElpLocale, LocaleType } from '../../locale';

export interface KConfigProviderProps {
  /**
   * 组件库的语言设置
   * 可以是语言代码('zh-CN' | 'en-US')或完整的语言包对象
   */
  locale?: LocaleType | KdElpLocale;
}
