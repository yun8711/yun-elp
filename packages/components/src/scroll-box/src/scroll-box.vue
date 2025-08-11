<template>
  <div class="y-scroll-box" :style="containerStyle">
    <!-- 左侧按钮 -->
    <div v-if="showPrevButton" class="y-scroll-box__arrow y-scroll-box__arrow--prev"
      :class="{ 'y-scroll-box__arrow--disabled': !canScrollLeft }" :style="arrowStyle" @click="handleClick('prev')"
      @dblclick="handleDoubleClick" @mousedown="handleMouseDown('prev')" @mouseup="handleMouseUp">
      <el-icon>
        <ArrowLeft />
      </el-icon>
    </div>

    <!-- 滚动容器 -->
    <div class="y-scroll-box__container" @wheel="handleWheel">
      <el-scrollbar ref="scrollbarRef" v-bind="scrollbarProps" class="y-scroll-box__scrollbar" @scroll="handleScroll">
        <div ref="contentRef" class="y-scroll-box__content">
          <slot></slot>
        </div>
      </el-scrollbar>
    </div>

    <!-- 右侧按钮 -->
    <div v-if="showNextButton" class="y-scroll-box__arrow y-scroll-box__arrow--next"
      :class="{ 'y-scroll-box__arrow--disabled': !canScrollRight }" :style="arrowStyle" @click="handleClick('next')"
      @dblclick="handleDoubleClick" @mousedown="handleMouseDown('next')" @mouseup="handleMouseUp">
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from '@vue/runtime-core';
import { useThrottleFn, useResizeObserver } from '@vueuse/core';
import { ElScrollbar, ElIcon } from 'element-plus';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { type ScrollBoxProps } from './scroll-box';

defineOptions({
  name: 'YScrollBox',
  inheritAttrs: true
});

const props = withDefaults(defineProps<ScrollBoxProps>(), {
  arrowModel: 'auto',
  arrowStyle: () => ({}),
  scrollbarProps: () => ({}),
  step: 30,
  wheelScroll: false,
  continuous: false,
  continuousTime: 200,
  continuousStep: 20
});

// 定义事件
const emit = defineEmits<{
  scroll: [scrollLeft: number]
}>();

// el-scrollbar 实例
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
// 内容元素
const contentRef = ref<HTMLElement>();

// 容器样式
const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}));

// 是否可以向左滚动
const canScrollLeft = ref(false);
// 是否可以向右滚动
const canScrollRight = ref(false);
// 内容是否超出容器
const isOverflow = ref(false);

// 是否显示前一个按钮
const showPrevButton = computed(() => {
  if (props.arrowModel === 'always') return true;
  if (props.arrowModel === 'auto') {
    // auto 模式下只有当内容超出容器时才显示按钮
    return isOverflow.value;
  }
  return false;
});

// 是否显示后一个按钮
const showNextButton = computed(() => {
  if (props.arrowModel === 'always') return true;
  if (props.arrowModel === 'auto') {
    // auto 模式下只有当内容超出容器时才显示按钮
    return isOverflow.value;
  }
  return false;
});

// 检查滚动状态
const checkScrollStatus = useThrottleFn(() => {
  if (!scrollbarRef.value) return;

  const scrollbar = scrollbarRef.value;
  const wrapRef = scrollbar.wrapRef;

  if (!wrapRef) return;

  const { scrollLeft, scrollWidth, clientWidth } = wrapRef;

  // 检查内容是否超出容器
  isOverflow.value = scrollWidth > clientWidth;

  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1;
}, 16);

// 连续滚动相关状态
const isContinuous = ref(false);
const continuousTimer = ref<NodeJS.Timeout | null>(null);
const continuousAnimationId = ref<number | null>(null);
const continuousDirection = ref<'prev' | 'next' | null>(null);
const continuousBoundaries = ref<{ min: number; max: number } | null>(null);
const lastScrollTime = ref(0);

const handleMouseDown = (direction: 'prev' | 'next') => {
  // 通过记时器标记是否触发连续滚动
  continuousTimer.value = setTimeout(() => {
    isContinuous.value = true;
    continuousDirection.value = direction;
  }, props.continuousTime);
}

const handleMouseUp = () => {
  if (continuousTimer.value) {
    clearTimeout(continuousTimer.value);
    continuousTimer.value = null;
  }
  // 立即停止连续滚动
  isContinuous.value = false;
}

// 开始连续滚动
const startContinuousScroll = (direction: 'prev' | 'next') => {
  if (!scrollbarRef.value || !scrollbarRef.value.wrapRef) return;

  const wrapRef = scrollbarRef.value.wrapRef;
  const { scrollWidth, clientWidth } = wrapRef;

  // 缓存边界值，避免重复计算
  continuousBoundaries.value = {
    min: 0,
    max: scrollWidth - clientWidth
  };

  const stepValue = props.continuousStep || props.step;
  const targetDirection = direction;

  const animate = (currentTime: number) => {
    if (!isContinuous.value || !scrollbarRef.value || !continuousBoundaries.value) {
      return;
    }

    // 控制滚动频率，约60fps
    if (currentTime - lastScrollTime.value < 16) {
      continuousAnimationId.value = requestAnimationFrame(animate);
      return;
    }

    const { scrollLeft } = wrapRef;
    const { min, max } = continuousBoundaries.value;

    const newScrollLeft = targetDirection === 'prev'
      ? scrollLeft - stepValue
      : scrollLeft + stepValue;

    const clampedScrollLeft = Math.max(min, Math.min(newScrollLeft, max));

    // 如果到达边界，停止滚动
    if (clampedScrollLeft === scrollLeft) {
      stopContinuousScroll();
      return;
    }

    // 设置滚动位置
    scrollbarRef.value.setScrollLeft(clampedScrollLeft);

    // 触发滚动事件
    emit('scroll', clampedScrollLeft);

    lastScrollTime.value = currentTime;

    // 继续下一帧动画
    continuousAnimationId.value = requestAnimationFrame(animate);
  };

  continuousAnimationId.value = requestAnimationFrame(animate);
};

