### 基础用法

该示例展示不进行二次封装，直接使用 `y-echarts` 的用法

```vue
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

```

### 二次封装

该示例使用 `y-echarts` 封装一个柱状图组件，避免每次创建图表时编写大量配置，提升复用性。在使用该组件时，只需要像上面示例的 `getLineChartOption` 方法一样，只传入必要的配置即可

```vue
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
    data: []
  },
  series: [
    {
      name: '2011',
      type: 'bar',
      data: []
    },
    {
      name: '2012',
      type: 'bar',
      data: []
    }
  ]
})
</script>

```
