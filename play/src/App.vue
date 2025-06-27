<template>
  <Layout #default="{ locale }">
    <y-app-wrap :key="locale" :elp-config="{ locale: locale === 'zh-CN' ? zhCn : en }" :locale="locale"
      v-bind="appWrapConfig">

      <div>当前语言：{{ locale }}</div>

    </y-app-wrap>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import Layout from './components/Layout.vue'
import { User, InfoFilled } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const appWrapConfig = {
  'border-label': {
    width: '316px',
    height: '32px'
  }
}

</script>

<style lang="scss" scoped>
.demo-block {
  margin-bottom: 32px;

  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}
</style>
