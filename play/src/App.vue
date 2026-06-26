<template>
  <el-config-provider :namespace="demoNamespaces.el">
    <Layout
      v-model:locale="locale"
      v-model:theme="theme"
      #default="{ curComponent }"
      :examples="examples">
      <y-app-wrap
        :key="locale"
        :elp-config="{ namespace: demoNamespaces.el }"
        :y-namespace="demoNamespaces.y"
        v-bind="appWrapConfig">
        <component :is="examples.find(item => item.value === curComponent)?.component" />
      </y-app-wrap>
    </Layout>
  </el-config-provider>
</template>

<script setup>
import { ref, watch } from 'vue';
import Layout from './components/Layout.vue';
import logo from './assets/test.png';
import { examples } from './examples';


const demoNamespaces = {
  el: 'ep',
  y: 'yp'
};

const locale = ref('zh-cn');
const theme = ref('kd');

watch(
  theme,
  value => {
    document.documentElement.setAttribute('data-yun-theme', value);
  },
  { immediate: true }
);

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
  background: var(--ep-bg-color);
  border: 1px solid var(--ep-border-color-light);
  border-radius: 8px;

  span {
    font-weight: 500;
    color: var(--ep-text-color-primary);
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
    color: var(--ep-text-color-primary);
    text-align: center;
  }
}

.demo-block {
  padding: 20px;
  margin-bottom: 40px;
  background: var(--ep-bg-color);
  border: 1px solid var(--ep-border-color-light);
  border-radius: 8px;

  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--ep-text-color-primary);
  }

  .tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--ep-text-color-secondary);
  }

  .scroll-info {
    margin-top: 8px;
    font-size: 12px;
    font-weight: 500;
    color: var(--ep-color-primary);
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
        color: var(--ep-text-color-primary);
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
  color: var(--ep-color-primary);
  white-space: nowrap;
  background: var(--ep-color-primary-light-9);
  border: 1px solid var(--ep-color-primary-light-7);
  border-radius: 6px;
}

.small-item {
  flex-shrink: 0;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--ep-color-success);
  white-space: nowrap;
  background: var(--ep-color-success-light-9);
  border: 1px solid var(--ep-color-success-light-7);
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
      var(--ep-color-primary-light-8),
      var(--ep-color-primary-light-6)
    );
    border-radius: 8px;
  }
}

.card {
  flex-shrink: 0;
  width: 200px;
  padding: 16px;
  background: white;
  border: 1px solid var(--ep-border-color-light);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);

  h4 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 500;
    color: var(--ep-text-color-primary);
  }

  p {
    margin: 0 0 12px;
    font-size: 14px;
    line-height: 1.4;
    color: var(--ep-text-color-regular);
  }
}
</style>
