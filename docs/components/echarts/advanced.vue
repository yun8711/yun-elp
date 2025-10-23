<template>
  <div class="demo-container">
    <h3>雷达图 - 自定义模块加载</h3>
    <y-echarts
      :option="radarOption"
      :width="600"
      :height="400"
      :chart-types="['RadarChart']"
      :components="['RadarComponent', 'TooltipComponent', 'LegendComponent', 'TitleComponent']"
    />

    <h3>热力图 - 自定义模块加载</h3>
    <y-echarts
      :option="heatmapOption"
      :width="600"
      :height="400"
      :chart-types="['HeatmapChart']"
      :components="['GridComponent', 'TooltipComponent', 'VisualMapComponent']"
    />

    <h3>仪表盘 - 自定义模块加载</h3>
    <y-echarts
      :option="gaugeOption"
      :width="600"
      :height="400"
      :chart-types="['GaugeChart']"
      :components="['TooltipComponent']"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 雷达图配置
const radarOption = ref({
  title: {
    text: '雷达图示例'
  },
  tooltip: {},
  legend: {
    data: ['预算分配', '实际开销']
  },
  radar: {
    indicator: [
      { name: '销售', max: 6500 },
      { name: '管理', max: 16000 },
      { name: '信息技术', max: 30000 },
      { name: '客服', max: 38000 },
      { name: '研发', max: 52000 },
      { name: '市场', max: 25000 }
    ]
  },
  series: [{
    name: '预算 vs 开销',
    type: 'radar',
    data: [
      {
        value: [4200, 3000, 20000, 35000, 50000, 18000],
        name: '预算分配'
      },
      {
        value: [5000, 14000, 28000, 26000, 42000, 21000],
        name: '实际开销'
      }
    ]
  }]
});

// 热力图配置
const heatmapOption = ref({
  tooltip: {
    position: 'top'
  },
  grid: {
    height: '50%',
    top: '10%'
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: ['早上', '上午', '中午', '下午', '晚上'],
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: 10,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '15%'
  },
  series: [{
    name: '活跃度',
    type: 'heatmap',
    data: [
      [0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0],
      [1, 0, 1], [1, 1, 8], [1, 2, 5], [1, 3, 7], [1, 4, 3],
      [2, 0, 0], [2, 1, 6], [2, 2, 10], [2, 3, 8], [2, 4, 2],
      [3, 0, 1], [3, 1, 7], [3, 2, 9], [3, 3, 10], [3, 4, 4],
      [4, 0, 2], [4, 1, 5], [4, 2, 8], [4, 3, 7], [4, 4, 6],
      [5, 0, 3], [5, 1, 4], [5, 2, 2], [5, 3, 3], [5, 4, 8],
      [6, 0, 1], [6, 1, 2], [6, 2, 1], [6, 3, 1], [6, 4, 5]
    ],
    label: {
      show: true
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
});

// 仪表盘配置
const gaugeOption = ref({
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [{
    name: '业务指标',
    type: 'gauge',
    detail: {
      formatter: '{value}%'
    },
    data: [
      { value: 75, name: '完成率' }
    ]
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

