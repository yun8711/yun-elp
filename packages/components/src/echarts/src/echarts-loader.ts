// ECharts模块预加载器
export class EchartsLoader {
  private static instance: EchartsLoader;
  private loadedModules: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  static getInstance(): EchartsLoader {
    if (!EchartsLoader.instance) {
      EchartsLoader.instance = new EchartsLoader();
    }
    return EchartsLoader.instance;
  }

  // 预加载指定的模块组合
  async preloadModules(modules: {
    chartTypes?: string[];
    components?: string[];
    renderers?: string[];
    features?: string[];
  }): Promise<any[]> {
    const modulesToLoad: any[] = [];

    // 加载图表类型
    if (modules.chartTypes) {
      for (const type of modules.chartTypes) {
        if (!this.loadedModules.has(type)) {
          const module = await this.loadChartType(type);
          if (module) {
            modulesToLoad.push(module);
            this.loadedModules.add(type);
          }
        }
      }
    }

    // 加载组件
    if (modules.components) {
      for (const comp of modules.components) {
        if (!this.loadedModules.has(comp)) {
          const module = await this.loadComponent(comp);
          if (module) {
            modulesToLoad.push(module);
            this.loadedModules.add(comp);
          }
        }
      }
    }

    // 加载特性功能
    if (modules.features) {
      for (const feature of modules.features) {
        if (!this.loadedModules.has(feature)) {
          const module = await this.loadFeature(feature);
          if (module) {
            modulesToLoad.push(module);
            this.loadedModules.add(feature);
          }
        }
      }
    }

    // 加载渲染器
    if (modules.renderers) {
      for (const renderer of modules.renderers) {
        if (!this.loadedModules.has(renderer)) {
          const module = await this.loadRenderer(renderer);
          if (module) {
            modulesToLoad.push(module);
            this.loadedModules.add(renderer);
          }
        }
      }
    }

    return modulesToLoad;
  }

  private async loadChartType(type: string): Promise<any> {
    const chartTypeMap: Record<string, () => Promise<any>> = {
      'LineChart': () => import('echarts/charts').then(m => m.LineChart),
      'BarChart': () => import('echarts/charts').then(m => m.BarChart),
      'PieChart': () => import('echarts/charts').then(m => m.PieChart),
      'ScatterChart': () => import('echarts/charts').then(m => m.ScatterChart),
      'RadarChart': () => import('echarts/charts').then(m => m.RadarChart),
      'MapChart': () => import('echarts/charts').then(m => m.MapChart),
      'TreeChart': () => import('echarts/charts').then(m => m.TreeChart),
      'TreemapChart': () => import('echarts/charts').then(m => m.TreemapChart),
      'GraphChart': () => import('echarts/charts').then(m => m.GraphChart),
      'ChordChart': () => import('echarts/charts').then(m => m.ChordChart),
      'GaugeChart': () => import('echarts/charts').then(m => m.GaugeChart),
      'FunnelChart': () => import('echarts/charts').then(m => m.FunnelChart),
      'ParallelChart': () => import('echarts/charts').then(m => m.ParallelChart),
      'SankeyChart': () => import('echarts/charts').then(m => m.SankeyChart),
      'BoxplotChart': () => import('echarts/charts').then(m => m.BoxplotChart),
      'CandlestickChart': () => import('echarts/charts').then(m => m.CandlestickChart),
      'EffectScatterChart': () => import('echarts/charts').then(m => m.EffectScatterChart),
      'LinesChart': () => import('echarts/charts').then(m => m.LinesChart),
      'HeatmapChart': () => import('echarts/charts').then(m => m.HeatmapChart),
      'PictorialBarChart': () => import('echarts/charts').then(m => m.PictorialBarChart),
      'ThemeRiverChart': () => import('echarts/charts').then(m => m.ThemeRiverChart),
      'SunburstChart': () => import('echarts/charts').then(m => m.SunburstChart),
      'CustomChart': () => import('echarts/charts').then(m => m.CustomChart)
    };

    return this.loadModule(type, chartTypeMap);
  }

