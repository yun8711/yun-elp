<template>
  <div class="sidebar-demo">
    <y-sidebar
      v-model:collapsed="collapsed"
      :menu-list="menuList"
      :active-menu="activeMenu"
      :extra-style="{ fontSize: '12px', color: 'var(--el-color-info)', lineHeight: 1 }"
      show-footer
      :menu-props="{ defaultOpeneds: ['/home'] }"
      @select="onSelect"
    />
    <div class="sidebar-demo__content">当前：{{ activeMenu }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Bell, House, InfoFilled } from '@element-plus/icons-vue'

const collapsed = ref(false)
const activeMenu = ref('/home/overview')
const menuList = [
  {
    path: '/home',
    title: '首页',
    icon: House,
    badge: { value: 12, type: 'primary' },
    children: [
      { path: '/home/overview', title: '概览' },
      { path: '/home/detail', title: '详情', extra: 'Hot' }
    ]
  },
  {
    path: '/notice',
    title: '通知',
    icon: Bell,
    badge: true
  },
  {
    path: '/about',
    title: '关于',
    icon: InfoFilled,
    extra: 'Beta',
    extraStyle: { color: 'var(--el-color-warning)' },
    badge: { isDot: true, placement: 'left', type: 'warning' }
  }
]

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
  flex: 1;
  min-width: 0;
  padding: 16px;
}
</style>
