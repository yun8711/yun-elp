import type { ExtractPublicPropTypes } from 'vue';

export interface PartTitleProps {
  /**
   * 标题文本
   * @default ''
   */
  title?: string;
}

export const partTitleProps = {
  title: {
    type: String,
    default: ''
  }
} as const;

export type PartTitleInstance = ExtractPublicPropTypes<typeof partTitleProps>;
