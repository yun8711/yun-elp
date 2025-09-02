<template>
  <el-button class="y-button" @click="handleClick" ref="buttonRef">
    <slot />
    <slot name="icon" />
    <slot name="loading" />
  </el-button>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { computed, ref, defineExpose } from '@vue/runtime-core'
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import type { ButtonProps } from './button';

defineOptions({
  name: 'YButton',
  inheritAttrs: true
});

const props = defineProps<ButtonProps>()
const buttonConfig = useAppConfig('button')

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

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

const handleClick = useDebounceFn((event: MouseEvent) => {
  emit('click', event)
}, delay.value, { maxWait: maxWait.value, rejectOnCancel: true })

const buttonRef = ref(null)
defineExpose({
  buttonRef: buttonRef,
})
</script>
