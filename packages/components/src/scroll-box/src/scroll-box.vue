<template>
  <div class="y-scroll-box" :class="[`y-scroll-box--${direction}`]" :style="containerStyle">
    <!-- 左侧/上方按钮 -->
    <div
      v-if="showPrevButton"
      class="y-scroll-box__arrow y-scroll-box__arrow--prev"
      :class="[`y-scroll-box__arrow--${direction}`]"
      :style="arrowStyle"
      @mousedown="handleArrowDown('prev')"
      @mouseup="handleArrowUp"
      @mouseleave="handleMouseLeave"
      @touchstart="handleArrowDown('prev')"
      @touchend="handleArrowUp"
    >
      <el-icon>
        <ArrowLeft v-if="direction === 'horizontal'" />
        <ArrowUp v-else />
      </el-icon>
    </div>

    <!-- 滚动容器 -->
    <div class="y-scroll-box__container">
      <el-scrollbar
        ref="scrollbarRef"
        v-bind="scrollbarProps"
        :class="[`y-scroll-box__scrollbar--${direction}`]"
        @scroll="handleScroll"
        @wheel="handleWheel"
      >
        <div
          ref="contentRef"
          class="y-scroll-box__content"
          :class="[`y-scroll-box__content--${direction}`]"
        >
          <slot></slot>
        </div>
      </el-scrollbar>
    </div>

    <!-- 右侧/下方按钮 -->
    <div
      v-if="showNextButton"
      class="y-scroll-box__arrow y-scroll-box__arrow--next"
      :class="[`y-scroll-box__arrow--${direction}`]"
      :style="arrowStyle"
      @mousedown="handleArrowDown('next')"
      @mouseup="handleArrowUp"
      @mouseleave="handleMouseLeave"
      @touchstart="handleArrowDown('next')"
      @touchend="handleArrowUp"
    >
      <el-icon>
        <ArrowRight v-if="direction === 'horizontal'" />
        <ArrowDown v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from '@vue/runtime-core';
import { ElScrollbar, ElIcon } from 'element-plus';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import { type ScrollBoxProps } from './scroll-box';

defineOptions({
  name: 'YScrollBox',
  inheritAttrs: true
});

const props = withDefaults(defineProps<ScrollBoxProps>(), {
  arrowModel: 'auto',
  arrowStyle: () => ({}),
  direction: 'horizontal',
  scrollbarProps: () => ({}),
  step: 30,
  continuous: false,
  wheelScroll: false
});

// el-scrollbar 实例
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
// 内容元素
const contentRef = ref<HTMLElement>();
// 滚动定时器
const scrollTimer = ref<number>();
// 是否正在滚动
const isScrolling = ref(false);
// 滚动方向
const scrollDirection = ref<'prev' | 'next' | null>(null);
// 内容尺寸变化观察器
const resizeObserver = ref<ResizeObserver>();

// 容器样式
const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}));

// 箭头样式
const arrowStyle = computed(() => props.arrowStyle);

// 是否显示前一个按钮
const showPrevButton = computed(() => {
  if (props.arrowModel === 'always') return true;
  if (props.arrowModel === 'auto') {
    // 垂直滚动时，auto模式下不显示箭头，因为可以通过鼠标滚轮操作
    if (props.direction === 'vertical') return false;
    return canScrollLeft.value;
  }
  return false;
});

// 是否显示后一个按钮
const showNextButton = computed(() => {
  if (props.arrowModel === 'always') return true;
  if (props.arrowModel === 'auto') {
    // 垂直滚动时，auto模式下不显示箭头，因为可以通过鼠标滚轮操作
    if (props.direction === 'vertical') return false;
    return canScrollRight.value;
  }
  return false;
});

// 是否可以向左滚动
const canScrollLeft = ref(false);
// 是否可以向右滚动
const canScrollRight = ref(false);
// 是否可以向上滚动
const canScrollUp = ref(false);
// 是否可以向下滚动
const canScrollDown = ref(false);

// 检查滚动状态
const checkScrollStatus = () => {
  if (!scrollbarRef.value) return;

  const scrollbar = scrollbarRef.value;
  // 获取scrollbar的wrap元素
  const wrapElement = scrollbar.$el?.querySelector('.el-scrollbar__wrap');

  if (!wrapElement) return;

  const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } =
    wrapElement;

  if (props.direction === 'horizontal') {
    canScrollLeft.value = scrollLeft > 0;
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1;

    // 调试日志
    console.log('ScrollBox Debug:', {
      direction: props.direction,
      arrowModel: props.arrowModel,
      scrollLeft,
      scrollWidth,
      clientWidth,
      canScrollLeft: canScrollLeft.value,
      canScrollRight: canScrollRight.value,
      showPrevButton: showPrevButton.value,
      showNextButton: showNextButton.value
    });
  } else {
    canScrollUp.value = scrollTop > 0;
    canScrollDown.value = scrollTop < scrollHeight - clientHeight - 1;
  }
};

