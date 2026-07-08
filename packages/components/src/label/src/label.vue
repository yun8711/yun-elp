<template>
  <div :class="ns.b()" :style="{ '--label-height': height }">
    <!-- 前置插槽 -->
    <div v-if="$slots.prefix" :class="ns.e('prefix')">
      <slot name="prefix" />
    </div>
    <!-- 标签 -->
    <div :class="ns.e('label')" :style="labelStyle">
      <!-- 标签文本插槽 -->
      <slot name="label">
        <span v-if="props.label">{{ props.label }}</span>
      </slot>
      <!-- 分隔符 -->
      <span v-if="props.colon" :class="ns.e('colon')">
        {{ props.colon }}
      </span>
    </div>
    <!-- 内容 -->
    <div :class="ns.e('content')" :style="contentStyle">
      <slot />
    </div>
    <!-- 后置插槽 -->
    <div v-if="$slots.suffix" :class="ns.e('suffix')">
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LabelProps } from './label';
import { computed } from 'vue';
import { isNumber } from 'lodash-es';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YLabel',
  inheritAttrs: false
});

// 定义组件属性
const props = defineProps<LabelProps>();
const ns = useNamespace('label');

const height = computed(() => {
  if (props.height) {
    return isNumber(props.height) ? `${props.height}px` : props.height;
  }
  return 'auto';
})


const alignMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}
const labelStyle = computed(() => {
  return {
    width: props.labelWidth,
    height: height.value,
    justifyContent: alignMap[props.labelAlign as keyof typeof alignMap] || 'flex-start',
    ...props.labelStyle
  }
})

const contentStyle = computed(() => {
  return {
    height: height.value,
    ...props.contentStyle
  }
})
</script>
