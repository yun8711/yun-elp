<template>
  <y-echarts :option="barChartOption" :config="echartsConfig" />
</template>

<script setup>
import { ref, watch } from 'vue'

defineOptions({
  name: 'BarChart',
  inheritAttrs: true
})

const props = defineProps({
  newOption: {
    type: Object,
    default: () => ({})
  }
})

const echartsConfig = ref({
  chartTypes: ['BarChart'],
  components: ['GridComponent', 'TooltipComponent', 'LegendComponent', 'TitleComponent']
})

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
    // data: []
  },
  series: [
    {
      name: '2011',
      type: 'bar',
      // data: []
    },
    {
      name: '2012',
      type: 'bar',
      // data: []
    }
  ]
})

watch(() => props.newOption, (newVal) => {
  if (newVal) {
    console.log('newVal', newVal)
    barChartOption.value = newVal
  }
}, { deep: true })
</script>
