import type { ExtractPublicPropTypes, PropType, VNode } from 'vue';
import { Comment, Fragment, Text } from 'vue';
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

/** 处理 boolean 属性简写（如 autoInsertSpace）在 attrs 中变为 "" 的情况 */
export function normalizeBooleanProp(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === '' || value === true) return true;
  if (value === false || value === null) return false;
  return Boolean(value);
}

/** 从 default slot 中提取纯文本（支持 Fragment / 空白节点） */
export function collectPlainTextFromSlot(nodes: VNode[]): string | null {
  const parts: string[] = [];

  const walk = (items: VNode[]): boolean => {
    for (const node of items) {
      if (node.type === Comment) continue;

      if (node.type === Text) {
        parts.push(String(node.children ?? ''));
        continue;
      }

      if (node.type === Fragment) {
        const { children } = node;
        if (typeof children === 'string') {
          parts.push(children);
          continue;
        }
        if (Array.isArray(children) && walk(children as VNode[])) {
          continue;
        }
      }

      return false;
    }

    return true;
  };

  if (!walk(nodes)) return null;

  const text = parts.join('').trim();
  return text.length ? text : null;
}

const TWO_CHAR_CHINESE_REG = /^\p{Unified_Ideograph}{2}$/u;

export function shouldInsertSpaceForText(text: string, autoInsertSpace: boolean): boolean {
  if (!autoInsertSpace) return false;
  return TWO_CHAR_CHINESE_REG.test(text);
}

export const buttonProps = {
  model: {
    type: String as PropType<'debounce' | 'throttle' | undefined>,
    default: undefined,
    validator: (value: string | undefined) =>
      value === undefined || ['debounce', 'throttle'].includes(value)
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
