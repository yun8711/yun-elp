<template>
  <div>
    <h4>各种形式的图标</h4>
    <el-switch v-model="isCollapse" />
    <div style="width: 300px;border: 1px solid #ccc;">
      <y-menu :collapse="isCollapse" :data="menuData0" :style="{ '--y-menu-collapse-width': '40px', '--y-submenu-active-bg-color': '#f0f2f5','--y-menu-active-bg-color':'#f0f2f5' }" />
    </div>


    <h4>数字缩进（所有层级相同）</h4>
    <y-menu :data="menuData" :indent="30" :collapse="isCollapse" :style="{ '--y-menu-collapse-width': '40px','--y-submenu-active-bg-color':'#f0f2f5','--y-menu-active-bg-color':'#f0f2f5' }" />

    <h4>数组缩进（各层级不同）</h4>
    <!-- <y-menu :data="menuData" :indent="[20, 20, 20, 20]" mode="vertical" /> -->
  </div>
</template>
<script setup>
// 导入图标组件
import { Menu as MenuIcon, Setting, User } from '@element-plus/icons-vue'
import { h, ref } from 'vue'
import testImg from '@/assets/test.png'
import folder from '@/assets/folder.svg'
import baobiao from '@/assets/baobiao.svg'

defineOptions({
  name: 'Menu',
  inheritAttrs: true
})

const isCollapse = ref(false)

// 自定义图标组件函数
const createIcon = iconName => {
  return h('i', { class: iconName })
}

// 创建SVG图标函数（作为img使用）
// 创建图片图标函数
const createImageIcon = (src, alt = 'icon') => {
  return h('img', {
    src,
    alt,
  })
}



const menuData0 = [
  {
    index: '1',
    label: '图片图标',
    icon: () => createImageIcon(testImg, '菜单2图标'),
  },
  {
    index: '2',
    label: 'element-plus图标',
    icon: MenuIcon, // 组件图标
  },
  {
    index: '3',
    label: '无图标',
    icon: () => createImageIcon(folder, '菜单3图标'),
  },
  {
    index: '4',
    label: '无图标',
    icon: () => createImageIcon(baobiao, '菜单4图标'),
  }
]

const menuData = [
  {
    index: '1',
    label: '菜单1',
    // 使用图片作为图标（函数方式）
    icon: () => createImageIcon(testImg, '菜单2图标'),
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
  {
    index: '3',
    label: '菜单3',
    children: [
      {
        index: '3-1',
        label: '用户管理'
      }
    ]
  }
]

const renderIcon = params => {
  // renderIcon 函数优先级高于 item.icon
  // 这里可以根据层级、展开状态等返回不同的图标组件
  if (params.level === 1) {
    return h('i', { class: 'el-icon-star-on' }) // 顶级菜单使用星星图标
  }
  return null // 其他情况不渲染图标
}
</script>
<style scoped>
div {
  padding: 20px;
}

h3 {
  margin: 20px 0 10px 0;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}
</style>
