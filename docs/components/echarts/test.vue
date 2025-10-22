<template>
  <div class="demo-container">
    <h3>基础用法</h3>
    <y-echarts
      :option="basicOption"
      :width="600"
      :height="400"
    />

    <h3>动态按需导入 - 柱状图</h3>
    <y-echarts
      :option="barOption"
      :width="600"
      :height="400"
      :chart-types="['BarChart']"
      :components="['GridComponent', 'TooltipComponent', 'LegendComponent']"
    />

    <h3>动态按需导入 - 饼图</h3>
    <y-echarts
      :option="pieOption"
      :width="600"
      :height="400"
      :chart-types="['PieChart']"
      :components="['TooltipComponent', 'LegendComponent']"
    />

    <h3>动态按需导入 - 散点图</h3>
    <y-echarts
      :option="scatterOption"
      :width="600"
      :height="400"
      :chart-types="['ScatterChart']"
      :components="['GridComponent', 'TooltipComponent', 'LegendComponent']"
    />

    <h3>加载状态</h3>
    <y-echarts
      :option="loadingOption"
      :width="600"
      :height="400"
      :loading="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 基础配置
const basicOption = ref({
  title: {
    text: '基础图表'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'line'
  }]
});

// 柱状图配置
const barOption = ref({
  title: {
    text: '柱状图示例'
  },
  tooltip: {},
  legend: {
    data: ['销量']
  },
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
});

// 饼图配置
const pieOption = ref({
  title: {
    text: '饼图示例',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [{
    name: '访问来源',
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

// 散点图配置
const scatterOption = ref({
  title: {
    text: '散点图示例'
  },
  tooltip: {
    trigger: 'item'
  },
  xAxis: {},
  yAxis: {},
  series: [{
    symbolSize: 20,
    data: [
      [10.0, 8.04],
      [8.07, 6.95],
      [13.0, 7.58],
      [9.05, 8.81],
      [11.0, 8.33],
      [14.0, 9.96],
      [6.0, 7.24],
      [4.0, 4.26],
      [12.0, 10.84],
      [7.0, 4.82],
      [5.0, 5.68]
    ],
    type: 'scatter'
  }]
});

// 加载状态配置
const loadingOption = ref({
  title: {
    text: '加载中的图表'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'line'
  }]
});
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.demo-container h3 {
  margin: 20px 0 10px 0;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 500;
}

.demo-container h3:first-child {
  margin-top: 0;
}
</style>
