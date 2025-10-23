import type { LocaleType } from '../../../locale';
import type {
  ConfigProviderProps,
  DialogProps,
  DrawerProps,
  ElTooltipProps,
  Placement,
  PopoverProps,
  PaginationProps
} from 'element-plus';
import type { PropType, ExtractPublicPropTypes } from '@vue/runtime-core';
import type { ButtonProps as YButtonProps } from '../../button/src/button';
import type { EmptyProps } from '../../empty/src/empty';

type PlacementType =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

// 定义扩展的属性
export interface AppWrapProps {
  // el-config-provider的配置
  elpConfig?: ConfigProviderProps;
  locale?: LocaleType;
  // border-label、label的配置
  borderLabel?: {
    width?: string;
    height?: string;
  };
  // page-header的配置
  pageHeader?: {
    height?: string | number;
    // 从route中获取title的路径
    titlePath?: string;
    border?: boolean;
    paddingX?: string | [string, string];
    // 标题的样式，只作用于文本
    titleTextStyle?: Record<string, any>;
  };
  // page-footer的配置
  pageFooter?: {
    height?: string | number;
    left?: string | number;
    right?: string | number;
  };
  // button的配置
  button?: {
    delay?: string | number | undefined;
    maxWait?: string | number | undefined;
  };
  // drawer的配置
  drawer?: DrawerProps & {
    confirmText?: string;
    cancelText?: string;
    titleStyle?: Record<string, any>;
    confirmProps?: YButtonProps;
    cancelProps?: YButtonProps;
  };
  // dialog的配置
  dialog?: DialogProps & {
    titleStyle?: Record<string, any>;
    confirmText?: string;
    confirmProps?: YButtonProps;
    cancelText?: string;
    cancelProps?: YButtonProps;
  };
  // empty的配置
  empty?: {
    image?: string;
    imageSize?: number;
    description?: string;
    style?: Record<string, any>;
  };
  textTooltip?: {
    placement?: Placement;
    tooltipProps?: Partial<ElTooltipProps>;
  };
  desc?: {
    labelWidth?: string | number;
    labelStyle?: Record<string, any>;
    contentStyle?: Record<string, any>;
    labelAlign?: 'left' | 'center' | 'right';
    contentAlign?: 'left' | 'center' | 'right';
    emptyText?: string;
  };
  pop?: {
    confirmText?: string;
    confirmProps?: YButtonProps;
    cancelText?: string;
    cancelProps?: YButtonProps;
    tipPlacement?: PlacementType;
    tipProps?: Partial<ElTooltipProps>;
    popWidth?: number;
    popTitle?: string;
    popPlacement?: PlacementType;
    popContent?: string;
    popProps?: Partial<PopoverProps>;
  };
  table?: {
    emptyProps?: EmptyProps;
    paginationProps?: PaginationProps;
  };
  columnForms?: {
    placement?: PlacementType;
    popperClass?: string;
  };
  columnOperation?: {
    disabledDefaultTip?: string;
  };
  // echarts配置
  echarts?: {
    /** 需要预加载的图表类型 */
    chartTypes?: string[];
    /** 需要预加载的组件类型 */
    components?: string[];
    /** 需要预加载的特性类型 */
    features?: string[];
    /** 需要预加载的渲染器类型 */
    renderers?: string[];
    /** 初始化参数 */
    initOpts?: any;
    /** 主题 */
    theme?: string | object;
    /** 空状态配置 */
    emptyProps?: EmptyProps;
  };
  [key: string]: any;
}

// 定义 props 对象
export const appWrapProps = {
  elpConfig: {
    type: Object as PropType<ConfigProviderProps>,
    default: () => ({})
  },
  locale: {
    type: String as PropType<LocaleType>,
    default: 'zh-cn'
  },
  borderLabel: {
    type: Object as PropType<AppWrapProps['borderLabel']>,
    default: () => ({})
  },
  pageHeader: {
    type: Object as PropType<AppWrapProps['pageHeader']>,
    default: () => ({})
  },
  pageFooter: {
    type: Object as PropType<AppWrapProps['pageFooter']>,
    default: () => ({})
  },
  button: {
    type: Object as PropType<AppWrapProps['button']>,
    default: () => ({})
  },
  drawer: {
    type: Object as PropType<AppWrapProps['drawer']>,
    default: () => ({})
  },
  dialog: {
    type: Object as PropType<AppWrapProps['dialog']>,
    default: () => ({})
  },
  empty: {
    type: Object as PropType<AppWrapProps['empty']>,
    default: () => ({})
  },
  textTooltip: {
    type: Object as PropType<AppWrapProps['textTooltip']>,
    default: () => ({})
  },
  desc: {
    type: Object as PropType<AppWrapProps['desc']>,
    default: () => ({})
  },
  table: {
    type: Object as PropType<AppWrapProps['table']>,
    default: () => ({})
  },
  echarts: {
    type: Object as PropType<AppWrapProps['echarts']>,
    default: () => ({})
  }
} as const;

export type AppWrapInstance = ExtractPublicPropTypes<typeof appWrapProps>;
