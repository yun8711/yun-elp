<template>
  <el-config-provider :locale="locale" v-bind="$attrs">
    <slot></slot>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElConfigProvider } from 'element-plus';
import { getLocale } from '../../locale';
import type { KConfigProviderProps } from './types';

defineOptions({
  name: 'KConfigProvider'
});

const props = defineProps<KConfigProviderProps>();

// 计算出最终使用的语言包
const locale = computed(() => {
  // 如果传入的是语言代码（字符串）
  if (typeof props.locale === 'string') {
    return getLocale();
  }
  // 如果传入的是完整的语言包对象
  if (props.locale && typeof props.locale === 'object') {
    return props.locale;
  }
  // 默认使用当前语言
  return getLocale();
});
</script>

<style lang="scss">
@use './k-config-provider.scss';
</style>
