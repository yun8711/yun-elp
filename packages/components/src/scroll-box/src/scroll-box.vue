<template>
  <div class="y-scroll-box" :style="containerStyle">
    <!-- 左侧按钮 -->
    <div v-if="showPrevButton" class="y-scroll-box__arrow y-scroll-box__arrow--prev"
      :class="{ 'y-scroll-box__arrow--disabled': !canScrollLeft }" :style="arrowStyle"
      @click="handleClick('prev')"
      @mousedown="handleArrowDown('prev')" @mouseup="handleArrowUp" @dblclick="handleDoubleClick">
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
      :class="{ 'y-scroll-box__arrow--disabled': !canScrollRight }" :style="arrowStyle"
      @click="handleClick('next')"
      @mousedown="handleArrowDown('next')" @mouseup="handleArrowUp" @dblclick="handleDoubleClick">
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from '@vue/runtime-core';
import { useThrottleFn } from '@vueuse/core';
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
  continuousStep: undefined,
  continuousTime: 300,
  continuous: false,
  wheelScroll: false,
});

const continuousStepValue = computed(() => {
  return props.continuousStep !== undefined ? props.continuousStep : props.step;
});

// 定义事件
const emit = defineEmits<{
  scroll: [scrollLeft: number]
}>();

// el-scrollbar 实例
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
// 内容元素
const contentRef = ref<HTMLElement>();
// 滚动定时器
const scrollTimer = ref<number>();
// 连续滚动触发定时器
const continuousTriggerTimer = ref<number>();
// 是否正在滚动
const isScrolling = ref(false);
// 是否处于连续滚动状态
const isContinuousScrolling = ref(false);
// 是否正在进行连续滚动操作
const isContinuousOperation = ref(false);
// 按下时间戳
const pressStartTime = ref<number>(0);
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

// 处理单击事件
const handleClick = (direction: 'prev' | 'next') => {
  // 如果正在进行连续滚动操作，忽略单击
  if (isContinuousOperation.value) {
    return;
  }

  // 检查是否禁用
  if (direction === 'prev' && !canScrollLeft.value) return;
  if (direction === 'next' && !canScrollRight.value) return;

  // 执行单击滚动
  performScroll(direction, props.step);
};

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

  // 如果已经到达边界，停止滚动
  if (clampedScrollLeft === scrollLeft) {
    return;
  }

  // 设置滚动位置
  scrollbar.setScrollLeft(clampedScrollLeft);

  // 触发滚动事件
  emit('scroll', clampedScrollLeft);
};

// 处理滚动事件（主要用于用户直接操作滚动条时）
const handleScroll = ({ scrollLeft }: { scrollLeft: number }) => {
  // 如果正在程序化滚动（通过按钮或API调用），不触发事件，避免重复
  if (isScrolling.value) {
    return;
  }

  // 只有用户直接操作滚动条时才触发事件
  emit('scroll', scrollLeft);

  checkScrollStatus();
}

// 处理箭头按下
const handleArrowDown = (direction: 'prev' | 'next') => {
  // 检查是否禁用
  if (direction === 'prev' && !canScrollLeft.value) return;
  if (direction === 'next' && !canScrollRight.value) return;

  // 如果正在连续滚动，延迟检查状态，避免频繁更新
  if (isScrolling.value) {
    return;
  }

  // 再次检查边界状态，确保不会在边界时触发滚动
  if (!scrollbarRef.value) return;
  const wrapRef = scrollbarRef.value.wrapRef;
  if (!wrapRef) return;

  const { scrollLeft, scrollWidth, clientWidth } = wrapRef;
  const maxScrollLeft = scrollWidth - clientWidth;

  if (direction === 'prev' && scrollLeft <= 0) return;
  if (direction === 'next' && scrollLeft >= maxScrollLeft) return;

  // 记录按下时间
  pressStartTime.value = Date.now();

  // 设置滚动方向
  scrollDirection.value = direction;
  isScrolling.value = true;
  isContinuousScrolling.value = false;
  // 不在这里设置 isContinuousOperation，等松开时根据时间判断

  // 滚动方法
  const scroll = () => {
    if (!scrollbarRef.value || !isScrolling.value) return;

    let stepValue: number;
    if (isContinuousScrolling.value) {
      // 连续滚动：continuousStep 表示每秒移动的距离
      // 由于定时器间隔是 50ms，所以每次移动的距离是 continuousStep / 20
      stepValue = continuousStepValue.value / 20;
    } else {
      // 单击滚动：每次移动 step 指定的距离
      stepValue = props.step;
    }

    // 执行滚动操作
    performScroll(direction, stepValue);

    // 连续滚动：如果启用连续滚动且仍在滚动状态，则继续
    if (props.continuous && isScrolling.value && isContinuousScrolling.value) {
      // 使用 setTimeout 进行连续滚动，间隔 50ms
      scrollTimer.value = window.setTimeout(scroll, 50);
    }
  };

  // 立即执行一次滚动
  scroll();

  // 如果启用了连续滚动，设置连续滚动触发定时器
  if (props.continuous) {
    continuousTriggerTimer.value = window.setTimeout(() => {
      // 只有在仍然处于滚动状态时才启动连续滚动
      if (isScrolling.value) {
        isContinuousScrolling.value = true;
        // 触发连续滚动
        scroll();
      }
    }, props.continuousTime);
  }
};

// 处理箭头松开
const handleArrowUp = () => {
  // 计算按下持续时间
  const pressDuration = Date.now() - pressStartTime.value;

  // 如果按下时间超过 continuousTime，则认为是连续滚动操作
  if (pressDuration >= props.continuousTime) {
    isContinuousOperation.value = true;
  } else {
    // 如果按下时间小于 continuousTime，则认为是单击操作
    isContinuousOperation.value = false;
  }

  // 立即停止滚动状态
  isScrolling.value = false;
  isContinuousScrolling.value = false;
  scrollDirection.value = null;

  // 立即清理连续滚动触发定时器
  if (continuousTriggerTimer.value) {
    clearTimeout(continuousTriggerTimer.value);
    continuousTriggerTimer.value = undefined;
  }

  // 立即清理连续滚动定时器
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value);
    scrollTimer.value = undefined;
  }

  // 滚动结束后立即检查状态
  nextTick(() => {
    checkScrollStatus();
  });
};

// 处理鼠标离开
// const handleMouseLeave = () => {
//   handleArrowUp();
// };

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
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value);
  }
  if (continuousTriggerTimer.value) {
    clearTimeout(continuousTriggerTimer.value);
  }
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

// 暴露方法给父组件
defineExpose({
  scrollbarRef,
  // contentRef,
  scrollTo: (scrollLeft: number) => {
    if (scrollbarRef.value) {
      scrollbarRef.value.setScrollLeft(scrollLeft);
    }
  },
  scrollToStart: () => {
    if (scrollbarRef.value) {
      scrollbarRef.value.setScrollLeft(0);
    }
  },
  scrollToEnd: () => {
    if (scrollbarRef.value && scrollbarRef.value.wrapRef) {
      const { scrollWidth, clientWidth } = scrollbarRef.value.wrapRef;
      scrollbarRef.value.setScrollLeft(scrollWidth - clientWidth);
    }
  }
});
</script>
