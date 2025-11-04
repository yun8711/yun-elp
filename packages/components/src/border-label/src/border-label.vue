<template>
  <div class="y-border-label" :style="{ height: height, width: width }">
    <!-- 前置插槽 -->
    <div v-if="$slots.prefix" class="y-border-label__prefix">
      <slot name="prefix" />
    </div>
    <div class="y-border-label__label" :class="{ 'y-border-label__label--no-border': props.noBorder }">
      <slot name="label">{{ props.label }}</slot>
    </div>
    <div class="y-border-label__content">
      <slot />
    </div>
    <!-- 后置插槽 -->
    <div v-if="$slots.suffix" class="y-border-label__suffix">
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import type { BorderLabelProps } from './border-label';
import { useAppConfig } from '../../app-wrap/src/use-app-config';

defineOptions({
  name: 'YBorderLabel',
  inheritAttrs: true
});

const props = defineProps<BorderLabelProps>();
const labelConfig = useAppConfig('borderLabel');
// 使用计算属性来处理默认值
const height = computed(() => props.height || labelConfig?.height || '32px');
const width = computed(() => props.width || labelConfig?.width || 'auto');
</script>
