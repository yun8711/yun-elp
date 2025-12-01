import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ButtonProps as ElButtonProps } from 'element-plus';

export interface ButtonEmits {
  click: [event: MouseEvent];
  dblclick: [event: MouseEvent];
}

// 组件自定义的props类型
export interface ButtonCustomProps {
  /**
   * 模式：debounce（防抖）或 throttle（节流），不设置时默认为防抖
   */
  model?: 'debounce' | 'throttle' | undefined;
  /**
   * 延迟时间（毫秒），用于防抖或节流
   */
  delay?: number;
  /**
   * 最大等待时间（毫秒），仅在防抖模式下生效
   */
  maxWait?: number | undefined;
  /**
   * 双击检测时间阈值（毫秒），用于区分单击和双击，必须大于等于delay
   */
  dblDelay?: number;
}

// 完整的props类型，包含ElButtonProps和自定义props
export type ButtonProps = ButtonCustomProps & Partial<ElButtonProps>;

export const buttonProps = {
  model: {
    type: String as PropType<'debounce' | 'throttle' | undefined>,
    default: undefined,
    validator: (value: string | undefined) => value === undefined || ['debounce', 'throttle'].includes(value)
  },
  delay: {
    type: Number,
    default: undefined
  },
  maxWait: {
    type: Number,
    default: undefined
  },
  dblDelay: {
    type: Number,
    default: 300
  }
} as const;

export type buttonInstance = ExtractPublicPropTypes<typeof buttonProps>;
