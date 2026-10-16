<template>
  <div class="sidebar-demo">
    <y-sidebar
      class="sidebar-demo__sidebar"
      :style="sidebarStyle"
      :menu-list="menuList"
      :active-menu="activeMenu"
      show-footer
      :menu-props="{ defaultOpeneds: ['/home'] }"
      @select="onSelect"
    />
    <div class="sidebar-demo__content">
      <label class="sidebar-demo__color">
        <span>背景</span>
        <el-color-picker v-model="menuBgColor" show-alpha size="small" />
      </label>
      <label class="sidebar-demo__color">
        <span>文字</span>
        <el-color-picker v-model="menuTextColor" size="small" />
      </label>
      <label class="sidebar-demo__color">
        <span>激活字</span>
        <el-color-picker v-model="menuActiveColor" size="small" />
      </label>
      <label class="sidebar-demo__color">
        <span>激活底</span>
        <el-color-picker v-model="menuActiveBgColor" show-alpha size="small" />
      </label>
      <label class="sidebar-demo__color">
        <span>悬停底</span>
        <el-color-picker v-model="menuHoverBgColor" show-alpha size="small" />
      </label>
      <label class="sidebar-demo__color">
        <span>边框</span>
        <el-color-picker v-model="sidebarBorderColor" size="small" />
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { House, InfoFilled, Setting } from '@element-plus/icons-vue'

const activeMenu = ref('/home/overview')
const menuBgColor = ref('#ffffff')
const menuTextColor = ref('#303133')
const menuActiveColor = ref('#409eff')
const menuActiveBgColor = ref('rgba(64, 158, 255, 0.1)')
const menuHoverBgColor = ref('rgba(0, 0, 0, 0.06)')
const sidebarBorderColor = ref('#e4e7ed')
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
  { path: '/system', title: '系统', icon: Setting },
  { path: '/about', title: '关于', icon: InfoFilled }
]

const sidebarStyle = computed(() => ({
  '--y-sidebar-hover': menuHoverBgColor.value,
  '--y-sidebar-border': sidebarBorderColor.value,
  '--el-menu-bg-color': menuBgColor.value,
  '--el-menu-text-color': menuTextColor.value,
  '--el-menu-hover-text-color': menuTextColor.value,
  '--el-menu-active-color': menuActiveColor.value,
  '--el-menu-hover-bg-color': menuHoverBgColor.value,
  '--el-menu-border-color': sidebarBorderColor.value,
  '--sidebar-demo-active-bg': menuActiveBgColor.value
}))

function onSelect(index) {
  activeMenu.value = index
}
</script>

<style scoped>
.sidebar-demo {
  display: flex;
  height: 360px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
}

.sidebar-demo__content {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 16px;
  align-content: start;
  min-width: 0;
  padding: 16px;
}

.sidebar-demo__color {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--el-text-color-regular);
  cursor: pointer;
}

.sidebar-demo__sidebar :deep(.el-menu-item.is-active) {
  background-color: var(--sidebar-demo-active-bg) !important;
}
</style>
