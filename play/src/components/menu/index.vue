<template>
  <div>
    <h3>YMenu 无限级菜单组件</h3>
    <p>支持：组件图标、renderIcon函数、层级缩进、无图标</p>

    <h4>基础用法</h4>
    <y-menu :data="menuData" />

    <h4>自定义缩进</h4>
    <y-menu :data="menuData" :indent="30" mode="vertical" />
  </div>
</template>
<script setup>
// 导入图标组件
import { Menu as MenuIcon, Setting, User } from '@element-plus/icons-vue';
import { h } from 'vue';

defineOptions({
  name: 'Menu',
  inheritAttrs: true
});

// 自定义图标组件函数
const createIcon = iconName => {
  return h('i', { class: iconName });
};

const menuData = [
  {
    index: '1',
    label: '菜单1',
    icon: MenuIcon // 组件图标
  },
  {
    index: '2',
    label: '菜单2',
    icon: Setting, // 函数返回图标
    children: [
      {
        index: '2-1',
        label: '子菜单2-1',
        icon: User // 用户图标组件
      },
      {
        index: '2-2',
        label: '子菜单2-2'
        // 无图标
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
];

const renderIcon = params => {
  // renderIcon 函数优先级高于 item.icon
  // 这里可以根据层级、展开状态等返回不同的图标组件
  if (params.level === 1) {
    return h('i', { class: 'el-icon-star-on' }); // 顶级菜单使用星星图标
  }
  return null; // 其他情况不渲染图标
};
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
