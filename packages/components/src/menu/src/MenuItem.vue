<template>
  <!-- 无子菜单：渲染普通菜单项 -->
  <el-menu-item v-if="!hasChildren" :index="item.index" :disabled="item.disabled" class="y-menu-item"
    :style="itemStyle">
    <!-- 图标渲染 -->
    <component v-if="iconVNode" :is="iconVNode" class="y-menu-item__icon" :style="iconStyle" />
    <!-- 菜单文本 -->
    <span>{{ item.label }}</span>
  </el-menu-item>

  <!-- 有子菜单：渲染子菜单 -->
  <el-sub-menu v-else :index="item.index" :disabled="item.disabled" class="y-menu-item y-menu-item__submenu"
    :style="itemStyle">
    <!-- 子菜单标题 -->
    <template #title>
      <!-- 图标渲染 -->
      <component v-if="iconVNode" :is="iconVNode" class="y-menu-item__submenu-icon" :style="iconStyle" />
      <span>{{ item.label }}</span>
    </template>

    <!-- 递归渲染子菜单项 -->
    <y-menu-item v-for="child in item.children" :key="child.index" :item="child" :level="level + 1" :indent="indent" />
  </el-sub-menu>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { ElMenuItem, ElSubMenu } from 'element-plus';
import type { MenuItem, RenderIconFunction } from './menu';

// 组件 Props
interface MenuItemProps {
  item: MenuItem; // 菜单项数据
  level: number; // 当前层级
  indent?: number | number[]; // 缩进配置，从父组件传递
  iconStyle?: Record<string, string | number>;
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  level: 1,
  iconStyle:{
    width: '16px',
    height: '16px',
    fontSize: '16px',
  }
});

// 计算当前层级的缩进值
const currentIndent = computed(() => {
  // 如果indent是数组，则根据层级返回对应的缩进值
  if (Array.isArray(props.indent)) {
    return props.indent[props.level] ?? props.level * 20;
  }
  // 如果indent是数字，则直接返回缩进值
  return (props.indent ?? 20) * props.level;
});

// 计算样式对象
const itemStyle = computed(() => ({
  // '--menu-level': props.level,
  '--menu-indent': `${currentIndent.value}px`
}));

// 计算属性
const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0;
});

// 图标渲染结果
const iconVNode = computed(() => {
  // 优先使用 renderIcon 函数
  // if (props.renderIcon) {
  //   try {
  //     return props.renderIcon({
  //       item: props.item,
  //       level: props.level,
  //       isExpanded: false // TODO: 可以从 el-sub-menu 的状态获取
  //     });
  //   } catch (error) {
  //     console.warn('[YMenu] renderIcon function error:', error);
  //     return null;
  //   }
  // }

  // 如果没有 renderIcon 函数，检查 item.icon
  if (props.item.icon) {
    try {
      // 如果是函数，调用它
      if (typeof props.item.icon === 'function') {
        return (props.item.icon as RenderIconFunction)({
          item: props.item,
          level: props.level,
          isExpanded: false
        });
      }
      // 如果是组件，直接返回
      return props.item.icon;
    } catch (error) {
      console.warn('[YMenu] item.icon error:', error);
      return null;
    }
  }

  return null;
});

defineOptions({
  name: 'YMenuItem'
});
</script>
