<template>
  <el-button
    ref="buttonRef"
    class="y-button"
    v-bind="attrs"
    @click="handleClick"
    @dblclick="handleDoubleClick">
    <slot />
    <slot name="icon" />
    <slot name="loading" />
  </el-button>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'
import { computed, ref, useAttrs, watch } from 'vue'
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useExternalListener } from '../../../hooks/use-external-listener';
import type { ButtonCustomProps, ButtonEmits } from './button';

defineOptions({
  name: 'YButton',
  inheritAttrs: true
});

// 用于接收el-button的属性
const attrs = useAttrs()
// 用于接收组件自定义的props
const props = defineProps<ButtonCustomProps>()
const buttonConfig = useAppConfig('button')
const emit = defineEmits<ButtonEmits>()
const { hasExternalListener } = useExternalListener()
// 防抖延迟时间
const delay = computed(() => {
  if (props.delay !== undefined && props.delay !== null) {
    return props.delay
  }
  if (buttonConfig?.delay !== undefined && buttonConfig?.delay !== null) {
    return buttonConfig.delay
  }
  // 如果设置了 model，则 delay 默认为 300
  if (props.model !== undefined) {
    return 300
  }
  return undefined // 不设置默认值，让单击事件默认不防抖
})
// 单击最大等待时间
const maxWait = computed(() => {
  if (props.maxWait !== undefined && props.maxWait !== null) {
    return props.maxWait
  }
  if (buttonConfig?.maxWait !== undefined && buttonConfig?.maxWait !== null) {
    return buttonConfig.maxWait
  }
  return undefined
})

// 双击检测时间阈值，最少300ms
const dblDelay = computed(() => {
  const delayValue = delay.value
  let dblDelayValue = 300 // 默认值

  // 获取配置的双击检测时间
  if (props.dblDelay !== undefined && props.dblDelay !== null) {
    dblDelayValue = props.dblDelay
  } else if (buttonConfig?.dblDelay !== undefined && buttonConfig?.dblDelay !== null) {
    dblDelayValue = buttonConfig.dblDelay
  }

  // 确保双击检测时间不小于防抖延迟
  if (dblDelayValue < delayValue) {
    console.warn(`[YButton] dblDelay (${dblDelayValue}ms) should be greater than or equal to delay (${delayValue}ms). Using delay value instead.`)
    return delayValue
  }

  return dblDelayValue
})

// 防抖/节流处理函数
let clickHandlerFn: ((event: MouseEvent) => void) | null = null;

// 监听配置变化，重新创建防抖/节流函数
watch(() => props.model, (newModel: 'debounce' | 'throttle' | undefined) => {
  const clickHandler = (event: MouseEvent) => {
    emit('click', event)
  }
  if (delay.value !== undefined) {
    if (newModel === 'debounce') {
      clickHandlerFn = useDebounceFn(clickHandler, delay.value, { maxWait: maxWait.value })
    } else if (newModel === 'throttle') {
      clickHandlerFn = useThrottleFn(clickHandler, delay.value)
    } else {
      // model 为 undefined，不启用防抖或节流
      clickHandlerFn = null
    }
  } else {
    // 没有设置 delay，不启用防抖或节流
    clickHandlerFn = null
  }
}, { immediate: true })

// 检查是否有双击事件监听器
const hasDblClickListener = computed(() => {
  return hasExternalListener('dblclick')
})


// 单击(click)：mousedown，mouseout，click；
// 双击(dblclick)：mousedown，mouseout，click ， mousedown，mouseout，click，dblclick；
// 区分单击和双击的逻辑
let clickTimer: number | null = null
// 点击次数，用于区分单击和双击。
// 每次click都会+1，超过dblDelay.value后重置为0。超过dblDelay.value后，如果点击次数为1，则认为是单击，否则认为是双击
let clickCount = 0

// 单击事件处理函数
const handleClick = (event: MouseEvent) => {
  // 如果有双击事件监听器，需要双击检测
  if (hasDblClickListener.value) {
    clickCount++

    if (clickTimer) {
      clearTimeout(clickTimer)
      clickTimer = null
    }

    // 设置定时器，延迟执行单击事件
    clickTimer = window.setTimeout(() => {
      // 如果点击次数为1，说明是真正的单击
      if (clickCount === 1) {
        // 根据配置调用相应的处理函数
        if (clickHandlerFn) {
          clickHandlerFn(event)
        } else {
          // 没有防抖或节流，直接触发事件
          emit('click', event)
        }
      }
      clickCount = 0
    }, dblDelay.value)
  } else {
    // 没有双击事件监听器，直接执行单击逻辑
    if (clickHandlerFn) {
      clickHandlerFn(event)
    } else {
      emit('click', event)
    }
  }
}

const handleDoubleClick = (event: MouseEvent) => {
  // 只有在有双击监听器时才需要处理双击逻辑
  if (hasDblClickListener.value) {
    // 清除单击定时器
    if (clickTimer) {
      clearTimeout(clickTimer)
      clickTimer = null
    }

    // 重置点击计数
    clickCount = 0
  }

  // 触发双击事件
  emit('dblclick', event)
}

// 自动暴露el-button的属性和方法
const buttonRef = ref(null)
defineExpose(new Proxy({}, {
  get: (_target, key) => {
    return buttonRef.value?.[key];
  },
  has: (_target, key) => {
    return !!(buttonRef.value && key in buttonRef.value);
  },
  ownKeys: () => {
    return buttonRef.value ? [...Object.keys(buttonRef.value)] : [];
  },
  getOwnPropertyDescriptor: (_target, key) => {
    return buttonRef.value ? Object.getOwnPropertyDescriptor(buttonRef.value, key) : undefined;
  }
}))
</script>
