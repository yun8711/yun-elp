<template>
  <div style="width: 100%; height: 300px; border: 1px solid red">
    <el-empty v-if="isEmpty" />
    <y-echarts v-else :option="lineChartOption" v-loading="loading" :config="echartsConfig"> </y-echarts>
  </div>

  <el-button type="primary" @click="getLineChartOption">获取数据</el-button>
  <el-button type="warning" @click="clearLineChartOption">清除数据</el-button>
</template>

<script setup>
import { ref } from 'vue'
const loading = ref(false)
const isEmpty = ref(true)

const echartsConfig = ref({
  chartTypes: ['LineChart'],
  components: [
    'GridComponent',
    'TooltipComponent',
    'LegendComponent',
    'TitleComponent',
    'ToolboxComponent'
  ],
  features: ['UniversalTransition']
})

// 折线图配置
const lineChartOption = ref({
  title: {
    text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
    }
  ]
})

// 模拟异步获取数据
const getLineChartOption = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  lineChartOption.value.series[0].data = [120, 132, 101, 134, 90, 230, 210]
  lineChartOption.value.series[1].data = [220, 182, 191, 234, 290, 330, 310]
  loading.value = false
  isEmpty.value = false
}

const clearLineChartOption = () => {
  lineChartOption.value.series[0].data = []
  lineChartOption.value.series[1].data = []
  isEmpty.value = true
}
</script>
