import type { ExtractPublicPropTypes, PropType } from 'vue';

/** 分区标题样式，组件 props 与 `y-app-wrap` 的 `partTitle` 共用 */
export interface PartTitleConfig {
  /**
   * 标题文本样式
   */
  textStyle?: Record<string, any>;
  /**
   * 左侧竖条样式
   */
  barStyle?: Record<string, any>;
  /**
   * 竖条与标题的间距，数字按 px 处理
   */
  gap?: string | number;
  /**
   * 标题与 extra 的间距，数字按 px 处理
   */
  extraGap?: string | number;
}

export interface PartTitleProps extends PartTitleConfig {
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
  },
  textStyle: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  barStyle: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  gap: {
    type: [String, Number] as PropType<string | number>
  },
  extraGap: {
    type: [String, Number] as PropType<string | number>
  }
} as const;

export type PartTitleInstance = ExtractPublicPropTypes<typeof partTitleProps>;
