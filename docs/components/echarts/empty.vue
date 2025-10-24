<template>
  <div class="demo-container">
    <h3>默认空状态</h3>
    <y-echarts :option="chartOption" :width="600" :height="400" :empty="true" />

    <h3>自定义空状态配置</h3>
    <y-echarts
      :option="chartOption"
      :width="600"
      :height="400"
      :empty="true"
      :empty-props="{ description: '暂无图表数据' }"
    />

    <h3>使用插槽自定义空状态</h3>
    <y-echarts :option="chartOption" :width="600" :height="400" :empty="true">
      <template #empty>
        <div class="custom-empty">
          <i class="el-icon-info"></i>
          <p>暂无数据，请稍后查看</p>
        </div>
      </template>
    </y-echarts>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 图表配置
const chartOption = ref({
  title: {
    text: '空状态示例'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'line'
    }
  ]
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

.custom-empty {
  text-align: center;
  padding: 40px 20px;
}

.custom-empty i {
  font-size: 48px;
  color: var(--el-text-color-disabled);
  margin-bottom: 16px;
  display: block;
}

.custom-empty p {
  color: var(--el-text-color-regular);
  font-size: 14px;
  margin: 0;
}
</style>
