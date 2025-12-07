<template>
  <el-tooltip
    ref="tooltipRef"
    v-bind="tooltipAttrs"
    :disabled="!showTooltip"
    class="y-text-tooltip">
    <div ref="textRef" class="y-text-tooltip__content" :style="computedTextStyle">
      <slot />
    </div>
    <template #content>
      <slot name="content" />
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
import type { TextTooltipProps } from './text-tooltip';
import {
  computed,
  ref,
  onMounted,
  onUpdated,
  onUnmounted,
  useTemplateRef,
  watch,
  toRefs,
  nextTick
} from 'vue';
import { ElTooltip } from 'element-plus';
import { useAppConfig } from '../../app-wrap/src/use-app-config';

defineOptions({
  name: 'YTextTooltip',
  inheritAttrs: true
});

const textTooltipConfig = useAppConfig('textTooltip');
const props = withDefaults(defineProps<TextTooltipProps>(), {
  lineClamp: 1,
  width: '100%',
  model: 'auto',
  textStyle: () => ({})
});

const { lineClamp, width, model, textStyle, ...otherProps } = toRefs(props);

// 合并tooltipProps
const tooltipAttrs = computed(() => {
  const configAttrs = textTooltipConfig?.tooltipProps || {};
  const propAttrs = otherProps.value || {};
  return {
    placement: 'top',
    showAfter: 50,
    hideAfter: 50,
    enterable: false,
    popperClass: 'y-text-tooltip__popper',
    teleported: false,
    persistent:false,
    content: getSlotContent(),
    ...configAttrs,
    ...propAttrs
  };
});

const computedTextStyle = computed(() => {
  return {
    width: typeof width.value === 'number' ? `${width.value}px` : width.value,
    '-webkit-line-clamp': lineClamp.value,
    'white-space': lineClamp.value > 1 ? 'normal' : 'nowrap',
    ...textStyle.value
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
  if (model.value === 'none') {
    showTooltip.value = false;
  } else if (model.value === 'always') {
    showTooltip.value = true;
  } else if (model.value === 'auto') {
    if (lineClamp.value === 1) {
      // 获取可视宽度
      const width = textRef.value?.offsetWidth;
      // 获取内容滚动宽度，即实际宽度
      const scrollWidth = textRef.value?.scrollWidth;
      showTooltip.value = (width ?? 0) < (scrollWidth ?? 0);
    } else if (lineClamp.value > 1) {
      const height = textRef.value?.offsetHeight;
      const scrollHeight = textRef.value?.scrollHeight;
      showTooltip.value = (height ?? 0) < (scrollHeight ?? 0);
    }
  }
};

onMounted(() => {
  nextTick(() => {
    getIsOverflow();

    // 创建ResizeObserver监听容器大小变化
    if (model.value === 'auto' && textRef.value) {
      resizeObserver = new ResizeObserver(() => {
        getIsOverflow();
      });
      resizeObserver.observe(textRef.value);
    }
  });
});

onUpdated(getIsOverflow);

// 监听相关属性变化，重新计算是否显示tooltip
watch(
  [() => model.value, () => lineClamp.value, () => width.value],
  () => {
    // 先清理之前的ResizeObserver
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    getIsOverflow();

    // 如果model为auto且有DOM元素，重新创建ResizeObserver
    if (model.value === 'auto' && textRef.value) {
      resizeObserver = new ResizeObserver(() => {
        getIsOverflow();
      });
      resizeObserver.observe(textRef.value);
    }
  },
  { immediate: false }
);

// 组件卸载时清理ResizeObserver
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

const tooltipRef = useTemplateRef<HTMLElement>('tooltipRef');
defineExpose(new Proxy({}, {
  get: (_target, key) => {
    return tooltipRef.value?.[key];
  },
  has: (_target, key) => {
    return !!(tooltipRef.value && key in tooltipRef.value);
  },
  ownKeys: () => {
    return tooltipRef.value ? [...Object.keys(tooltipRef.value)] : [];
  },
  getOwnPropertyDescriptor: (_target, key) => {
    return tooltipRef.value ? Object.getOwnPropertyDescriptor(tooltipRef.value, key) : undefined;
  }
}));
</script>
