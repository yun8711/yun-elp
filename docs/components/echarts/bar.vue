<template>
  <div style="width: 100%; height: 300px">
    <y-echarts :option="barChartOption" :config="echartsConfig" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

defineOptions({
  name: 'BarChart',
  inheritAttrs: true
})

const props = defineProps({
  // 从父组件传递的动态配置项
  newOption: {
    type: Object,
    default: () => ({})
  }
})

// 监听动态配置项的变化，如果变化则更新柱状图配置
watch(() => props.newOption, (newVal) => {
  if (newVal) {
    barChartOption.value = newVal
  }
}, { deep: true })

// 柱状图组件需要加载的模块配置，也可以在appWrap中配置全局的模块
const echartsConfig = ref({
  chartTypes: ['BarChart'],
  components: ['GridComponent', 'TooltipComponent', 'LegendComponent', 'TitleComponent']
})

// 柱状图静态配置，即不需要动态加载的配置项，被用来初始化图表
const barChartOption = ref({
  title: {
    text: 'World Population'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
  },
  series: [
    {
      name: '2011',
      type: 'bar',
      data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
    {
      name: '2012',
      type: 'bar',
      data: [19325, 23438, 31000, 121594, 134141, 681807]
    }
  ]
})
</script>
