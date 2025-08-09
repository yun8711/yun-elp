<template>
  <el-tooltip v-bind="tooltipAttrs" class="y-button-tooltip" ref="tooltipRef">
    <el-button class="y-button" v-bind="buttonAttrs" @click="handleClick" ref="buttonRef">
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
import { computed, ref, useSlots, useAttrs, defineExpose } from '@vue/runtime-core'
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { ButtonProps as ElButtonProps } from 'element-plus';
import type { ButtonProps } from './button'
import { pick } from 'lodash-es'
const $slots = useSlots()
const buttonConfig = useAppConfig('button')
const attrs = useAttrs()
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
  return props.content || $slots.content || props?.tooltipProps?.content;
})

const tooltipAttrs = computed(() => {
  const configAttrs = buttonConfig?.tooltipProps || {};
  const propAttrs = props?.tooltipProps || {};
  return {
    ...configAttrs,
    content: props.content,
    placement: placement.value,
    disabled: !showTooltip.value,
    ...propAttrs,
  }
})

// 以常量数组列举 ElButton 支持的属性键，受 TS 类型校验
const EL_BUTTON_PROP_KEYS = [
  'type',
  'size',
  'plain',
  'text',
  'bg',
  'link',
  'round',
  'circle',
  'loading',
  'disabled',
  'icon',
  'autofocus',
  'nativeType',
  'autoInsertSpace',
  'color',
  'dark',
  'tag'
] as const satisfies readonly (keyof ElButtonProps)[];

const buttonAttrs = computed(() => {
  const configAttrs = buttonConfig || {};
  return {
    ...pick(configAttrs, EL_BUTTON_PROP_KEYS),
    ...pick(attrs, EL_BUTTON_PROP_KEYS),
  }
})

const buttonRef = ref(null)
const tooltipRef = ref(null)
defineExpose({
  buttonRef: buttonRef,
  tooltipRef: tooltipRef
})

</script>
