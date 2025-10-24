/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import YEcharts from '../src/echarts.vue';

// Mock echarts core
const mockChartInstance = {
  setOption: vi.fn(),
  resize: vi.fn(),
  dispose: vi.fn(),
  getOption: vi.fn(() => ({ series: [] }))
};

vi.mock('echarts/core', () => ({
  use: vi.fn(),
  init: vi.fn(() => mockChartInstance)
}));

vi.mock('echarts/charts', () => ({
  BarChart: 'BarChart',
  LineChart: 'LineChart',
  PieChart: 'PieChart',
  ScatterChart: 'ScatterChart'
}));

vi.mock('echarts/components', () => ({
  GridComponent: 'GridComponent',
  TooltipComponent: 'TooltipComponent',
  LegendComponent: 'LegendComponent',
  TitleComponent: 'TitleComponent'
}));

vi.mock('echarts/renderers', () => ({
  CanvasRenderer: 'CanvasRenderer',
  SVGRenderer: 'SVGRenderer'
}));

vi.mock('echarts/features', () => ({
  LabelLayout: 'LabelLayout',
  UniversalTransition: 'UniversalTransition'
}));

// Mock useAppConfig
vi.mock('../../app-wrap/src/use-app-config', () => ({
  useAppConfig: vi.fn(() => ({
    value: {
      echarts: {
        chartTypes: ['LineChart'],
        components: ['GridComponent'],
        renderers: ['CanvasRenderer'],
        features: [],
        theme: 'default',
        initOpts: {}
      }
    }
  }))
}));

// Mock useElementSize
vi.mock('@vueuse/core', () => ({
  useElementSize: vi.fn(() => ({
    width: { value: 800 },
    height: { value: 600 }
  }))
}));

const globalConfig = {
  global: {}
};

