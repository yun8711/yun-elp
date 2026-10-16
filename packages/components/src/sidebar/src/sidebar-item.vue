<template>
  <el-sub-menu
    v-if="hasChild"
    :index="menuIndex"
    :disabled="item.disabled"
    :class="levelClass"
    :style="itemStyle"
  >
    <template #title>
      <YSidebarItemIcon :item="item" :level="level" />
      <YSidebarItemTitle
        :item="item"
        :level="level"
        :title-config="titleConfig"
        :extra-style="extraStyle"
        :collapsed="collapsed"
      />
    </template>
    <YSidebarItem
      v-for="child in item.children"
      :key="getSidebarMenuIndex(child)"
      :item="child"
      :level="level + 1"
      :indent="indent"
      :indent-map="indentMap"
      :icon-max-width="iconMaxWidth"
      :icon-gap="iconGap"
      :collapsed="collapsed"
      :title-config="titleConfig"
      :extra-style="extraStyle"
      :parent-text-start="textStart"
      :parent-has-icon="occupyIcon"
    />
  </el-sub-menu>
  <el-menu-item
    v-else
    :index="menuIndex"
    :disabled="item.disabled"
    :class="levelClass"
    :style="itemStyle"
  >
    <YSidebarItemIcon :item="item" :level="level" />
    <template #title>
      <YSidebarItemTitle
        :item="item"
        :level="level"
        :title-config="titleConfig"
        :extra-style="extraStyle"
        :collapsed="collapsed"
      />
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { ElMenuItem, ElSubMenu } from 'element-plus';
import type { SidebarMenuItem, SidebarTitleConfig } from './sidebar';
import {
  getSidebarIconOccupy,
  getSidebarMenuIndex,
  getSidebarTextStart,
  hasSidebarMenuIcon,
  resolveSidebarBadge,
  resolveSidebarItemIndent,
  sidebarSlotsKey
} from './sidebar';
import { useDirection } from '../../../hooks/use-direction';
import { useNamespace } from '../../../hooks/use-namespace';
import YSidebarItem from './sidebar-item.vue';
import YSidebarItemIcon from './sidebar-item-icon.vue';
import YSidebarItemTitle from './sidebar-item-title.vue';

defineOptions({
  name: 'YSidebarItem'
});

const props = defineProps<{
  item: SidebarMenuItem;
  level: number;
  indent: number;
  indentMap: Record<number, number>;
  iconMaxWidth: number;
  iconGap: number;
  collapsed: boolean;
  titleConfig: Partial<SidebarTitleConfig>;
  extraStyle?: Record<string, any>;
  parentTextStart: number;
  parentHasIcon?: boolean;
}>();

const ns = useNamespace('sidebar');
const { isRtl } = useDirection();
const rootSlots = inject(sidebarSlotsKey, {});

const menuIndex = computed(() => getSidebarMenuIndex(props.item));
const hasChild = computed(() => (props.item.children?.length ?? 0) > 0);
const levelClass = computed(() => ns.em('item', `level-${props.level}`));
const hasIcon = computed(() => hasSidebarMenuIcon(props.item, !!rootSlots.icon));
const hasBadge = computed(
  () => resolveSidebarBadge(props.item.badge, { rtl: isRtl.value }) != null
);
const occupyIcon = computed(() => hasIcon.value || hasBadge.value);

const paddingStart = computed(() =>
  resolveSidebarItemIndent({
    item: props.item,
    level: props.level,
    parentTextStart: props.parentTextStart,
    parentHasIcon: props.parentHasIcon,
    indent: props.indent,
    indentMap: props.indentMap
  })
);

const textStart = computed(() =>
  getSidebarTextStart(
    paddingStart.value,
    getSidebarIconOccupy(occupyIcon.value, props.iconMaxWidth, props.iconGap)
  )
);

const itemStyle = computed(() => ({
  [ns.cssVarName('sidebar-item-indent')]: `${paddingStart.value}px`
}));
</script>
