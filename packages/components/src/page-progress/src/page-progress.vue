<template>
  <el-progress
    v-show="isStarted"
    v-bind="manageAttrs"
    :class="['y-page-progress', { 'y-page-progress__spinner': spinner && isStarted }]"
    :percentage="percentage" />
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted, useAttrs, toRefs } from '@vue/runtime-core';
import { ElProgress } from 'element-plus';
import type { PageProgressProps,PageProgressEmits } from './page-progress';

defineOptions({
  name: 'YPageProgress',
  inheritAttrs: true
});

const attrs = useAttrs();

const props = withDefaults(defineProps<PageProgressProps>(), {
  auto: false,
  modelValue: false,
  step: 8,
  spinner: false,
  delay: 200,
  speed: 200,
});

const emit = defineEmits<PageProgressEmits>();

const { step, delay, speed } = toRefs(props);


// 合并、固定el-progress的属性
const manageAttrs = computed(() => {
  return {
    type: 'line',
    strokeWidth: attrs?.strokeWidth || 2,
    textInside: false,
    status: undefined,
    indeterminate: attrs?.indeterminate || false,
    duration: duration.value,
    color: attrs?.color || 'var(--el-color-primary)',
    showText: false,
    format: undefined,
    striped: attrs?.striped || false,
    stripedFlow: attrs?.stripedFlow || false,
  };
});

// 动画持续时间
const duration = ref(3);

// 内部状态
// 进度值
const percentage = ref<number>(0);
const isStarted = ref(false);
// 队列管理
const queue = ref<(() => void)[]>([]);
const isAnimating = ref(false);

// 执行队列中的下一个任务
const next = () => {
  if (queue.value.length > 0 && !isAnimating.value) {
    const fn = queue.value.shift();
    if (fn) {
      isAnimating.value = true;
      fn();
    }
  }
};

// 完成动画
const complete = () => {
  isAnimating.value = false;
  next();
};

// 设置进度值
const set = (newPercentage: number) => {
  // 如果newPercentage小于step，则设置为step，否则设置为newPercentage，最后设置为100
  const clampedPercentage = Math.max(step.value, Math.min(100, newPercentage));
  percentage.value = clampedPercentage;
  return { start, done, set };
};

// 开始进度条
const start = () => {
  if (!isStarted.value) {
    isStarted.value = true;
    percentage.value = 0;
    startTrickle();
  }
  return { start, done, set };
};

// 完成进度条
const done = (force?: boolean) => {
  if (!force && !isStarted.value) return { start, done, set };

  const completeFn = () => {
    // 先设置为 100%，让用户看到完成状态
    percentage.value = 100;

    // 等待大部分时间让用户看到完成状态，然后快速隐藏
    setTimeout(() => {
      // 设置较快的动画时间用于快速隐藏
      duration.value = delay.value * 0.3; // 使用 delay 的 30% 作为隐藏动画时间

      isStarted.value = false;
      percentage.value = 0;
      stopTrickle();

      // 延迟后恢复默认动画时间
      setTimeout(() => {
        duration.value = 3;
        complete();
      }, duration.value);
    }, delay.value * 0.7); // 等待 70% 的时间显示完成状态
  };

  if (isAnimating.value) {
    queue.value.push(completeFn);
  } else {
    completeFn();
  }

  return { start, done, set };
};

// 增量进度
const inc = (amount?: number) => {
  const current = percentage.value;

  // 如果提供了amount参数，直接使用
  if (amount !== undefined) {
    set(current + amount);
    return;
  }

  // 智能增量算法：根据当前进度决定增量大小
  let increment: number;
  if (current >= 0 && current < 20) {
    increment = 10;  // 0-20%: +10%
  } else if (current >= 20 && current < 50) {
    increment = 4;   // 20-50%: +4%
  } else if (current >= 50 && current < 80) {
    increment = 2;   // 50-80%: +2%
  } else if (current >= 80 && current < 99) {
    increment = 0.5; // 80-99%: +0.5%
  } else {
    increment = 0;   // 99%+: 停止增量
  }

  // 确保不超过96%（超过96%会停止自动增量）
  const newPercentage = Math.min(current + increment, 99);
  set(newPercentage);
};


// 自动增量定时器
let trickleTimer: number | null = null;

// 开始自动增量
const startTrickle = () => {
  if ( isStarted.value && !trickleTimer) {
    // 每 speed.value 毫秒执行一次stopTrickle
    trickleTimer = window.setInterval(() => {
      // 在进度未达到 99% 时自动增量，超过96%时必须手动调用 done() 才能完成进度条
      if (percentage.value < 99) {
        // 自动增加进度
        inc();
      } else {
        stopTrickle();
      }
    }, speed.value);
  }
};

// 停止自动增量
const stopTrickle = () => {
  if (trickleTimer) {
    clearInterval(trickleTimer);
    trickleTimer = null;
  }
};

// 监听开始状态变化
watch(isStarted, (newVal: boolean) => {
  if (newVal) {
    startTrickle();
  } else {
    stopTrickle();
  }
});

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal: boolean) => {
  // 如果newVal为true，则开始进度条，否则结束进度条
  if (newVal) {
    // 开始进度条
    isStarted.value = true;
    percentage.value = 0;
    startTrickle();
  } else {
    // 结束进度条 - 总是显示100%后再消失
    if (isStarted.value) {
      // 先停止 trickle
      stopTrickle();

      // 设置为100%并延迟消失
      percentage.value = 100;

      setTimeout(() => {
        isStarted.value = false;
        percentage.value = 0;
        emit('update:modelValue', false);
      }, delay.value);
    }
  }
});

onUnmounted(() => {
  stopTrickle();
  queue.value = [];
});
</script>
