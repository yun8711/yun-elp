<template>
  <div ref="chartWrapperRef" v-loading="loading" class="y-echarts">
    <div ref="chartRef" :style="chartStyle" />
  </div>
</template>

<script setup lang="ts">
import { toRefs, useTemplateRef, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
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

// 图表容器样式
const chartStyle = computed(() => ({
  width: `${width.value}px`,
  height: `${height.value}px`
}));

// 初始化图表
async function initChart() {
  if (!chartRef.value) return;
  try {
    const { init, use } = await import('echarts/core');
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

    // 加载并注册模块
    const modulesToLoad = await loader.preloadModules(configModules);
    if (modulesToLoad.length > 0) {
      use(modulesToLoad);
    }

    chartInstance = init(chartRef.value, config.value?.theme || echartsConfig?.value?.theme, {
      renderer: 'canvas',
      ...(config.value?.initOpts || echartsConfig?.value?.initOpts || {})
    });

    // 总是设置初始 option，即使是空对象
    chartInstance.setOption(option.value || {});
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
  (newVal: any, oldVal: any) => {
    if (chartInstance && newVal !== oldVal) {
      chartInstance.setOption(newVal || {}, false);
    }
  },
  { deep: true }
);

// 监听容器尺寸变化，自动调整图表大小
watch([width, height], ([newWidth, newHeight]: [number, number]) => {
  // 确保尺寸是有效的数字
  if (typeof newWidth === 'number' && typeof newHeight === 'number' &&
      newWidth > 0 && newHeight > 0 && chartInstance) {
    nextTick(() => {
      chartInstance.resize();
    });
  }
}, { immediate: false });

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
