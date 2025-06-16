<template>
  <Layout #default="{ locale }">
    <y-app-wrap :key="locale" :elp-config="{ locale: locale === 'zh-CN' ? zhCn : en }" :locale="locale"
      v-bind="appWrapConfig">

      <div>当前语言：{{ locale }}</div>

      <div class="demo-block">
        <h3>基础用法</h3>
        <y-label label="用户名">老刘</y-label>
        <y-label label="用户名" colon=":">老刘</y-label>
      </div>

      <div class="demo-block">
        <h3>带图标</h3>
        <y-label label="用户名" colon=":">
          <template #prefix>
            <el-icon>
              <User />
            </el-icon>
          </template>
          老刘
          <template #suffix>
            <el-icon>
              <InfoFilled />
            </el-icon>
          </template>
        </y-label>
      </div>

      <div class="demo-block">
        <h3>基础用法</h3>
        <y-label label="用户名" colon=":" height="80px" :label-style="labelStyle" :content-style="contentStyle">
          Yingdu Building, Zhichun Road, BeijingYingdu Building, Zhichun Road, BeijingYingdu Building, Zhichun Road,
          BeijingYingdu Building, Zhichun Road, BeijingYingdu Building, Zhichun Road, BeijingYingdu Building, Zhichun
          Road, Beijing
        </y-label>
      </div>

      <div class="demo-block">
        <h3>表单控件组合</h3>
        <div style="display: flex;flex-direction: column;gap: 8px;">
          <y-label label="Name" width="300px" label-width="100px" label-align="right">Socrates</y-label>
          <y-label label="Mobile" width="300px" label-width="100px" label-align="right"> 123-1234-1234</y-label>
          <y-label label="Residence" width="300px" label-width="100px" label-align="right">Beijing</y-label>
        </div>
      </div>
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

const labelStyle = {
  color: 'red',
  backgroundColor: '#eee',
  justifyContent: 'flex-start',
  alignItems: 'flex-start'
}

const contentStyle = {
  color: 'blue',
  backgroundColor: '#eee',
  justifyContent: 'flex-end',
  alignItems: 'flex-end'
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
