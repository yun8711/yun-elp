<template>
  <el-menu class="y-menu" ref="menuRef" v-bind="elMenuProps">
    <y-menu-item v-for="item in data" :key="item.index" :item="item" :level="0" :indent="indent" :parent-indent="0">
      <!-- 传递所有插槽给子组件 -->
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </y-menu-item>
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



const elMenuProps = computed(() => {
  const { indent, data, ...rest } = props;
  return {
    collapseTransition: true,
    popperClass: 'y-menu-popper',
    ...rest,
  };
});

const menuRef = useTemplateRef('menuRef');
defineExpose(
  new Proxy({}, {
    get: (_target, key) => menuRef.value?.[key],
    has: (_target, key) => key in (menuRef.value || {})
  })
)
</script>
