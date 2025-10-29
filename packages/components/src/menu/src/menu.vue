<template>
  <el-menu v-bind="{ ...$attrs, ...elMenuProps }" class="y-menu" :style="indentStyle" ref="menuRef">
    <!-- 数据驱动模式 -->
    <y-menu-item
      v-for="item in data"
      :key="item.index"
      :item="item"
      :render-icon="renderIcon"
      :level="0"
      :indent="indent"
    />
  </el-menu>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from '@vue/runtime-core';
import { ElMenu } from 'element-plus';
import type { MenuProps } from './menu';
import YMenuItem from './MenuItem.vue';

defineOptions({
  name: 'YMenu',
  inheritAttrs: true
});

// 组件 Props
const props = withDefaults(defineProps<MenuProps>(), {
  indent: 20
});

// 设置每一层级的缩进，如果indent是数组，则根据层级设置缩进
const indentStyle = computed(() => {
  if (Array.isArray(props.indent)) {
    return props.indent
      .map((item: number, index: number) => `--menu-indent-${index}: ${item}px;`)
      .join(' ');
  }
  return `--menu-indent: ${props.indent}px;`;
});

// 模板引用
const menuRef = useTemplateRef('menuRef');

// 计算传递给 el-menu 的属性（排除自定义属性）
const elMenuProps = computed(() => {
  const { data, renderIcon, indent, ...restProps } = props;
  return restProps;
});

// 暴露 el-menu 的方法和属性
defineExpose({
  menuRef
});
</script>
