<template>
  <div :class="ns.b()" v-bind="$attrs">
    <div :class="ns.e('left')" :style="leftStyle">
      <div :class="ns.e('bar')" :style="barStyle" />
      <span :style="textStyle">
        <slot>{{ props.title }}</slot>
      </span>
      <div :class="ns.e('left-extra')" :style="extraStyle">
        <slot name="extra" />
      </div>
    </div>
    <div :class="ns.e('right')">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isNil } from 'lodash-es';
import type { PartTitleConfig, PartTitleProps } from './part-title';
import { useNamespace } from '../../../hooks/use-namespace';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { getSizeValue } from '../../../utils/other';

defineOptions({
  name: 'YPartTitle',
  inheritAttrs: true
});

const props = withDefaults(defineProps<PartTitleProps>(), {
  title: '',
  textStyle: () => ({}),
  barStyle: () => ({})
});
const ns = useNamespace('part-title');
const partTitleConfig = useAppConfig('partTitle') as PartTitleConfig | undefined;

function pickDefined<T>(propValue: T | undefined, configValue: T | undefined) {
  if (!isNil(propValue) && propValue !== '') return propValue;
  if (!isNil(configValue) && configValue !== '') return configValue;
  return undefined;
}

const textStyle = computed(() => ({
  ...partTitleConfig?.textStyle,
  ...props.textStyle
}));

const barStyle = computed(() => ({
  ...partTitleConfig?.barStyle,
  ...props.barStyle
}));

const leftStyle = computed(() => {
  const gap = getSizeValue(pickDefined(props.gap, partTitleConfig?.gap));
  return gap ? { paddingInlineStart: gap } : {};
});

const extraStyle = computed(() => {
  const extraGap = getSizeValue(pickDefined(props.extraGap, partTitleConfig?.extraGap));
  return extraGap ? { marginInlineStart: extraGap } : {};
});
</script>
