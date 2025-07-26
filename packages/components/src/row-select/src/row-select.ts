import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

// 选项接口
export interface RowSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: any;
}

export type RowSelectDefineProps = {
  label: string;
  value: string;
  disabled?: string;
};

// 定义组件的属性接口
export interface RowSelectProps {
  /**
   * 绑定值
   */
  modelValue?: string | string[] | number | number[];
  /**
   * 是否为单选模式
   */
  single?: boolean;
  /**
   * 收缩展开动画时长，单位ms
   */
  duration?: number;
  /**
   * 默认显示行数
   */
  defaultLines?: number;
  /**
   * label宽度
   */
  labelWidth?: string;
  /**
   * label水平对齐方式
   */
  labelAlign?: 'left' | 'center' | 'right';
  /**
   * label文字
   */
  labelText?: string;
  /**
   * 是否显示分隔符
   */
  separator?: boolean;
  /**
   * label文字的样式
   */
  labelStyles?: Record<string, string | number>;
  /**
   * 右侧按钮折叠状态时文字
   */
  foldText?: string;
  /**
   * 右侧按钮展开状态时文字
   */
  unfoldText?: string;
  /**
   * 是否显示图标
   */
  showIcon?: boolean;
  /**
   * 图标位于按钮方位
   */
  iconPosition?: 'left' | 'right';
  /**
   * 右侧按钮文字样式
   */
  btnStyles?: Record<string, string | number>;
  /**
   * 选项数组
   */
  options?: RowSelectOption[];
  /**
   * 是否显示全部选项
   */
  showAll?: boolean;
  /**
   * 全部选项文字
   */
  allText?: string;
  /**
   * 选项高度
   */
  itemHeight?: string | number;
  /**
   * 选项宽度
   */
  itemWidth?: string | number;
  /**
   * 选项间距
   */
  gap?: string;
  /**
   * 定义选项的属性，比如：{ label: 'label', value: 'value', disabled: 'disabled' }
   */
  defineProps?: RowSelectDefineProps;
  /**
   * 选项样式集
   */
  itemStyles?: Record<string, string | number>;
}

// 定义 props 对象
export const rowSelectProps = {
  modelValue: {
    type: [String, Array] as PropType<string | string[] | number | number[]>,
    default: ''
  },
  single: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 200
  },
  defaultLines: {
    type: Number,
    default: 1,
    validator: (value: number) => value >= 1
  },
  labelWidth: {
    type: String,
    default: 'auto'
  },
  labelAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  labelText: {
    type: String,
    default: '选项'
  },
  separator: {
    type: Boolean,
    default: true
  },
  labelStyles: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({})
  },
  foldText: {
    type: String,
    default: '更多'
  },
  unfoldText: {
    type: String,
    default: '收起'
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  btnStyles: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({})
  },
  iconPosition: {
    type: String as PropType<'left' | 'right'>,
    default: 'left',
    validator: (value: string) => ['left', 'right'].includes(value)
  },
  options: {
    type: Array as PropType<RowSelectOption[]>,
    default: () => []
  },
  showAll: {
    type: Boolean,
    default: true
  },
  allText: {
    type: String,
    default: '全部'
  },
  itemWidth: {
    type: [String, Number],
    default: 'auto'
  },
  itemHeight: {
    type: [String, Number],
    default: '24px'
  },
  // 一个值表示水平、垂直值相同，两个值使用逗号分隔，只支持数字或带px单位
  gap: {
    type: String,
    default: '8',
    validator: (value: string) => {
      const gapArr = value.split(',');
      return (
        gapArr.every((item: string) => {
          return item.match(/^\d+$/) || item.match(/^\d+px$/);
        }) && gapArr.length > 0
      );
    }
  },
  defineProps: {
    type: Object as PropType<RowSelectDefineProps>,
    default: () => ({ label: 'label', value: 'value', disabled: 'disabled' })
  },
  itemStyles: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({})
  }
} as const;

// 导出实例类型
export type RowSelectInstance = ExtractPublicPropTypes<typeof rowSelectProps>;
