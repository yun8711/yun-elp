import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

export interface StepProps {
  steps?: string[];
  stepNumber?: number;
  activeIndex?: number;
  inlineLabel?: boolean;
}

export const stepProps = {
  steps: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  stepNumber: {
    type: Number,
    default: 2,
    validator: (value: number) => value >= 2
  },
  activeIndex: {
    type: Number,
    default: 0
  },
  inlineLabel: {
    type: Boolean,
    default: true
  },
} as const;

export type stepInstance = ExtractPublicPropTypes<typeof stepProps>;
