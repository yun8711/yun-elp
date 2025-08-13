<template>
  <Layout #default="{ locale }">
    <y-app-wrap :key="locale" :elp-config="{ locale: locale === 'zh-cn' ? zhCn : en }" :locale="locale"
      v-bind="appWrapConfig">

      <y-group-select v-model="value" :options="options">
        <template #default="{ item }">
          <span>{{ item.label }}123</span>
        </template>
      </y-group-select>
    </y-app-wrap>
  </Layout>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import Layout from './components/Layout.vue'
import { User, InfoFilled } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { treeData } from './test-data'

const appWrapConfig = {
  dialog: {
    titleStyle: {
      color: 'red'
    },
    closeOnClickModal: true
  }
}

const value = ref('2');
const options = ref([
  {
    value: '1',
    label: '选项1',
    icon: 'el-icon-user',

    disabled: true
  },
  {
    value: '2',
    label: '选项2',
    loading: true,
  },
  {
    value: '3',
    label: '选项3'
  }
])

</script>

<style lang="scss" scoped>
.demo-container {
  padding: 20px;
  max-width: 1200px;
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
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color);

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
    color: var(--el-color-primary);
    font-weight: 500;
  }

  .control-buttons {
    margin-top: 12px;
    display: flex;
    gap: 8px;
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
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 6px;
  color: var(--el-color-primary);
  font-weight: 500;
  white-space: nowrap;
}

.small-item {
  flex-shrink: 0;
  padding: 8px 16px;
  background: var(--el-color-success-light-9);
  border: 1px solid var(--el-color-success-light-7);
  border-radius: 4px;
  color: var(--el-color-success);
  font-weight: 500;
  white-space: nowrap;
  font-size: 12px;
}

.image-item {
  flex-shrink: 0;
  width: 120px;
  height: 120px;

  .image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--el-color-primary-light-8), var(--el-color-primary-light-6));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 500;
    font-size: 14px;
  }
}

.card {
  flex-shrink: 0;
  width: 200px;
  padding: 16px;
  background: white;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: var(--el-text-color-regular);
    line-height: 1.4;
  }
}
</style>