// 处理滚动事件
const handleScroll = () => {
  // 如果正在连续滚动，延迟检查状态，避免频繁更新
  if (isScrolling.value) {
    return;
  }
  checkScrollStatus();
};

// 处理箭头按下
const handleArrowDown = (direction: 'prev' | 'next') => {
  // 如果正在连续滚动，延迟检查状态，避免频繁更新
  if (isScrolling.value) {
    return;
  }
  // 设置滚动方向
  scrollDirection.value = direction;
  isScrolling.value = true;

  // 滚动方法
  const scroll = () => {
    if (!scrollbarRef.value || !isScrolling.value) return;

    const scrollbar = scrollbarRef.value;
    const wrapElement = scrollbar.$el?.querySelector('.el-scrollbar__wrap');

    if (!wrapElement) return;

    const { scrollLeft, scrollTop } = wrapElement;

    if (props.direction === 'horizontal') {
      const newScrollLeft =
        direction === 'prev' ? scrollLeft - props.step : scrollLeft + props.step;
      wrapElement.scrollLeft = newScrollLeft;
    } else {
      const newScrollTop = direction === 'prev' ? scrollTop - props.step : scrollTop + props.step;
      wrapElement.scrollTop = newScrollTop;
    }

    // 连续滚动：如果启用连续滚动且仍在滚动状态，则继续
    if (props.continuous && isScrolling.value) {
      console.log('Continuous scrolling:', {
        direction,
        step: props.step,
        isScrolling: isScrolling.value,
        continuous: props.continuous
      });
      // 使用 setTimeout 进行连续滚动
      scrollTimer.value = window.setTimeout(scroll, 50);
    }
  };

  // 立即执行一次滚动
  scroll();
};

// 处理箭头松开
const handleArrowUp = () => {
  isScrolling.value = false;
  scrollDirection.value = null;
  if (scrollTimer.value) {
    // 清理 setTimeout
    clearTimeout(scrollTimer.value);
    scrollTimer.value = undefined;
  }
  // 滚动结束后立即检查状态
  nextTick(() => {
    checkScrollStatus();
  });
};

// 处理鼠标离开
const handleMouseLeave = () => {
  handleArrowUp();
};

// 处理鼠标滚轮事件
const handleWheel = (event: WheelEvent) => {
  // 只在水平滚动模式且启用滚轮滚动时处理
  if (props.direction !== 'horizontal' || !props.wheelScroll) return;

  // 阻止默认的垂直滚动行为
  event.preventDefault();

  const scrollbar = scrollbarRef.value;
  if (!scrollbar) return;

  const wrapElement = scrollbar.$el?.querySelector('.el-scrollbar__wrap');
  if (!wrapElement) return;

  const { scrollLeft } = wrapElement;
  const deltaX = event.deltaX || event.deltaY; // 兼容不同浏览器

  // 根据滚轮方向调整滚动
  const newScrollLeft = scrollLeft + deltaX;
  wrapElement.scrollLeft = newScrollLeft;
};

// 组件挂载后检查滚动状态
onMounted(() => {
  nextTick(() => {
    checkScrollStatus();

    // 创建 ResizeObserver 监听内容尺寸变化
    if (contentRef.value) {
      resizeObserver.value = new ResizeObserver(() => {
        nextTick(() => {
          checkScrollStatus();
        });
      });
      resizeObserver.value.observe(contentRef.value);
    }
  });
});

// 监听内容变化，重新检查滚动状态
watch(
  () => props.direction,
  () => {
    nextTick(() => {
      checkScrollStatus();
    });
  }
);

// 监听内容变化
watch(
  () => contentRef.value,
  () => {
    nextTick(() => {
      checkScrollStatus();
    });
  },
  { deep: true }
);

// 组件卸载时清理定时器
onUnmounted(() => {
  if (scrollTimer.value) {
    // 清理 setTimeout
    clearTimeout(scrollTimer.value);
  }
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

// 暴露方法给父组件
defineExpose({
  checkScrollStatus,
  scrollbarRef,
  contentRef
});
</script>
