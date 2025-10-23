<template>
  <div class="demo-container">

    <div class="charts-section">

      <div style="width: 500px; height: 300px;border: 1px solid red;">
        <y-echarts :option="lineChartOption" :loading="loading" :empty="isEmpty" :config="echartsConfig1" >
        </y-echarts>
      </div>

      <el-button @click="getLineChartOption">获取数据</el-button>
      <el-button @click="clearLineChartOption">清除数据</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const loading = ref(false);

const echartsConfig1 = ref({
  chartTypes: ['LineChart'],
  components: ['GridComponent', 'TooltipComponent', 'LegendComponent', 'TitleComponent', 'ToolboxComponent'],
  features: ['UniversalTransition']
});

// 折线图配置
const lineChartOption = ref({
  title: {
    text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads']
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
      data: []
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: []
    },
  ]
});

// 异步获取数据
const getLineChartOption = async () => {
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  lineChartOption.value.series[0].data = [120, 132, 101, 134, 90, 230, 210];
  lineChartOption.value.series[1].data = [220, 182, 191, 234, 290, 330, 310];
  loading.value = false;
};

const clearLineChartOption = () => {
  lineChartOption.value.series[0].data = [];
  lineChartOption.value.series[1].data = [];
};

const isEmpty = computed(() => {
  return lineChartOption?.value?.series?.[0]?.data?.length === 0 && lineChartOption?.value?.series?.[1]?.data?.length === 0;
});

// 柱状图配置
const barChartOption = ref({
  title: { text: '简化组件 - 柱状图' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  tooltip: { trigger: 'axis' },
  legend: { data: ['柱状图'] },
  xAxis: {
    type: 'category',
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: { type: 'value' },
  series: [{
    name: '柱状图',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20],
    itemStyle: { color: '#67C23A' }
  }]
});

// 饼图配置
const pieChartOption = ref({
  title: { text: '完整组件 - 饼图', left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{
    name: '饼图',
    type: 'pie',
    radius: '50%',
    data: [
      { value: 1048, name: '搜索引擎' },
      { value: 735, name: '直接访问' },
      { value: 580, name: '邮件营销' },
      { value: 484, name: '联盟广告' },
      { value: 300, name: '视频广告' }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
});

onMounted(async () => {
  // 模拟异步获取数据
  await new Promise(resolve => setTimeout(resolve, 1000));
  loading.value = false;
});
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
