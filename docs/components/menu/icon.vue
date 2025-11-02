<template>
  <div style="width: 500px;border: 1px solid #ccc;">
    <el-switch v-model="isCollapse" />
    <y-menu :data="menuData" :indent="30" :collapse="isCollapse" />
  </div>
</template>
<script setup lang="ts">
import { h, ref } from 'vue'
// 使用 public 目录中的图片资源
const testImg = '/test/user.jpg'
const folder = '/test/folder.svg'
import { Menu as MenuIcon, Setting, User } from '@element-plus/icons-vue'

const isCollapse = ref(false)


// 创建SVG图标函数（作为img使用）
// 创建图片图标函数
const createImageIcon = (src: string, alt = 'icon') => {
  return h('img', {
    src,
    alt,
  })
}

const menuData = [
  {
    index: '1',
    label: '菜单1',
    icon: () => createImageIcon(testImg),
  },
  {
    index: '2',
    label: '菜单2',
    icon: MenuIcon,
    children: [
      {
        index: '2-1',
        label: '子菜单2-1',
        icon: () => createImageIcon(folder),
      },
      {
        index: '2-2',
        label: '子菜单2-2',
        icon: User,
        children: [
          {
            index: '2-2-1',
            label: '子菜单2-2-1'
          },
          {
            index: '2-2-2',
            label: '子菜单2-2-2'
          },
          {
            index: '2-2-3',
            label: '子菜单2-2-3',
          }
        ]
      }
    ]
  },
]

</script>
