<template>
  <el-progress
    v-show="isStarted"
    v-bind="manageAttrs"
    class="y-page-progress"
    :percentage="percentage" />
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, useAttrs, toRefs } from '@vue/runtime-core';
import { ElProgress } from 'element-plus';
import type { PageProgressProps } from './page-progress';

defineOptions({
  name: 'YPageProgress',
  inheritAttrs: true
});

const attrs = useAttrs();

const props = withDefaults(defineProps<PageProgressProps>(), {
  auto: false,
  modelValue: undefined,
  minimum: 8,
  showSpinner: true,
  easing: 'ease',
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  parent: 'body',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { auto, minimum, speed, trickle, trickleSpeed } = toRefs(props);

// 合并、固定el-progress的属性
const manageAttrs = computed(() => {
  return {
    type: 'line',
    strokeWidth: attrs?.strokeWidth || 2,
    textInside: false,
    status: undefined,
    indeterminate: attrs?.indeterminate || false,
    duration: attrs?.duration || 3,
    color: attrs?.color || 'var(--el-color-primary)',
    showText: false,
    format: undefined,
    striped: attrs?.striped || false,
    stripedFlow: attrs?.stripedFlow || false,
  };
});

// 内部状态
// 进度值
const percentage = ref<number>(0);
const isStarted = ref(false);

// 控制模式：如果外部绑定了 modelValue，使用手动模式，否则使用自动模式
const isManualMode = computed(() => props.modelValue !== undefined);
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
  const clampedPercentage = Math.max(minimum.value, Math.min(100, newPercentage));
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

    setTimeout(() => {
      isStarted.value = false;
      percentage.value = 0;
      stopTrickle();
      complete();
    }, speed.value);
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
  const increment = amount !== undefined ? amount : (Math.random() * 10 + 1);
  return set(current + increment);
};


// 自动增量定时器
let trickleTimer: number | null = null;

// 开始自动增量
const startTrickle = () => {
  if (trickle.value && isStarted.value && !trickleTimer) {
    trickleTimer = window.setInterval(() => {
      // 在进度达到 90% 时停止自动增量，让用户手动调用 done() 完成
      if (percentage.value < 96) {
        inc();
      } else {
        stopTrickle();
      }
    }, trickleSpeed.value);
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

// 监听配置变化
watch([minimum, trickle, trickleSpeed], () => {
  if (isStarted.value) {
    stopTrickle();
    startTrickle();
  }
});

// 监听 modelValue 变化（仅在手动模式下）
watch(() => props.modelValue, (newVal: boolean) => {
  if (!isManualMode.value) return; // 如果不是手动模式，忽略

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
      }, speed.value);
    }
  }
});

// 监听percentage变化
watch(() => props.percentage, (newVal: number | undefined) => {
  if (newVal !== undefined) {
    percentage.value = Math.max(minimum.value, Math.min(100, newVal));
  }
});

// 自动模式的事件处理函数
const handlePageLoadStart = () => {
  // 如果是手动模式，不执行自动模式
  if (auto.value && !isManualMode.value) {
    start();
  }
};

const handlePageLoadEnd = () => {
  // 如果是手动模式，不执行自动模式
  if (auto.value && !isManualMode.value) {
    done();
  }
};

onMounted(() => {
  // 自动模式：监听页面加载事件（仅当不是手动模式时）
  if (auto.value && !isManualMode.value) {
    // 如果页面还没有完全加载，开始进度条
    if (document.readyState !== 'complete') {
      handlePageLoadStart();
    }

    // 监听页面unload事件（页面即将离开时）
    window.addEventListener('beforeunload', handlePageLoadStart);

    // 监听页面load事件（页面加载完成时）
    window.addEventListener('load', handlePageLoadEnd);

    // 对于SPA应用，可以在这里添加路由监听逻辑
    // 例如：监听 vue-router 的导航守卫
  }
});

onUnmounted(() => {
  stopTrickle();
  queue.value = [];

  // 移除自动模式的事件监听器
  if (auto.value && !isManualMode.value) {
    window.removeEventListener('beforeunload', handlePageLoadStart);
    window.removeEventListener('load', handlePageLoadEnd);
  }
});

// 暴露方法
defineExpose({});
</script>