// 停止连续滚动
const stopContinuousScroll = () => {
  if (continuousAnimationId.value) {
    cancelAnimationFrame(continuousAnimationId.value);
    continuousAnimationId.value = null;
  }
  continuousBoundaries.value = null;
  continuousDirection.value = null;
};

watch(isContinuous, (newVal: boolean) => {
  if (newVal && continuousDirection.value) {
    startContinuousScroll(continuousDirection.value);
  } else {
    stopContinuousScroll();
  }
});



// 执行滚动操作
const performScroll = (direction: 'prev' | 'next', stepValue: number) => {
  if (!scrollbarRef.value) return;

  const scrollbar = scrollbarRef.value;
  const wrapRef = scrollbar.wrapRef;

  if (!wrapRef) return;

  const { scrollLeft, scrollWidth, clientWidth } = wrapRef;

  const newScrollLeft =
    direction === 'prev' ? scrollLeft - stepValue : scrollLeft + stepValue;

  // 检查是否到达边界
  const maxScrollLeft = scrollWidth - clientWidth;
  const clampedScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));

  // 滚动前，设置scroll-behavior为smooth
  if (wrapRef) {
    wrapRef.style.scrollBehavior = 'smooth';
  }

  // 设置滚动位置
  scrollbar.setScrollLeft(clampedScrollLeft);

  // 触发滚动事件
  emit('scroll', clampedScrollLeft);

  // 滚动后，设置scroll-behavior为auto
  if (wrapRef) {
    wrapRef.style.scrollBehavior = 'auto';
  }
};



// 处理滚动事件（主要用于用户直接操作滚动条时）
const handleScroll = ({ scrollLeft }: { scrollLeft: number }) => {
  // 触发滚动事件（用户直接操作滚动条时）
  emit('scroll', scrollLeft);

  checkScrollStatus();
}

// 处理箭头点击
const handleClick = (direction: 'prev' | 'next') => {
  if (isContinuous.value) return;
  // 检查是否禁用
  if (direction === 'prev' && !canScrollLeft.value) return;
  if (direction === 'next' && !canScrollRight.value) return;

  // 执行单击滚动
  performScroll(direction, props.step);
};

// 处理双击事件，防止选中文本
const handleDoubleClick = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

// 处理鼠标滚轮事件
const handleWheel = (event: WheelEvent) => {
  if (!props.wheelScroll) return;

  event.preventDefault();

  const scrollbar = scrollbarRef.value;
  if (!scrollbar) return;

  const wrapRef = scrollbar.wrapRef;
  if (!wrapRef) return;

  const { scrollLeft, scrollWidth, clientWidth } = wrapRef;
  const deltaX = event.deltaX || event.deltaY;

  let newScrollLeft = scrollLeft + deltaX;
  newScrollLeft = Math.max(0, Math.min(newScrollLeft, scrollWidth - clientWidth));

  scrollbar.setScrollLeft(newScrollLeft);
};



// 使用 useResizeObserver 监听内容尺寸变化
const { stop: stopResizeObserver } = useResizeObserver(contentRef, () => {
  nextTick(() => {
    checkScrollStatus();
  });
});

// 组件挂载后检查滚动状态
onMounted(() => {
  nextTick(() => {
    checkScrollStatus();
  });
});

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

// 组件卸载时清理资源
onUnmounted(() => {
  stopResizeObserver();
  stopContinuousScroll();
  if (continuousTimer.value) {
    clearTimeout(continuousTimer.value);
  }
});

const scrollTo = (scrollLeft: undefined | number | 'start' | 'end') => {
  if (scrollbarRef.value) {
    const wrapRef = scrollbarRef.value.wrapRef;
    if (!wrapRef) return;

    wrapRef.style.scrollBehavior = 'smooth';

    if (scrollLeft === 'start') {
      scrollbarRef.value.setScrollLeft(0);
    } else if (scrollLeft === 'end') {
      scrollbarRef.value.setScrollLeft(scrollbarRef.value.wrapRef.scrollWidth - scrollbarRef.value.wrapRef.clientWidth);
    } else {
      scrollbarRef.value.setScrollLeft(scrollLeft);
    }

    wrapRef.style.scrollBehavior = 'auto';
  }
}

// 暴露方法给父组件
defineExpose({
  scrollbarRef,
  scrollTo,
  scrollToStart: () => {
    scrollTo('start');
  },
  scrollToEnd: () => {
    scrollTo('end');
  }
});
</script>
