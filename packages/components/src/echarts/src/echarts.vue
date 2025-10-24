<template>
  <div class="y-echarts" ref="chartWrapperRef" v-loading="loading">
    <div ref="chartRef" :style="{ width: width + 'px', height: height + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, useTemplateRef, onMounted, onUnmounted, watch, nextTick } from '@vue/runtime-core';
import { useElementSize } from '@vueuse/core';
import { echartsProps } from './echarts';
import { EchartsLoader } from './echarts-loader';
import { useAppConfig } from '../../app-wrap/src/use-app-config';

defineOptions({
  name: 'YEcharts',
  inheritAttrs: true
});

const echartsConfig = useAppConfig('echarts');
const props = defineProps(echartsProps);
const { option, config, loading } = toRefs(props);
const chartWrapperRef = useTemplateRef<HTMLElement>('chartWrapperRef');
const chartRef = useTemplateRef<HTMLElement>('chartRef');
let chartInstance: any = null;
// 使用 useElementSize 自动获取容器尺寸
const { width, height } = useElementSize(chartWrapperRef);

// 初始化图表
async function initChart() {
  if (!chartRef.value) return;
  try {
    const { init } = await import('echarts/core');
    const loader = EchartsLoader.getInstance();

    // 合并各类配置
    const configModules = {
      chartTypes: [
        ...(echartsConfig?.value?.chartTypes || []),
        ...(config.value?.chartTypes || [])
      ],
      components: [
        ...(echartsConfig?.value?.components || []),
        ...(config.value?.components || [])
      ],
      renderers: [
        'CanvasRenderer',
        ...(echartsConfig?.value?.renderers || []),
        ...(config.value?.renderers || [])
      ],
      features: [...(echartsConfig?.value?.features || []), ...(config.value?.features || [])]
    };

    await loader.preloadModules(configModules);

    chartInstance = init(chartRef.value, config.value?.theme || echartsConfig?.value?.theme, {
      renderer: 'canvas',
      ...(config.value?.initOpts || echartsConfig?.value?.initOpts || {})
    });

    if (option.value) {
      chartInstance.setOption(option.value);
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

// 监听配置变化
watch(
  () => option.value,
  (newVal: any) => {
    if (chartInstance && newVal) {
      chartInstance.setOption(newVal, false);
    }
  },
  { deep: true }
);

// 监听容器尺寸变化，自动调整图表大小
watch([width, height], () => {
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
  getChartInstance: () => chartInstance
});
</script>
