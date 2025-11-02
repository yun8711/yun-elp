<template>
  <div style="display: flex;gap:20px;">
    <div style="width: 500px;border: 1px solid #ccc;">
      <div>数字缩进（所有层级相同）</div>
      <y-menu :data="menuData" :indent="30" />
    </div>

    <div style="width: 500px;border: 1px solid #ccc;">
      <div>数组缩进（各层级不同）</div>
      <y-menu :data="menuData" :indent="[10, 30, 0, 40]" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Menu as MenuIcon, Setting, User } from '@element-plus/icons-vue'

const menuData = [
  {
    index: '1',
    label: '菜单1',
    icon: Setting,
  },
  {
    index: '2',
    label: '菜单2',
    icon: MenuIcon, // 组件图标
    children: [
      {
        index: '2-1',
        label: '子菜单2-1',
        icon: User // 用户图标组件
      },
      {
        index: '2-2',
        label: '子菜单2-2',
        icon: User, // 用户图标组件
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
            children: [
              {
                index: '2-2-3-1',
                label: '子菜单2-2-3-1'
              },
              {
                index: '2-2-3-2',
                label: '子菜单2-2-3-2'
              }
            ]
          }
        ]
      }
    ]
  },
]

</script>
