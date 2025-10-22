# 在AppWrap中配置ECharts模块

## 1. 在AppWrap中配置ECharts模块

```vue
<!-- App.vue -->
<template>
  <y-app-wrap
    :elp-config="{ locale: 'zh-cn' }"
    :echarts="echartsConfig"
  >
    <router-view />
  </y-app-wrap>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 在AppWrap中配置项目需要的ECharts模块
const echartsConfig = ref({
  // 项目主要使用的图表类型
  chartTypes: ['LineChart', 'BarChart', 'PieChart', 'ScatterChart'],
  
  // 项目主要使用的组件
  components: [
    'GridComponent',
    'TooltipComponent', 
    'LegendComponent',
    'DataZoomComponent',
    'VisualMapComponent'
  ],
  
  // 渲染器
  renderers: ['CanvasRenderer'],
  
  // 是否自动预加载（默认true）
  autoPreload: true
});
</script>
```

## 2. 使用智能ECharts组件

```vue
<!-- MyLineChart.vue -->
<template>
  <y-echarts-smart
    :option="chartOption"
    :loading="loading"
    :width="width"
    :height="height"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import YEchartsSmart from 'your-package/echarts/echarts-smart';

const props = defineProps({
  data: Object,
  width: { type: [Number, String], default: '100%' },
  height: { type: [Number, String], default: '400px' }
});

const loading = ref(true);

const chartOption = computed(() => {
  if (!props.data) return {};
  
  return {
    title: { text: '折线图示例' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: { data: ['折线图'] },
    xAxis: { 
      type: 'category', 
      data: props.data.categories,
      boundaryGap: false 
    },
    yAxis: { type: 'value' },
    series: [{
      name: '折线图',
      type: 'line',
      data: props.data.values,
      smooth: true,
      itemStyle: { color: '#409EFF' }
    }]
  };
});

onMounted(async () => {
  // 模拟异步获取数据
  await new Promise(resolve => setTimeout(resolve, 1000));
  loading.value = false;
});
</script>
```

## 3. 不同场景的配置示例

### 小型项目（基础图表）
```typescript
const echartsConfig = {
  chartTypes: ['LineChart', 'BarChart'],
  components: ['GridComponent', 'TooltipComponent', 'LegendComponent'],
  renderers: ['CanvasRenderer']
};
```

### 中型项目（数据看板）
```typescript
const echartsConfig = {
  chartTypes: ['LineChart', 'BarChart', 'PieChart', 'ScatterChart'],
  components: [
    'GridComponent',
    'TooltipComponent', 
    'LegendComponent',
    'DataZoomComponent',
    'VisualMapComponent'
  ],
  renderers: ['CanvasRenderer']
};
```

### 大型项目（完整功能）
```typescript
const echartsConfig = {
  chartTypes: [
    'LineChart', 'BarChart', 'PieChart', 'ScatterChart',
    'RadarChart', 'MapChart', 'TreeChart', 'GaugeChart'
  ],
  components: [
    'GridComponent', 'PolarComponent', 'RadarComponent', 'GeoComponent',
    'ToolboxComponent', 'TooltipComponent', 'LegendComponent',
    'DataZoomComponent', 'VisualMapComponent', 'TitleComponent'
  ],
  renderers: ['CanvasRenderer', 'SVGRenderer']
};
```

## 4. 组件使用方式

### 方式1：使用智能组件（推荐）
```vue
<!-- 自动根据AppWrap配置加载模块 -->
<y-echarts-smart :option="chartOption" />
```

### 方式2：使用简化组件
```vue
<!-- 假设模块已在AppWrap中预加载 -->
<y-echarts-simple :option="chartOption" />
```

### 方式3：使用完整组件（不推荐）
```vue
<!-- 每次都会动态导入，性能较差 -->
<y-echarts 
  :option="chartOption"
  :chart-types="['LineChart']"
  :components="['GridComponent', 'TooltipComponent']"
/>
```

## 5. 优势分析

### ✅ 架构优势
- **集中管理**：在AppWrap中统一管理ECharts模块依赖
- **按需配置**：根据项目实际需求配置模块
- **自动预加载**：应用启动时自动预加载，无需手动调用

### ✅ 性能优势
- **预加载**：应用启动时一次性加载所需模块
- **智能加载**：组件根据配置智能选择加载策略
- **避免重复**：避免每个组件实例重复导入相同模块

### ✅ 开发体验
- **配置简单**：只需在AppWrap中配置一次
- **使用便捷**：组件使用时无需关心模块加载
- **类型安全**：完整的TypeScript支持

## 6. 最佳实践

### 1. 根据项目规模选择配置
```typescript
// 小型项目：基础图表
const basicConfig = {
  chartTypes: ['LineChart', 'BarChart'],
  components: ['GridComponent', 'TooltipComponent', 'LegendComponent']
};

// 中型项目：数据看板
const dashboardConfig = {
  chartTypes: ['LineChart', 'BarChart', 'PieChart'],
  components: ['GridComponent', 'TooltipComponent', 'LegendComponent', 'DataZoomComponent']
};

// 大型项目：完整功能
const fullConfig = {
  chartTypes: ['LineChart', 'BarChart', 'PieChart', 'ScatterChart', 'RadarChart'],
  components: ['GridComponent', 'TooltipComponent', 'LegendComponent', 'DataZoomComponent', 'VisualMapComponent']
};
```

### 2. 组件选择建议
- **推荐**：使用`y-echarts-smart`，自动根据配置加载
- **备选**：使用`y-echarts-simple`，假设模块已预加载
- **避免**：使用`y-echarts`，每次动态导入性能较差

### 3. 配置建议
- 根据项目实际使用的图表类型配置
- 不要配置过多不必要的模块
- 定期检查配置，移除未使用的模块
