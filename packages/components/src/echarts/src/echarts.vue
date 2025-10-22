<template>
  <div ref="chartRef" class="y-echarts" :class="{ loading: loading }" id="chartRef"
    :style="{ width: containerWidth + 'px', height: containerHeight + 'px' }"></div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, watch, nextTick, inject } from '@vue/runtime-core';
import { useElementSize } from '@vueuse/core';
import { echartsProps } from './echarts';
import { appConfigKey } from '../../app-wrap/src/use-app-config';
import type { AppWrapProps } from '../../app-wrap/src/app-wrap';
import { EchartsLoader } from './echarts-loader';

defineOptions({
  name: 'YEcharts',
  inheritAttrs: true
});

const props = defineProps(echartsProps);

const chartRef = useTemplateRef<HTMLElement>('chartRef');
let chartInstance: any = null;

// 获取 AppWrap 配置（如果存在）
const appConfig = inject<Omit<AppWrapProps, 'elpConfig' | 'locale'>>(appConfigKey, {} as any);
const hasEchartsConfig = appConfig?.echarts &&
  (appConfig.echarts.chartTypes?.length ||
   appConfig.echarts.components?.length ||
   appConfig.echarts.renderers?.length ||
   appConfig.echarts.features?.length);

// 使用 useElementSize 自动获取容器尺寸
const { width: containerWidth, height: containerHeight } = useElementSize(chartRef);

// 初始化图表
async function initChart() {
  if (!document.getElementById('chartRef') || !chartRef.value) return;

  try {
    const { init, use } = await import('echarts/core');
    const loader = EchartsLoader.getInstance();

    // 如果没有在 AppWrap 中配置 ECharts，则导入基础模块作为兜底
    if (!hasEchartsConfig) {
      console.log('未检测到 AppWrap ECharts 配置，加载默认模块...');

      // 导入渲染器
      const { CanvasRenderer } = await import('echarts/renderers');

      // 导入常用基础组件
      const {
        GridComponent,
        TooltipComponent,
        LegendComponent,
        TitleComponent,
      } = await import('echarts/components');

      // 导入常用图表类型
      const { LineChart, BarChart, PieChart } = await import('echarts/charts');

      // 注册所有导入的模块
      use([
        CanvasRenderer,
        GridComponent,
        TooltipComponent,
        LegendComponent,
        TitleComponent,
        LineChart,
        BarChart,
        PieChart
      ]);
    } else {
      // 有 AppWrap 配置，等待预加载完成或确保渲染器已加载
      if (!loader.isModuleLoaded('CanvasRenderer') && !loader.isModuleLoaded('SVGRenderer')) {
        console.log('等待渲染器加载...');
        const { CanvasRenderer } = await import('echarts/renderers');
        use([CanvasRenderer]);
      }
    }

    chartInstance = init(chartRef.value, props.theme, {
      renderer: 'canvas',
      ...props.initOpts
    });

    if (props.option) {
      chartInstance.setOption(props.option);
    }

  } catch (error) {
    console.error('ECharts初始化失败:', error);
  }
}

// 销毁图表
function destroyChart() {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
}

// 更新图表配置
function updateChart() {
  if (chartInstance && props.option) {
    chartInstance.setOption(props.option, true);
  }
}

// 监听配置变化
watch(() => props.option, updateChart, { deep: true });

// 监听容器尺寸变化，自动调整图表大小
watch([containerWidth, containerHeight], () => {
  nextTick(() => {
    if (chartInstance) {
      chartInstance.resize();
    }
  });
});

onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

onUnmounted(() => {
  destroyChart();
});

// 暴露方法给父组件
defineExpose({
  getChartInstance: () => chartInstance,
  resize: () => chartInstance?.resize(),
  dispose: destroyChart
});
</script>
