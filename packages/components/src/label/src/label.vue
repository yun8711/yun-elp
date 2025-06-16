<template>
  <div class="y-label" :class="{ 'y-label--border': props.border }" :style="{ height: props.height }">
    <!-- 前置插槽 -->
    <div class="y-label__prefix" v-if="$slots.prefix">
      <slot name="prefix"></slot>
    </div>
    <!-- 标签 -->
    <div class="y-label__label" :style="labelStyle">
      <!-- 标签文本插槽 -->
      <slot name="label">
        <span v-if="props.label">{{ props.label }}</span>
      </slot>
      <!-- 分隔符 -->
      <span v-if="props.colon" class="y-label__colon">{{ props.colon }}</span>
    </div>
    <!-- 内容 -->
    <div class="y-label__content" :style="props.contentStyle">
      <slot></slot>
    </div>
    <!-- 后置插槽 -->
    <div class="y-label__suffix" v-if="$slots.suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LabelProps } from './label';
import { computed } from '@vue/runtime-core';

defineOptions({
  name: 'YLabel',
  inheritAttrs: false
});

// 定义组件属性
const props = defineProps<LabelProps>();


const alignMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}
const labelStyle = computed(() => {
  return {
    width: props.labelWidth,
    justifyContent: alignMap[props.labelAlign as keyof typeof alignMap],
    ...props.labelStyle
  }
})
</script>
