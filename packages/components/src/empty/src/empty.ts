import type { ExtractPublicPropTypes } from '@vue/runtime-core';

export interface EmptyProps {
  image?: string;
  imageSize?: number;
  description?: string;
  style?: Record<string, any>;
};

export const emptyProps = {
  image: {
    type: String,
    default: ''
  },
  imageSize: {
    type: Number,
    default: 100
  },
  description: {
    type: String,
    default: ''
  },
  style: {
    type: Object,
    default: () => ({})
  }
} as const;

export type emptyInstance = ExtractPublicPropTypes<typeof emptyProps>;
