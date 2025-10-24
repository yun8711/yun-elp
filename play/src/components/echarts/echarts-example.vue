<template>
  <div class="demo-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div style="width: 100%; height: 400px; border: 1px solid red">
          <y-echarts :option="lineChartOption" :loading="loading" :config="echartsConfig1">
          </y-echarts>
        </div>
      </el-col>
      <el-col :span="12">
        <bar-chart :new-option="barChartOption" :loading="loading"
          style="width: 100%; height: 400px; border: 1px solid red"></bar-chart>
      </el-col>
    </el-row>

    <el-button @click="getLineChartOption">获取数据</el-button>
    <el-button @click="clearLineChartOption">清除数据</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import BarChart from './bar.vue'

const loading = ref(false)

const echartsConfig1 = ref({
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
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%'
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
      data: []
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: []
    }
  ]
})

// 柱状图配置
const barChartOption = ref({})

// 异步获取数据
const getLineChartOption = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  lineChartOption.value = {
    legend: {
      data: ['Email', 'Union Ads']
    },
    series: [
      {
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        data: [220, 182, 191, 234, 290, 330, 310]
      }
    ]
  }

  barChartOption.value = {
    yAxis: {
      data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
    },
    series: [
      {
        data: [18203, 23489, 29034, 104970, 131744, 630230]
      },
      {
        data: [19325, 23438, 31000, 121594, 134141, 681807]
      }
    ]
  }
  loading.value = false
}

const clearLineChartOption = () => {
  lineChartOption.value = {
    series: [
      {
        data: []
      },
      {
        data: []
      }
    ]
  }
}



</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-container h2 {
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  text-align: center;
}

.charts-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.charts-section h3 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.charts-section p {
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
</style>
