import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import YEcharts from '../src/echarts.vue';

// Mock echarts
vi.mock('echarts/core', () => ({
  use: vi.fn(),
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn()
  }))
}));

vi.mock('echarts/charts', () => ({
  BarChart: 'BarChart',
  LineChart: 'LineChart',
  PieChart: 'PieChart'
}));

vi.mock('echarts/components', () => ({
  GridComponent: 'GridComponent',
  TooltipComponent: 'TooltipComponent',
  LegendComponent: 'LegendComponent'
}));

vi.mock('echarts/renderers', () => ({
  CanvasRenderer: 'CanvasRenderer',
  SVGRenderer: 'SVGRenderer'
}));

vi.mock('echarts/features', () => ({
  LabelLayout: 'LabelLayout',
  UniversalTransition: 'UniversalTransition'
}));

describe('YEcharts', () => {
  it('渲染正常', () => {
    const wrapper = mount(YEcharts);
    expect(wrapper.exists()).toBe(true);
  });

  it('支持基础属性', () => {
    const wrapper = mount(YEcharts, {
      props: {
        width: 600,
        height: 400,
        loading: true
      }
    });

    expect(wrapper.classes()).toContain('loading');
    expect(wrapper.attributes('style')).toContain('width: 600px');
    expect(wrapper.attributes('style')).toContain('height: 400px');
  });

  it('支持动态导入配置', () => {
    const wrapper = mount(YEcharts, {
      props: {
        chartTypes: ['BarChart', 'PieChart'],
        components: ['GridComponent', 'TooltipComponent'],
        renderers: ['CanvasRenderer']
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('支持图表配置', () => {
    const option = {
      title: { text: '测试图表' },
      series: [{ data: [1, 2, 3], type: 'line' }]
    };

    const wrapper = mount(YEcharts, {
      props: { option }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('支持 features 属性', () => {
    const wrapper = mount(YEcharts, {
      props: {
        features: ['LabelLayout', 'UniversalTransition']
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('支持完整的模块配置', () => {
    const wrapper = mount(YEcharts, {
      props: {
        chartTypes: ['BarChart', 'LineChart'],
        components: ['GridComponent', 'TooltipComponent', 'LegendComponent'],
        renderers: ['CanvasRenderer'],
        features: ['LabelLayout']
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('未指定props时使用默认配置', () => {
    const wrapper = mount(YEcharts, {
      props: {
        option: {
          series: [{ data: [1, 2, 3], type: 'line' }]
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('暴露正确的方法', () => {
    const wrapper = mount(YEcharts);
    const vm = wrapper.vm;

    expect(typeof vm.getChartInstance).toBe('function');
    expect(typeof vm.resize).toBe('function');
    expect(typeof vm.dispose).toBe('function');
  });
});