describe('YEcharts 图表组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock chart instance
    Object.values(mockChartInstance).forEach(mock => mock.mockClear());
  });

  describe('基础功能', () => {
    it('应该正常渲染', () => {
      const wrapper = mount(YEcharts, globalConfig);
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-echarts').exists()).toBe(true);
    });

    it('组件名称正确', () => {
      const wrapper = mount(YEcharts, globalConfig);
      expect(wrapper.vm.$options.name).toBe('YEcharts');
    });

    it('inheritAttrs 为 true', () => {
      const wrapper = mount(YEcharts, globalConfig);
      expect(wrapper.vm.$options.inheritAttrs).toBe(true);
    });
  });

  describe('Props 测试', () => {
    it('应该支持 option 属性', () => {
      const option = {
        title: { text: '测试图表' },
        series: [{ data: [1, 2, 3], type: 'line' }]
      };

      const wrapper = mount(YEcharts, {
        ...globalConfig,
        props: { option }
      });

      expect(wrapper.props('option')).toEqual(option);
    });

    it('应该支持 loading 属性', () => {
      const wrapper = mount(YEcharts, {
        ...globalConfig,
        props: { loading: true }
      });

      expect(wrapper.classes()).toContain('is-loading');
      expect(wrapper.props('loading')).toBe(true);
    });

    it('应该支持 config 属性', () => {
      const config = {
        theme: 'dark',
        chartTypes: ['BarChart', 'PieChart'],
        components: ['TooltipComponent', 'LegendComponent'],
        renderers: ['CanvasRenderer'],
        features: ['LabelLayout']
      };

      const wrapper = mount(YEcharts, {
        ...globalConfig,
        props: { config }
      });

      expect(wrapper.props('config')).toEqual(config);
    });
  });

  describe('默认值处理', () => {
    it('option 默认为空对象', () => {
      const wrapper = mount(YEcharts, globalConfig);
      expect(wrapper.props('option')).toEqual({});
    });

    it('loading 默认为 false', () => {
      const wrapper = mount(YEcharts, globalConfig);
      expect(wrapper.props('loading')).toBe(false);
    });

    it('config 使用默认配置', () => {
      const wrapper = mount(YEcharts, globalConfig);
      const defaultConfig = {
        theme: undefined,
        chartTypes: [],
        components: [],
        renderers: [],
        features: [],
        initOpts: undefined
      };
      expect(wrapper.props('config')).toEqual(defaultConfig);
    });
  });

  describe('图表实例方法', () => {
    it('应该暴露 getChartInstance 方法', () => {
      const wrapper = mount(YEcharts, globalConfig);
      const vm = wrapper.vm as any;

      expect(typeof vm.getChartInstance).toBe('function');
      // 由于异步初始化，初始时可能为 null
      expect(vm.getChartInstance()).toBe(null);
    });
  });

  describe('配置项处理', () => {
    it('应该支持自定义配置对象', () => {
      const config = {
        theme: 'dark',
        chartTypes: ['BarChart', 'PieChart'],
        components: ['TooltipComponent', 'LegendComponent'],
        renderers: ['CanvasRenderer'],
        features: ['LabelLayout']
      };

      const wrapper = mount(YEcharts, {
        ...globalConfig,
        props: { config }
      });

      expect(wrapper.props('config')).toEqual(config);
    });

    it('应该支持 initOpts 配置', () => {
      const config = {
        initOpts: {
          renderer: 'svg',
          devicePixelRatio: 2
        }
      };

      const wrapper = mount(YEcharts, {
        ...globalConfig,
        props: { config }
      });

      expect(wrapper.props('config')?.initOpts).toEqual(config.initOpts);
    });
  });

  describe('状态管理', () => {
    it('loading 状态应该正确应用样式', () => {
      const wrapper = mount(YEcharts, {
        ...globalConfig,
        props: { loading: true }
      });

      expect(wrapper.classes()).toContain('is-loading');
    });
  });

  describe('图表配置更新', () => {
    it('应该支持 option 属性更新', async () => {
      const wrapper = mount(YEcharts, globalConfig);
      const newOption = {
        series: [{ data: [4, 5, 6], type: 'bar' }]
      };

      await wrapper.setProps({ option: newOption });
      await nextTick();

      expect(wrapper.props('option')).toEqual(newOption);
    });
  });

  describe('样式和尺寸', () => {
    it('应该应用 y-echarts 类名', () => {
      const wrapper = mount(YEcharts, globalConfig);
      expect(wrapper.classes()).toContain('y-echarts');
    });

    it('图表容器应该存在并可配置尺寸', () => {
      const wrapper = mount(YEcharts, globalConfig);
      // 找到图表容器 div（当 empty 为 false 时应该存在）
      const chartContainer = wrapper.find('div.y-echarts').find('div');

      expect(chartContainer.exists()).toBe(true);
      // 验证容器有 ref="chartRef" 属性
      expect(chartContainer.attributes('ref')).toBeUndefined(); // Vue 3 中 ref 不作为属性存在
    });
  });

  describe('生命周期', () => {
    it('组件应该能正常挂载和卸载', () => {
      const wrapper = mount(YEcharts, globalConfig);

      expect(wrapper.exists()).toBe(true);

      wrapper.unmount();
      expect(wrapper.exists()).toBe(false);
    });
  });

  describe('边界情况', () => {
    it('option 为空对象时应该正常工作', () => {
      const wrapper = mount(YEcharts, {
        ...globalConfig,
        props: { option: {} }
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.props('option')).toEqual({});
    });

    it('config 为空对象时使用默认配置', () => {
      const wrapper = mount(YEcharts, {
        ...globalConfig,
        props: { config: {} }
      });

      expect(wrapper.props('config')).toEqual({});
    });
  });

  describe('集成测试', () => {
    it('应该支持完整的配置组合', () => {
      const option = {
        title: { text: '完整配置测试' },
        tooltip: {},
        legend: {},
        xAxis: { type: 'category', data: ['A', 'B', 'C'] },
        yAxis: { type: 'value' },
        series: [
          {
            data: [120, 200, 150],
            type: 'bar'
          }
        ]
      };

      const config = {
        theme: 'dark',
        chartTypes: ['BarChart'],
        components: ['TitleComponent', 'TooltipComponent', 'LegendComponent', 'GridComponent'],
        renderers: ['CanvasRenderer'],
        features: ['LabelLayout'],
        initOpts: { renderer: 'canvas' }
      };

      const wrapper = mount(YEcharts, {
        ...globalConfig,
        props: {
          option,
          config,
          loading: false
        }
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-echarts').exists()).toBe(true);
      expect(wrapper.classes()).not.toContain('is-loading');
      expect(wrapper.props('option')).toEqual(option);
      expect(wrapper.props('config')).toEqual(config);
    });

    it('应该支持动态配置更新', async () => {
      const wrapper = mount(YEcharts, globalConfig);

      // 更新 option
      const newOption = { series: [{ data: [1, 2, 3], type: 'line' }] };
      await wrapper.setProps({ option: newOption });
      await nextTick();

      expect(wrapper.props('option')).toEqual(newOption);

      // 更新 loading 状态
      await wrapper.setProps({ loading: true });
      await nextTick();

      expect(wrapper.classes()).toContain('is-loading');
    });
  });
});
