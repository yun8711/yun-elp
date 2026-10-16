import type { ExtractPublicPropTypes, PropType } from 'vue';

export type OrderDirection = 'asc' | 'desc';

export type OrderIcon = 'caret' | 'arrow';

export interface OrderButtonProps {
  /** 当前方向，空字符串表示未排序 */
  modelValue?: OrderDirection | '';
  /** 从未排序点下时使用的方向 */
  defaultOrder?: OrderDirection;
  /** 为 true 时，在降序上再点击会取消排序 */
  clearable?: boolean;
  /** 指示图标：caret 三角形，arrow 箭头 */
  icon?: OrderIcon;
  disabled?: boolean;
}

export interface OrderButtonEmits {
  'update:modelValue': [value: OrderDirection | ''];
  change: [value: OrderDirection | ''];
}

const ORDER_VALUES = ['asc', 'desc'] as const;
const ICON_VALUES = ['caret', 'arrow'] as const;

export function resolveNextOrder(
  current: OrderDirection | '',
  config: { defaultOrder: OrderDirection; clearable: boolean }
): OrderDirection | '' {
  if (current !== 'asc' && current !== 'desc') {
    return config.defaultOrder;
  }
  if (current === 'asc') {
    return 'desc';
  }
  if (config.clearable) {
    return '';
  }
  return 'asc';
}

export const orderButtonProps = {
  modelValue: {
    type: String as PropType<OrderDirection | ''>,
    default: '',
    validator: (value: string) => value === '' || ORDER_VALUES.includes(value as OrderDirection)
  },
  defaultOrder: {
    type: String as PropType<OrderDirection>,
    default: 'asc',
    validator: (value: string) => ORDER_VALUES.includes(value as OrderDirection)
  },
  clearable: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String as PropType<OrderIcon>,
    default: 'caret',
    validator: (value: string) => ICON_VALUES.includes(value as OrderIcon)
  },
  disabled: {
    type: Boolean,
    default: false
  }
} as const;

export type OrderButtonInstance = ExtractPublicPropTypes<typeof orderButtonProps>;
