<template>
  <el-tooltip v-bind="tooltipAttrs" :disabled="!showTooltip" class="y-button-tooltip" ref="tooltipRef">
    <el-button class="y-button" v-bind="$attrs" @click="handleClick" ref="buttonRef">
      <slot />
      <slot name="icon" />
      <slot name="loading" />
    </el-button>
    <template #content>
      <slot name="content"></slot>
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { computed, ref, useSlots, defineExpose } from '@vue/runtime-core'
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import type { ButtonProps } from './button'
const $slots = useSlots()
const buttonConfig = useAppConfig('button')

defineOptions({
  name: 'YButton',
  inheritAttrs: false
});

const props = defineProps<ButtonProps>();

const delay = computed(() => {
  if (props.delay !== undefined && props.delay !== null && props.delay !== '') {
    return Number(props.delay)
  }
  if (buttonConfig?.delay !== undefined && buttonConfig?.delay !== null && buttonConfig?.delay !== '') {
    return Number(buttonConfig.delay)
  }
  return 300
})

const maxWait = computed(() => {
  if (props.maxWait !== undefined && props.maxWait !== null && props.maxWait !== '') {
    return Number(props.maxWait)
  }
  if (buttonConfig?.maxWait !== undefined && buttonConfig?.maxWait !== null && buttonConfig?.maxWait !== '') {
    return Number(buttonConfig.maxWait)
  }
  return undefined
})

const placement = computed(() => {
  return props.placement || buttonConfig?.placement || 'top'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = useDebounceFn((event: MouseEvent) => {
  emit('click', event)
}, delay.value, { maxWait: maxWait.value })


const showTooltip = computed(() => {
  return props.content || $slots.content
})

const tooltipAttrs = computed(() => {
  return {
    content: props.content,
    placement: placement.value,
    ...props.tooltipProps
  }
})

const buttonRef = ref(null)
const tooltipRef = ref(null)
defineExpose({
  buttonRef: buttonRef,
  tooltipRef: tooltipRef
})

</script>
