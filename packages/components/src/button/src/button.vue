<template>
  <el-button v-bind="$attrs" @click="handleClick" ref="buttonRef">
    <slot />
    <slot name="icon" />
    <slot name="loading" />
  </el-button>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { ButtonProps } from './button'
import { ref } from '@vue/runtime-core'

defineOptions({
  name: 'YButton',
  inheritAttrs: true
});

const props = withDefaults(defineProps<ButtonProps>(), {
  delay: 300,
  maxWait: undefined
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = useDebounceFn((event: MouseEvent) => {
  console.log('22', buttonRef.value.type)
  emit('click', event)
}, Number(props.delay), props.maxWait ? { maxWait: Number(props.maxWait) } : undefined)

const buttonRef = ref(null)
defineExpose({
  ref: buttonRef
})

</script>
