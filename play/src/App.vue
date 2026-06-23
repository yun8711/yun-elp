<template>
  <Layout #default="{ locale,curComponent }" :examples="examples">
    <y-app-wrap
      :key="locale"
      :elp-config="{ locale: locale === 'zh-cn' ? zhCn : en }"
      :locale="locale"
      v-bind="appWrapConfig">
      <component :is="examples.find(item => item.value === curComponent)?.component" />
    </y-app-wrap>
  </Layout>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import Layout from './components/Layout.vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import logo from './assets/test.png';

// 组件映射 - 使用 defineAsyncComponent 包装动态导入
const examples = [
  {label: 'Sticky Page', value: 'sticky-page',component: defineAsyncComponent(() => import('./components/sticky-page/index.vue'))},
  {label: 'Page Progress', value: 'page-progress',component: defineAsyncComponent(() => import('./components/page-progress-example.vue'))},
  {label: 'Button', value: 'button',component: defineAsyncComponent(() => import('./components/button-example.vue'))},
  {label: 'Table', value: 'table',component: defineAsyncComponent(() => import('./components/table-example.vue'))},
  {label: 'Table Filter', value: 'table-filter',component: defineAsyncComponent(() => import('./components/table-filter.vue'))},
  {label: 'Table Select', value: 'table-select',component: defineAsyncComponent(() => import('./components/table-select-example.vue'))},
  {label: 'Text Tooltip', value: 'text-tooltip',component: defineAsyncComponent(() => import('./components/text-tooltip-example.vue'))},
  {label: 'Desc', value: 'desc',component: defineAsyncComponent(() => import('./components/desc-example.vue'))},
  {label: 'Form', value: 'form',component: defineAsyncComponent(() => import('./components/form-example.vue'))},
  {label: 'Empty', value: 'empty',component: defineAsyncComponent(() => import('./components/empty-example.vue'))},
  {label: 'Pop', value: 'pop',component: defineAsyncComponent(() => import('./components/pop-example.vue'))},
  {label: 'Step', value: 'step',component: defineAsyncComponent(() => import('./components/step-example.vue'))},
  {label: 'ECharts', value: 'echarts',component: defineAsyncComponent(() => import('./components/echarts/echarts-example.vue'))},
  {label: 'Table V2', value: 'table-v2',component: defineAsyncComponent(() => import('./components/table-v2/index.vue'))},
  {label: '网页容器', value: 'web-view',default: true,component: defineAsyncComponent(() => import('./components/web-view/index.vue'))}
]

const appWrapConfig = {
  dialog: {
    titleStyle: {
      color: 'red'
    },
    closeOnClickModal: true
  },
  empty: {
    image: logo
  },
  echarts: {
    // 项目主要使用的图表类型
    chartTypes: ['LineChart', 'BarChart', 'PieChart'],

    // 项目主要使用的组件
    components: [
      'GridComponent',
      'TooltipComponent',
      'LegendComponent',
      'DataZoomComponent',
      'TitleComponent'
    ],

    // 渲染器
    renderers: ['CanvasRenderer']
  }
};
</script>

<style lang="scss" scoped>
.component-selector {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  margin-bottom: 20px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;

  span {
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.demo-container {
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;

  h2 {
    margin-bottom: 32px;
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    text-align: center;
  }
}

.demo-block {
  padding: 20px;
  margin-bottom: 40px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;

  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  .scroll-info {
    margin-top: 8px;
    font-size: 12px;
    font-weight: 500;
    color: var(--el-color-primary);
  }

  .control-buttons {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .scroll-comparison {
    display: flex;
    gap: 20px;
    margin-top: 16px;

    .scroll-mode {
      flex: 1;

      h4 {
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        text-align: center;
      }
    }
  }
}

.scroll-content {
  display: flex;
  gap: 12px;
  padding: 8px;
}

.item {
  flex-shrink: 0;
  padding: 12px 20px;
  font-weight: 500;
  color: var(--el-color-primary);
  white-space: nowrap;
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 6px;
}

.small-item {
  flex-shrink: 0;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--el-color-success);
  white-space: nowrap;
  background: var(--el-color-success-light-9);
  border: 1px solid var(--el-color-success-light-7);
  border-radius: 4px;
}

.image-item {
  flex-shrink: 0;
  width: 120px;
  height: 120px;

  .image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-weight: 500;
    color: white;
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-8),
      var(--el-color-primary-light-6)
    );
    border-radius: 8px;
  }
}

.card {
  flex-shrink: 0;
  width: 200px;
  padding: 16px;
  background: white;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);

  h4 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 0 0 12px;
    font-size: 14px;
    line-height: 1.4;
    color: var(--el-text-color-regular);
  }
}
</style>
