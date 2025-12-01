import type { ExtractPublicPropTypes, PropType } from 'vue';

export interface PageFooterProps {
  height?: string | number | undefined;
  left?: string | number | undefined;
  right?: string | number | undefined;
  model?: 'fixed' | 'absolute';
};

export const pageFooterProps = {
  height: {
    type: [String, Number] as PropType<PageFooterProps['height']>,
    default: undefined
  },
  left: {
    type: [String, Number] as PropType<PageFooterProps['left']>,
    default: undefined
  },
  right: {
    type: [String, Number] as PropType<PageFooterProps['right']>,
    default: undefined
  },
  model: {
    type: String as PropType<PageFooterProps['model']>,
    default: 'fixed',
    validator: (value: string) => ['fixed', 'absolute'].includes(value)
  }
} as const;

export type pageFooterInstance = ExtractPublicPropTypes<typeof pageFooterProps>;
