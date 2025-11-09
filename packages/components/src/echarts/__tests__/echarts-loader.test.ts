/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EchartsLoader } from '../src/echarts-loader';

// Mock echarts模块
vi.mock('echarts/core', () => ({
  use: vi.fn()
}));

const mockCharts = {
  LineChart: 'LineChart',
  BarChart: 'BarChart',
  PieChart: 'PieChart',
  ScatterChart: 'ScatterChart'
};

const mockComponents = {
  GridComponent: 'GridComponent',
  TooltipComponent: 'TooltipComponent',
  LegendComponent: 'LegendComponent',
  TitleComponent: 'TitleComponent'
};

const mockRenderers = {
  CanvasRenderer: 'CanvasRenderer',
  SVGRenderer: 'SVGRenderer'
};

const mockFeatures = {
  LabelLayout: 'LabelLayout',
  UniversalTransition: 'UniversalTransition'
};

vi.mock('echarts/charts', () => mockCharts);
vi.mock('echarts/components', () => mockComponents);
vi.mock('echarts/renderers', () => mockRenderers);
vi.mock('echarts/features', () => mockFeatures);

describe('EchartsLoader 按需加载器', () => {
  let loader: EchartsLoader;

  beforeEach(() => {
    // 重置单例实例
    (EchartsLoader as any).instance = null;
    loader = EchartsLoader.getInstance();
    vi.clearAllMocks();
  });

  describe('单例模式', () => {
    it('应该返回相同的实例', () => {
      const loader1 = EchartsLoader.getInstance();
      const loader2 = EchartsLoader.getInstance();
      expect(loader1).toBe(loader2);
    });
  });

  describe('模块预加载', () => {
    it('应该能预加载图表类型模块', async () => {
      const modules = {
        chartTypes: ['LineChart', 'BarChart']
      };

      await loader.preloadModules(modules);

      expect(loader.isModuleLoaded('LineChart')).toBe(true);
      expect(loader.isModuleLoaded('BarChart')).toBe(true);
    });

    it('应该能预加载组件模块', async () => {
      const modules = {
        components: ['TooltipComponent', 'LegendComponent']
      };

      await loader.preloadModules(modules);

      expect(loader.isModuleLoaded('TooltipComponent')).toBe(true);
      expect(loader.isModuleLoaded('LegendComponent')).toBe(true);
    });

    it('应该能预加载渲染器模块', async () => {
      const modules = {
        renderers: ['CanvasRenderer']
      };

      await loader.preloadModules(modules);

      expect(loader.isModuleLoaded('CanvasRenderer')).toBe(true);
    });

    it('应该能预加载特性模块', async () => {
      const modules = {
        features: ['LabelLayout']
      };

      await loader.preloadModules(modules);

      expect(loader.isModuleLoaded('LabelLayout')).toBe(true);
    });

    it('应该支持同时加载多种类型的模块', async () => {
      const modules = {
        chartTypes: ['LineChart'],
        components: ['TooltipComponent'],
        renderers: ['CanvasRenderer'],
        features: ['LabelLayout']
      };

      await loader.preloadModules(modules);

      expect(loader.isModuleLoaded('LineChart')).toBe(true);
      expect(loader.isModuleLoaded('TooltipComponent')).toBe(true);
      expect(loader.isModuleLoaded('CanvasRenderer')).toBe(true);
      expect(loader.isModuleLoaded('LabelLayout')).toBe(true);
    });

    it('应该避免重复加载已加载的模块', async () => {
      // 第一次加载
      await loader.preloadModules({ chartTypes: ['LineChart'] });
      expect(loader.isModuleLoaded('LineChart')).toBe(true);

      // 第二次加载相同模块
      await loader.preloadModules({ chartTypes: ['LineChart'] });

      // 仍然只有一个模块被加载
      expect(loader.getLoadedModules()).toContain('LineChart');
    });

    it('应该处理空模块配置', async () => {
      await loader.preloadModules({});

      expect(loader.getLoadedModules()).toEqual([]);
    });

    it('应该处理部分空的模块配置', async () => {
      const modules = {
        chartTypes: ['LineChart'],
        components: [],
        features: undefined
      };

      await loader.preloadModules(modules);

      expect(loader.isModuleLoaded('LineChart')).toBe(true);
      expect(loader.getLoadedModules().length).toBe(1);
    });
  });

  describe('模块缓存', () => {
    it('应该缓存加载的模块', async () => {
      await loader.preloadModules({ chartTypes: ['LineChart'] });
      expect(loader.isModuleLoaded('LineChart')).toBe(true);

      // 创建新实例验证缓存
      (EchartsLoader as any).instance = null;
      const newLoader = EchartsLoader.getInstance();

      // 新实例不应该有缓存
      expect(newLoader.isModuleLoaded('LineChart')).toBe(false);
    });

    it('应该并发加载相同模块时正确处理', async () => {
      const promise1 = loader.preloadModules({ chartTypes: ['LineChart'] });
      const promise2 = loader.preloadModules({ chartTypes: ['LineChart'] });

      await Promise.all([promise1, promise2]);

      expect(loader.isModuleLoaded('LineChart')).toBe(true);
    });
  });

  describe('错误处理', () => {
    it('应该处理不存在的图表类型', async () => {
      // 测试不存在的模块类型
      await loader.preloadModules({ chartTypes: ['NonExistentChart'] });

      // 不存在的模块不应该被标记为已加载
      expect(loader.isModuleLoaded('NonExistentChart')).toBe(false);
    });

    it('应该处理加载失败的组件', async () => {
      // 测试不存在的组件类型
      await loader.preloadModules({ components: ['BrokenComponent'] });

      expect(loader.isModuleLoaded('BrokenComponent')).toBe(false);
    });

    it('应该继续加载其他模块当某个模块不存在时', async () => {
      await loader.preloadModules({
        chartTypes: ['NonExistentChart', 'BarChart'],
        components: ['TooltipComponent']
      });

      expect(loader.isModuleLoaded('NonExistentChart')).toBe(false);
      expect(loader.isModuleLoaded('BarChart')).toBe(true);
      expect(loader.isModuleLoaded('TooltipComponent')).toBe(true);
    });
  });

  describe('模块状态查询', () => {
    it('应该能查询模块加载状态', async () => {
      expect(loader.isModuleLoaded('LineChart')).toBe(false);

      await loader.preloadModules({ chartTypes: ['LineChart'] });

      expect(loader.isModuleLoaded('LineChart')).toBe(true);
    });

    it('应该能获取已加载的模块列表', async () => {
      await loader.preloadModules({
        chartTypes: ['LineChart', 'BarChart'],
        components: ['TooltipComponent']
      });

      const loadedModules = loader.getLoadedModules();
      expect(loadedModules).toContain('LineChart');
      expect(loadedModules).toContain('BarChart');
      expect(loadedModules).toContain('TooltipComponent');
      expect(loadedModules.length).toBe(3);
    });
  });

  describe('边界情况', () => {
    it('应该处理空的模块类型数组', async () => {
      await loader.preloadModules({
        chartTypes: [],
        components: [],
        renderers: [],
        features: []
      });

      expect(loader.getLoadedModules()).toEqual([]);
    });

    it('应该处理重复的模块名称', async () => {
      await loader.preloadModules({
        chartTypes: ['LineChart', 'LineChart', 'BarChart']
      });

      const loadedModules = loader.getLoadedModules();
      expect(loadedModules.filter(m => m === 'LineChart')).toHaveLength(1);
      expect(loadedModules).toContain('BarChart');
    });
  });
});
