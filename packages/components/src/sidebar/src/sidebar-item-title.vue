<template>
  <div :class="ns.e('title-row')">
    <div :class="ns.e('title-main')">
      <component :is="titleRenderer" v-if="rootSlots.title" />
      <span v-else-if="!enabled" :class="ns.e('title')">{{ item.title }}</span>
      <y-text-tooltip v-else v-bind="tooltipProps" :class="ns.e('title-trigger')">
        {{ item.title }}
      </y-text-tooltip>
    </div>
    <span v-if="showExtra" :class="ns.e('title-extra')" :style="mergedExtraStyle">
      <component :is="extraRenderer" v-if="rootSlots.extra" />
      <template v-else>{{ item.extra }}</template>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { isString } from 'lodash-es';
import YTextTooltip from '../../text-tooltip/src/text-tooltip.vue';
import type { SidebarMenuItem, SidebarTitleConfig } from './sidebar';
import { mergeSidebarTitleConfig, sidebarSlotsKey } from './sidebar';
import { useDirection } from '../../../hooks/use-direction';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YSidebarItemTitle'
});

const props = defineProps<{
  item: SidebarMenuItem;
  level: number;
  titleConfig?: Partial<SidebarTitleConfig>;
  extraStyle?: Record<string, any>;
  collapsed: boolean;
}>();

const ns = useNamespace('sidebar');
const { isRtl } = useDirection();
const rootSlots = inject(sidebarSlotsKey, {});

const resolved = computed(() =>
  mergeSidebarTitleConfig(props.titleConfig, {
    collapsed: props.collapsed,
    rtl: isRtl.value
  })
);

const enabled = computed(() => resolved.value.enabled);
const tooltipProps = computed(() => resolved.value.tooltipProps);
const showExtra = computed(
  () => !!rootSlots.extra || (isString(props.item.extra) && props.item.extra !== '')
);
const mergedExtraStyle = computed(() => ({
  ...props.extraStyle,
  ...props.item.extraStyle
}));

const titleRenderer = () => rootSlots.title?.({ item: props.item, level: props.level });
const extraRenderer = () => rootSlots.extra?.({ item: props.item, level: props.level });
</script>
