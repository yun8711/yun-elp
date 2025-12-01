import type { ExtractPublicPropTypes, PropType } from 'vue';
export interface EchartsProps {
  /** 图表动态更新的配置项 */
  option?: any;
  /** 是否显示加载状态 */
  loading?: boolean;
  // 要加载的echarts模块
  config?: {
    /** 主题  */
    theme?: string | object;
    /** 需要加载的图表类型，如 ['LineChart', 'BarChart', 'PieChart'] */
    chartTypes?: string[];
    /** 需要加载的组件，如 ['GridComponent', 'TooltipComponent', 'LegendComponent'] */
    components?: string[];
    /** 需要加载的渲染器，如 ['CanvasRenderer'] 或 ['SVGRenderer'] */
    renderers?: string[];
    /** 需要加载的特性功能，如 ['LabelLayout', 'UniversalTransition'] */
    features?: string[];
    /** 初始化参数 */
    initOpts?: any;
  };
}

export const echartsProps = {
  option: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object as PropType<EchartsProps['config']>,
    default: () => ({
      theme: undefined,
      chartTypes: [],
      components: [],
      renderers: [],
      features: [],
      initOpts: undefined
    })
  }
} as const;

export type echartsInstance = ExtractPublicPropTypes<typeof echartsProps>;
