<template>
  <div v-if="show" :class="ns.e('icon-badge')">
    <div v-if="hasIcon" :class="ns.e('icon-wrap')">
      <component :is="iconRenderer" v-if="rootSlots.icon" />
      <el-icon v-else-if="iconIsComponent" :class="ns.e('icon')">
        <component :is="item.icon" />
      </el-icon>
      <i v-else-if="iconClass" :class="[iconClass, ns.e('icon')]" />
    </div>
    <div v-else :class="ns.e('icon-wrap')" aria-hidden="true" />
    <span v-if="resolvedBadge" :class="[ns.e('badge'), ns.is(resolvedBadge.placement)]">
      <el-badge v-bind="resolvedBadge.badgeProps" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { isString } from 'lodash-es';
import { ElBadge, ElIcon } from 'element-plus';
import type { SidebarMenuItem } from './sidebar';
import {
  hasSidebarMenuIcon,
  isSidebarIconComponent,
  resolveSidebarBadge,
  sidebarSlotsKey
} from './sidebar';
import { useDirection } from '../../../hooks/use-direction';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YSidebarItemIcon'
});

const props = defineProps<{
  item: SidebarMenuItem;
  level: number;
}>();

const ns = useNamespace('sidebar');
const { isRtl } = useDirection();
const rootSlots = inject(sidebarSlotsKey, {});

const hasIcon = computed(() => hasSidebarMenuIcon(props.item, !!rootSlots.icon));
const iconIsComponent = computed(() => isSidebarIconComponent(props.item.icon));
const iconClass = computed(() => (isString(props.item.icon) ? props.item.icon : ''));
const resolvedBadge = computed(() => resolveSidebarBadge(props.item.badge, { rtl: isRtl.value }));
const show = computed(() => hasIcon.value || resolvedBadge.value != null);

const iconRenderer = () => rootSlots.icon?.({ item: props.item, level: props.level });
</script>
