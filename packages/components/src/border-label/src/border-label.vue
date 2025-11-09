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

// 使用计算属性来处理默认值，优先级：用户传入值 > 全局配置 > 组件默认值
const height = computed(() => {
  if (props.height !== undefined) return props.height;  // 用户传入的值（最高优先级）
  if (labelConfig?.height) return labelConfig.height;   // 全局配置（中等优先级）
  return '32px';                                       // 组件默认值（最低优先级）
});

const width = computed(() => {
  if (props.width !== undefined) return props.width;    // 用户传入的值（最高优先级）
  if (labelConfig?.width) return labelConfig.width;     // 全局配置（中等优先级）
  return 'auto';                                        // 组件默认值（最低优先级）
});
</script>
