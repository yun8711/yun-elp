import type { KdElpLocale, LocaleType } from '../../locale';
import type { ConfigProviderProps } from 'element-plus';

export interface KConfigProviderProps extends Omit<ConfigProviderProps, 'locale'> {
  /**
   * 组件库的语言设置
   * 可以是语言代码('zh-CN' | 'en-US')或完整的语言包对象
   */
  locale?: LocaleType | KdElpLocale;
  /**
   * 组件大小
   */
  size?: 'default' | 'large' | 'small';
  /**
   * 按钮配置
   */
  button?: {
    autoInsertSpace?: boolean;
  };
  /**
   * 消息配置
   */
  message?: {
    max?: number;
    grouping?: boolean;
    duration?: number;
    showClose?: boolean;
    offset?: number;
  };
  /**
   * 全局 zIndex
   */
  zIndex?: number;
}
