<template>
  <div ref="containerRef" class="y-sticky-layout">
    <!-- 左侧区域 -->
    <div
      v-if="$slots.left"
      ref="leftRef"
      class="y-sticky-layout__left"
      :style="{ height: sideHeight + 'px', top: sideTop + 'px' }"
    >
      <slot name="left" :height="sideHeight"></slot>
    </div>

    <!-- 内容区域 -->
    <div class="y-sticky-layout__content" :style="contentStyle">
      <slot> </slot>
    </div>

    <!-- 右侧区域 -->
    <div
      v-if="$slots.right"
      ref="rightRef"
      class="y-sticky-layout__right"
      :style="{ height: sideHeight + 'px', top: sideTop + 'px' }"
    >
      <slot name="right" :height="sideHeight"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from '@vue/runtime-core';
import { useResizeObserver, useScroll } from '@vueuse/core';
import { type StickyLayoutProps } from './sticky-layout';

defineOptions({
  name: 'YStickyLayout',
  inheritAttrs: true
});

const props = defineProps<StickyLayoutProps>();

// DOM 引用
const scrollContainerEl = ref<HTMLElement | Window>();
const containerRef = ref<HTMLElement>();
const leftRef = ref<HTMLElement>();
const rightRef = ref<HTMLElement>();
const extHeight = ref<number>(0); // 初始距离外部容器顶部的距离
const sideHeight = ref<number>(0); // 侧栏高度
const sideTop = ref<number>(0); // 侧栏顶部距离外部容器顶部的距离
const wrapRect = ref<{ left: number; width: number }>({ left: 0, width: 0 }); // 容器位置信息

// 自动计算的宽度
const leftWidth = ref<number>(0); // 自动计算的左侧宽度
const rightWidth = ref<number>(0); // 自动计算的右侧宽度

// 获取滚动容器元素
const initElements = () => {
  if (!props.scrollContainer) {
    scrollContainerEl.value = window;
    return;
  }

  if (typeof props.scrollContainer === 'string') {
    const el = document.querySelector(props.scrollContainer);
    scrollContainerEl.value = (el as HTMLElement) || window;
    return;
  }

  scrollContainerEl.value = props.scrollContainer;
};

// 获取初始距离外部容器顶部的距离
const initExtTop = () => {
  if (containerRef.value && scrollContainerEl.value) {
    const rect = containerRef.value.getBoundingClientRect();
    const scrollContainerRect =
      scrollContainerEl.value instanceof HTMLElement
        ? scrollContainerEl.value.getBoundingClientRect()
        : { top: 0 };
    extHeight.value = rect.top - scrollContainerRect.top;
  }
};

// 监听滚动容器的滚动事件
const { y: scrollTop } = useScroll(scrollContainerEl, { throttle: 16 });

// 内容区域样式
const contentStyle = computed<Record<string, string | number>>(() => {
  const style: Record<string, string | number> = {};
  if (leftWidth.value > 0) {
    style.paddingLeft = `${leftWidth.value}px`;
  }

  if (rightWidth.value > 0) {
    style.paddingRight = `${rightWidth.value}px`;
  }

  style.minHeight = `${sideHeight.value}px`;

  return style;
});

// 更新布局
const updateLayout = () => {
  if (!containerRef.value || !scrollContainerEl.value) return;

  const scrollContainerRect =
    scrollContainerEl.value instanceof HTMLElement
      ? scrollContainerEl.value.getBoundingClientRect()
      : { height: window.innerHeight };
  const containerRect = containerRef.value.getBoundingClientRect();
  wrapRect.value = {
    left: containerRect.left,
    width: containerRect.width
  };

  const containerContentHeight = scrollContainerRect.height;
  sideHeight.value = containerContentHeight - Math.max(extHeight.value - scrollTop.value, 0);
  if (extHeight.value > scrollTop.value) {
    // 组件本身position:relative
    containerRef.value.style.position = 'relative';
    sideTop.value = 0;
  } else {
    // 移除组件本身position:relative，容器组件position:relative
    containerRef.value.style.position = '';
    sideTop.value = scrollTop.value - extHeight.value;
    if (scrollContainerEl.value instanceof HTMLElement) {
      scrollContainerEl.value.style.position = 'relative';
    }
  }
};

// 监听滚动位置变化
watch(
  () => scrollTop.value,
  () => {
    updateLayout();
  }
);

// 使用 ResizeObserver 监听容器尺寸变化
useResizeObserver(containerRef, () => {
  nextTick(() => {
    updateLayout();
  });
});

// 监听左侧插槽内容尺寸变化
useResizeObserver(leftRef, entries => {
  const entry = entries[0];
  if (entry) {
    const { width } = entry.contentRect;
    leftWidth.value = width;
  }
});

// 监听右侧插槽内容尺寸变化
useResizeObserver(rightRef, entries => {
  const entry = entries[0];
  if (entry) {
    const { width } = entry.contentRect;
    rightWidth.value = width;
  }
});

// 组件挂载后初始化
onMounted(() => {
  nextTick(() => {
    // 初始化各个元素
    initElements();
    // 获取初始距离外部容器顶部的距离
    initExtTop();
    // 侧栏宽度通过useResizeObserver获取
    // 更新侧栏高度
    updateLayout();
  });
});
</script>
