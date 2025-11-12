<template>
  <el-empty class="y-empty" v-bind="componentProps" :style="styles">
    <slot />
    <slot name="image" />
    <slot name="description" />
  </el-empty>
</template>

<script setup lang="ts">
import { ElEmpty } from 'element-plus';
import { computed } from '@vue/runtime-core';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';
import type { EmptyProps } from './empty'
const emptyConfig = useAppConfig('empty');
const { t } = useLocale();

defineOptions({
  name: 'YEmpty',
  inheritAttrs: true
});

const props = defineProps<EmptyProps>()

const componentProps = computed(() => {
  return {
    image: props?.image || emptyConfig?.image,
    imageSize: props?.imageSize || emptyConfig?.imageSize || 100,
    description: props?.description || emptyConfig?.description || t('empty.description'),
  }
})

const styles = computed(() => {
  const configStyle = emptyConfig?.style || {};
  const propsStyle = props?.style || {};
  return {
    ...configStyle,
    ...propsStyle
  }
})
</script>
