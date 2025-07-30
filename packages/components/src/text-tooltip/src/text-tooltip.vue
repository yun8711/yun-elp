<template>
  <el-tooltip v-bind="tooltipAttrs" :disabled="!showTooltip" class="y-text-tooltip">
    <div ref="textRef" class="y-text-tooltip__content" :style="textStyle">
      <slot></slot>
    </div>
    <template #content>
      <slot name="content"></slot>
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
import type { TextTooltipProps } from './text-tooltip';
import { computed, ref, onMounted, onUpdated } from '@vue/runtime-core';
import { ElTooltip } from 'element-plus';

defineOptions({
  name: 'YTextTooltip',
  inheritAttrs: false
});

const props = withDefaults(defineProps<TextTooltipProps>(), {
  lineClamp: 1,
  width: '100%',
  placement: 'top',
  tooltip: 'auto',
  tooltipProps: () => ({}),
  textStyle: () => ({})
});



// 合并tooltipProps
const tooltipAttrs = computed(() => {
  return {
    placement: props.placement,
    showAfter: 100,
    effect: 'dark',
    hideAfter: 0,
    content: getSlotContent(),
    ...props.tooltipProps,
  };
});

const lineClamp = computed(() => {
  return typeof props.lineClamp === 'number'
    ? props.lineClamp
    : Number(props.lineClamp);
});

const textStyle = computed(() => {
  return {
    ...props.textStyle,
    width: typeof props.width === 'number'
      ? `${props.width}px`
      : props.width,
    '-webkit-line-clamp': lineClamp.value,
    'white-space': lineClamp.value > 1 ? 'normal' : 'nowrap'
  };
});


const textRef = ref<HTMLElement>();
// 从默认插槽获取内容
const getSlotContent = () => {
  return textRef.value?.textContent || '';
};

const showTooltip = ref(true);

// 判断是否需要显示tooltip，即内容是否超长
const getIsOverflow = () => {
  if (props.tooltip === 'none') {
    showTooltip.value = false;
  } else if (props.tooltip === 'always') {
    showTooltip.value = true;
  } else if (props.tooltip === 'auto') {
    if (lineClamp.value === 1) {
      // 获取可视宽度
      const width = textRef.value?.offsetWidth;
      // 获取内容滚动宽度，即实际宽度
      const scrollWidth = textRef.value?.scrollWidth;
      console.log('width, scrollWidth', width, scrollWidth);
      showTooltip.value = width < scrollWidth;
    } else if (lineClamp.value > 1) {
      const height = textRef.value?.offsetHeight;
      const scrollHeight = textRef.value?.scrollHeight;
      console.log('height, scrollHeight', height, scrollHeight);
      showTooltip.value = height < scrollHeight;
    }
  }
}

onMounted(getIsOverflow);
onUpdated(getIsOverflow);
</script>