  private async loadComponent(comp: string): Promise<any> {
    const componentMap: Record<string, () => Promise<any>> = {
      'GridSimpleComponent': () => import('echarts/components').then(m => m.GridSimpleComponent),
      'GridComponent': () => import('echarts/components').then(m => m.GridComponent),
      'PolarComponent': () => import('echarts/components').then(m => m.PolarComponent),
      'RadarComponent': () => import('echarts/components').then(m => m.RadarComponent),
      'GeoComponent': () => import('echarts/components').then(m => m.GeoComponent),
      'SingleAxisComponent': () => import('echarts/components').then(m => m.SingleAxisComponent),
      'ParallelComponent': () => import('echarts/components').then(m => m.ParallelComponent),
      'CalendarComponent': () => import('echarts/components').then(m => m.CalendarComponent),
      'MatrixComponent': () => import('echarts/components').then(m => m.MatrixComponent),
      'GraphicComponent': () => import('echarts/components').then(m => m.GraphicComponent),
      'ToolboxComponent': () => import('echarts/components').then(m => m.ToolboxComponent),
      'TooltipComponent': () => import('echarts/components').then(m => m.TooltipComponent),
      'AxisPointerComponent': () => import('echarts/components').then(m => m.AxisPointerComponent),
      'BrushComponent': () => import('echarts/components').then(m => m.BrushComponent),
      'TitleComponent': () => import('echarts/components').then(m => m.TitleComponent),
      'TimelineComponent': () => import('echarts/components').then(m => m.TimelineComponent),
      'MarkPointComponent': () => import('echarts/components').then(m => m.MarkPointComponent),
      'MarkLineComponent': () => import('echarts/components').then(m => m.MarkLineComponent),
      'MarkAreaComponent': () => import('echarts/components').then(m => m.MarkAreaComponent),
      'LegendComponent': () => import('echarts/components').then(m => m.LegendComponent),
      'LegendScrollComponent': () => import('echarts/components').then(m => m.LegendScrollComponent),
      'LegendPlainComponent': () => import('echarts/components').then(m => m.LegendPlainComponent),
      'DataZoomComponent': () => import('echarts/components').then(m => m.DataZoomComponent),
      'DataZoomInsideComponent': () => import('echarts/components').then(m => m.DataZoomInsideComponent),
      'DataZoomSliderComponent': () => import('echarts/components').then(m => m.DataZoomSliderComponent),
      'VisualMapComponent': () => import('echarts/components').then(m => m.VisualMapComponent),
      'VisualMapContinuousComponent': () => import('echarts/components').then(m => m.VisualMapContinuousComponent),
      'VisualMapPiecewiseComponent': () => import('echarts/components').then(m => m.VisualMapPiecewiseComponent),
      'ThumbnailComponent': () => import('echarts/components').then(m => m.ThumbnailComponent),
      'AriaComponent': () => import('echarts/components').then(m => m.AriaComponent),
      'TransformComponent': () => import('echarts/components').then(m => m.TransformComponent),
      'DatasetComponent': () => import('echarts/components').then(m => m.DatasetComponent)
    };

    return this.loadModule(comp, componentMap);
  }

  private async loadRenderer(renderer: string): Promise<any> {
    const rendererMap: Record<string, () => Promise<any>> = {
      'CanvasRenderer': () => import('echarts/renderers').then(m => m.CanvasRenderer),
      'SVGRenderer': () => import('echarts/renderers').then(m => m.SVGRenderer)
    };

    return this.loadModule(renderer, rendererMap);
  }

  private async loadFeature(feature: string): Promise<any> {
    const featureMap: Record<string, () => Promise<any>> = {
      AxisBreak: () => import('echarts/features').then(m => m.AxisBreak),
      LabelLayout: () => import('echarts/features').then(m => m.LabelLayout),
      LegacyGridContainLabel: () => import('echarts/features').then(m => m.LegacyGridContainLabel),
      ScatterJitter: () => import('echarts/features').then(m => m.ScatterJitter),
      UniversalTransition: () => import('echarts/features').then(m => m.UniversalTransition)
    };
    return this.loadModule(feature, featureMap);
  }

  private async loadModule(name: string, map: Record<string, () => Promise<any>>): Promise<any> {
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name);
    }

    const promise = map[name]?.() || Promise.resolve(null);
    this.loadingPromises.set(name, promise);
    return promise;
  }

  // 检查模块是否已加载
  isModuleLoaded(moduleName: string): boolean {
    return this.loadedModules.has(moduleName);
  }

  // 获取已加载的模块列表
  getLoadedModules(): string[] {
    return Array.from(this.loadedModules);
  }
}

// 便捷的预加载函数
export async function preloadCustomModules(modules: {
  chartTypes?: string[];
  components?: string[];
  renderers?: string[];
  features?: string[];
}) {
  const loader = EchartsLoader.getInstance();
  return loader.preloadModules(modules);
}
