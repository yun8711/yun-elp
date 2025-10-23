<template>
  <div class="y-echarts" ref="chartWrapperRef" v-loading="loading">
    <slot name="empty" v-if="empty">
      <y-empty v-bind="emptyComponentProps" />
    </slot>
    <div v-else ref="chartRef" :style="{ width: width + 'px', height: height + 'px' }"></div>
  </div>

</template>

<script setup lang="ts">
import { toRefs, useTemplateRef, onMounted, onUnmounted, watch, nextTick, computed } from '@vue/runtime-core';
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
const { option, config, loading, empty, emptyProps } = toRefs(props);
// console.log(empty.value);
const chartWrapperRef = useTemplateRef<HTMLElement>('chartWrapperRef');
const chartRef = useTemplateRef<HTMLElement>('chartRef');
let chartInstance: any = null;
// 使用 useElementSize 自动获取容器尺寸
const { width, height } = useElementSize(chartWrapperRef);
console.log(width.value, height.value);

const emptyComponentProps = computed(() => {
  return {
    ...(echartsConfig.value?.emptyProps || {}),
    ...(emptyProps.value || {}),
  }
});

// 初始化图表
async function initChart() {
  // console.log('initChart', empty.value);
  if (!chartRef.value || empty.value) return;
  // console.log('initChart2');

  try {
    const { init } = await import('echarts/core');
    const loader = EchartsLoader.getInstance();

    // 合并各类配置
    const configModules = {
      chartTypes: [...(echartsConfig.value?.chartTypes || []), ...(config.value?.chartTypes || [])],
      components: [...(echartsConfig.value?.components || []), ...(config.value?.components || [])],
      renderers: ['CanvasRenderer', ...(echartsConfig.value?.renderers || []), ...(config.value?.renderers || [])],
      features: [...(echartsConfig.value?.features || []), ...(config.value?.features || [])]
    };
    // console.log('configModules', configModules);

    await loader.preloadModules(configModules);

    chartInstance = init(chartRef.value, config.value?.theme || echartsConfig?.theme, {
      renderer: 'canvas',
      ...(config.value?.initOpts || echartsConfig.value?.initOpts || {})
    });

    if (option.value) {
      console.log('setOption');
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

// 更新图表配置
function updateChart() {
  if (chartInstance && option.value) {
    chartInstance.setOption(option, true);
  }
}

watch(() => empty.value, (newVal: boolean) => {
  if (newVal) {
    destroyChart();
  } else {
    nextTick(() => {
      initChart();
    });
  }
});

// 监听配置变化
watch(() => [option.value], updateChart, { deep: true });

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
  getChartInstance: () => chartInstance,
});
</script>
