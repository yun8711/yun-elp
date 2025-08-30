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
import { computed, ref, onMounted, onUpdated, onUnmounted, useTemplateRef, watch } from '@vue/runtime-core';
import { ElTooltip } from 'element-plus';
import { useAppConfig } from '../../app-wrap/src/use-app-config';

defineOptions({
  name: 'YTextTooltip',
  inheritAttrs: false
});

const textTooltipConfig = useAppConfig('textTooltip');
const props = withDefaults(defineProps<TextTooltipProps>(), {
  lineClamp: 1,
  width: '100%',
  model: 'auto',
  tooltipProps: () => ({}),
  textStyle: () => ({})
});

// 合并tooltipProps
const tooltipAttrs = computed(() => {
  const configAttrs = textTooltipConfig?.tooltipProps || {};
  const propAttrs = props?.tooltipProps || {};
  return {
    placement: 'top',
    showAfter: 50,
    hideAfter: 50,
    enterable: false,
    content: getSlotContent(),
    ...configAttrs,
    ...propAttrs,
  };
});

const lineClamp = computed(() => {
  return typeof props.lineClamp === 'number'
    ? props.lineClamp
    : Number(props.lineClamp);
});

const textStyle = computed(() => {
  return {
    width: typeof props.width === 'number'
      ? `${props.width}px`
      : props.width,
    '-webkit-line-clamp': lineClamp.value,
    'white-space': lineClamp.value > 1 ? 'normal' : 'nowrap',
    ...props.textStyle,
  };
});


const textRef = useTemplateRef<HTMLElement>('textRef');
// 从默认插槽获取内容
const getSlotContent = () => {
  return textRef.value?.textContent || '';
};

const showTooltip = ref(true);

// 创建ResizeObserver监听容器大小变化
let resizeObserver: ResizeObserver | null = null;

// 判断是否需要显示tooltip，即内容是否超长
const getIsOverflow = () => {
  if (props.model === 'none') {
    showTooltip.value = false;
  } else if (props.model === 'always') {
    showTooltip.value = true;
  } else if (props.model === 'auto') {
    if (lineClamp.value === 1) {
      // 获取可视宽度
      const width = textRef.value?.offsetWidth;
      // 获取内容滚动宽度，即实际宽度
      const scrollWidth = textRef.value?.scrollWidth;
      showTooltip.value = width < scrollWidth;
    } else if (lineClamp.value > 1) {
      const height = textRef.value?.offsetHeight;
      const scrollHeight = textRef.value?.scrollHeight;
      showTooltip.value = height < scrollHeight;
    }
  }
}

onMounted(() => {
  getIsOverflow();

  // 创建ResizeObserver监听容器宽度变化
  if (props.model === 'auto' && textRef.value) {
    resizeObserver = new ResizeObserver(() => {
      getIsOverflow();
    });
    resizeObserver.observe(textRef.value);
  }
});

onUpdated(getIsOverflow);

// 监听相关属性变化，重新计算是否显示tooltip
watch([() => props.model, () => props.lineClamp, () => props.width], () => {
  // 先清理之前的ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  getIsOverflow();

  // 如果model为auto且有DOM元素，重新创建ResizeObserver
  if (props.model === 'auto' && textRef.value) {
    resizeObserver = new ResizeObserver(() => {
      getIsOverflow();
    });
    resizeObserver.observe(textRef.value);
  }
}, { immediate: false });

// 组件卸载时清理ResizeObserver
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>
