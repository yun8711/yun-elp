<template>
  <el-empty
    :class="ns.b()"
    v-bind="componentProps"
    :style="styles">
    <slot />
    <slot name="image" />
    <slot name="description" />
  </el-empty>
</template>

<script setup lang="ts">
import { ElEmpty } from 'element-plus';
import { computed } from 'vue';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';
import { useNamespace } from '../../../hooks/use-namespace';
import type { EmptyProps } from './empty'
const emptyConfig = useAppConfig('empty');
const { t } = useLocale();
const ns = useNamespace('empty');

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
