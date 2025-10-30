<template>
  <el-menu class="y-menu" ref="menuRef" v-bind="elMenuProps" :style="style">
    <y-menu-item v-for="item in data" :key="item.index" :item="item" :level="1" :indent="indent"
      :iconStyle="iconStyle" />
  </el-menu>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from '@vue/runtime-core';
import { ElMenu } from 'element-plus';
import YMenuItem from './MenuItem.vue';
import type { MenuProps } from './menu';

defineOptions({
  name: 'YMenu',
  inheritAttrs: true
});

const props = defineProps<MenuProps>();

const iconStyle = computed(() => {
  return {
    width: '16px',
    height: '16px',
    fontSize: '16px',
  }
});

const style = {
  '--menu-icon-width': '16px',
  '--menu-icon-height': '16px',
  '--menu-icon-font-size': '16px',
  '--menu-icon-line-height': '16px',
  '--menu-collapse-width': '64px',
}

const menuRef = useTemplateRef('menuRef');

const elMenuProps = computed(() => {
  const { indent, data, ...rest } = props;
  return {
    collapseTransition: true,
    popperClass: 'y-menu-popper',
    ...rest,
  };
});

// 暴露 el-menu 的方法和属性
defineExpose({
  menuRef
});
</script>
