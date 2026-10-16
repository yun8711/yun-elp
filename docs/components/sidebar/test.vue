<template>
  <div class="sidebar-demo">
    <y-sidebar
      v-model:collapsed="collapsed"
      :menu-list="menuList"
      :active-menu="activeMenu"
      show-footer
      :menu-props="{ defaultOpeneds: ['/home'] }"
      @select="onSelect"
    >
      <template #header>
        <div class="sidebar-demo__logo">{{ collapsed ? 'Y' : 'YUN' }}</div>
      </template>
    </y-sidebar>
    <div class="sidebar-demo__content">当前：{{ activeMenu }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { House, InfoFilled, Setting } from '@element-plus/icons-vue'

const collapsed = ref(false)
const activeMenu = ref('/home/overview')
const menuList = [
  {
    path: '/home',
    title: '首页',
    icon: House,
    children: [
      { path: '/home/overview', title: '概览' },
      { path: '/home/detail', title: '详情' }
    ]
  },
  {
    path: '/system',
    title: '系统',
    icon: Setting,
    children: [{ path: '/system/user', title: '用户' }]
  },
  { path: '/about', title: '关于', icon: InfoFilled }
]

function onSelect(index) {
  activeMenu.value = index
}
</script>

<style scoped>
.sidebar-demo {
  display: flex;
  height: 400px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
}

.sidebar-demo__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-weight: 600;
  border-bottom: 1px solid var(--el-border-color-light);
}

.sidebar-demo__content {
  flex: 1;
  min-width: 0;
  padding: 16px;
}
</style>
