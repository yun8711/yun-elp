<template>
  <div class="demo-container">
    <h2>ECharts组件完整使用示例</h2>

    <!-- 在AppWrap中配置ECharts模块 -->
    <y-app-wrap
      :elp-config="{ locale: 'zh-cn' }"
      :echarts="echartsConfig"
    >
      <div class="charts-section">
        <h3>1. 智能组件（推荐）</h3>
        <p>自动根据AppWrap配置加载模块，无需手动指定</p>
        <y-echarts-smart
          :option="lineChartOption"
          :loading="loading"
          width="600"
          height="300"
        />
      </div>

      <div class="charts-section">
        <h3>2. 简化组件</h3>
        <p>假设模块已在AppWrap中预加载，直接使用</p>
        <y-echarts-simple
          :option="barChartOption"
          :loading="loading"
          width="600"
          height="300"
        />
      </div>

      <div class="charts-section">
        <h3>3. 完整组件（不推荐）</h3>
        <p>每次都会动态导入，性能较差，仅用于演示</p>
        <y-echarts
          :option="pieChartOption"
          :loading="loading"
          :chart-types="['PieChart']"
          :components="['TooltipComponent', 'LegendComponent']"
          width="600"
          height="300"
        />
      </div>
    </y-app-wrap>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { YEchartsSmart, YEchartsSimple, YEcharts } from '../index';

// AppWrap中的ECharts配置
const echartsConfig = ref({
  // 项目主要使用的图表类型
  chartTypes: ['LineChart', 'BarChart', 'PieChart'],

  // 项目主要使用的组件
  components: [
    'GridComponent',
    'TooltipComponent',
    'LegendComponent',
    'DataZoomComponent'
  ],

  // 渲染器
  renderers: ['CanvasRenderer'],

  // 自动预加载
  autoPreload: true
});

const loading = ref(true);

// 折线图配置
const lineChartOption = ref({
  title: { text: '智能组件 - 折线图' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  tooltip: { trigger: 'axis' },
  legend: { data: ['折线图'] },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    boundaryGap: false
  },
  yAxis: { type: 'value' },
  series: [{
    name: '折线图',
    type: 'line',
    data: [120, 200, 150, 80, 70, 110, 130],
    smooth: true,
    itemStyle: { color: '#409EFF' }
  }]
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
