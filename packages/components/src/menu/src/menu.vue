<template>
  <el-menu class="y-menu" ref="menuRef" v-bind="elMenuProps">
    <y-menu-item
      v-for="item in data"
      :key="item.index"
      :item="item"
      :level="0"
      :indent="indent"
      :parent-indent="0"
    >
      <!-- 传递所有插槽给子组件 -->
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </y-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from '@vue/runtime-core';
import type { ComponentPublicInstance } from '@vue/runtime-core';
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
    ...rest
  };
});

type ElMenuInstance = ComponentPublicInstance<InstanceType<typeof ElMenu>>;

const menuRef = useTemplateRef<ElMenuInstance>('menuRef');
defineExpose(
  new Proxy({} as ElMenuInstance, {
    get: (_target, key: string | symbol) => {
      const value = menuRef.value;
      if (value && typeof value === 'object' && key in value) {
        return (value as unknown as Record<string | symbol, unknown>)[key];
      }
      return undefined;
    },
    has: (_target, key: string | symbol) => {
      const value = menuRef.value;
      return value !== null && value !== undefined && typeof value === 'object' && key in value;
    }
  })
);
</script>
