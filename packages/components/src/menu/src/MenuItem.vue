<template>
  <!-- 无子菜单：渲染普通菜单项 -->
  <el-menu-item v-if="!hasChildren" :index="item.index" :disabled="item.disabled" :style="itemStyle">
    <slot :name="`icon-${item.index}`" :item="item" :level="level">
      <slot name="icon" :item="item" :level="level">
        <component v-if="iconVNode" :is="iconVNode" class="y-menu-item__icon" />
      </slot>
    </slot>
    <!-- 插槽优先级：item-{index} > item-label > 默认 label -->
    <slot :name="`label-${item.index}`" :item="item" :level="level">
      <slot name="label" :item="item" :level="level">
        <span>{{ item.label }}</span>
      </slot>
    </slot>
  </el-menu-item>

  <!-- 有子菜单：渲染子菜单 -->
  <el-sub-menu v-else :index="item.index" :disabled="item.disabled" :style="itemStyle">
    <template #title>
      <slot :name="`icon-${item.index}`" :item="item" :level="level">
        <slot name="icon" :item="item" :level="level">
          <component v-if="iconVNode" :is="iconVNode" class="y-menu-item__submenu-icon" />
        </slot>
      </slot>
      <!-- 插槽优先级：item-{index} > item-label > 默认 label -->
      <slot :name="`label-${item.index}`" :item="item" :level="level">
        <slot name="label" :item="item" :level="level">
          <span>{{ item.label }}</span>
        </slot>
      </slot>
    </template>

    <!-- 递归渲染子菜单项，递归传递插槽 -->
    <y-menu-item v-for="child in item.children" :key="child.index" :item="child" :level="level + 1" :indent="indent"
      :parent-indent="currentIndent">
      <!-- 递归传递所有插槽给子菜单项 -->
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </y-menu-item>
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
  parentIndent?: number; // 父级缩进距离
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  level: 0,
  indent: 20,
  parentIndent: 0,
});

// 计算当前层级的缩进值
const currentIndent = computed(() => {
  let v = 0;
  // 如果indent是数组，则根据层级返回对应的缩进值
  if (Array.isArray(props.indent)) {
    v = props.indent?.[props.level] ?? props.indent?.[0] ?? 20;
  } else {
    // 如果indent是数字，则直接返回缩进值
    v = props.indent ?? 20;
  }

  return (v + props.parentIndent) || 0;
});

// 计算样式对象
const itemStyle = computed(() => ({

  '--menu-indent': `${currentIndent.value}px`
}));

// 计算属性
const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0;
});

// 图标渲染结果
const iconVNode = computed(() => {
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
