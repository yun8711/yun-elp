<template>
  <el-config-provider v-bind="props" :locale="currentLocale">
    <slot></slot>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, provide, watch } from '@vue/runtime-core';
import { getLocale, setLocale, locales } from '../../../locale';
import { localeContextKey } from '../../../hooks/use-locale';
import type { AppWrapProps } from './app-wrap';

defineOptions({
  name: 'YAppWrap',
  inheritAttrs: true
});

const props = withDefaults(defineProps<AppWrapProps>(), {
  locale: 'zh-CN',
  size: 'default',
  button: () => ({
    autoInsertSpace: true
  }),
  message: () => ({
    max: 3,
    grouping: true,
    duration: 3000,
    showClose: true,
    offset: 20
  }),
  zIndex: 2000
});

// 计算出最终使用的语言包
const currentLocale = computed(() => {
  // 如果传入的是语言代码（字符串）
  if (typeof props.locale === 'string') {
    // 从语言集合中获取对应的语言包
    return locales[props.locale] || getLocale();
  }

  // 如果传入的是完整的语言包对象
  if (props.locale && typeof props.locale === 'object') {
    return props.locale;
  }

  // 默认使用当前语言
  return getLocale();
});

// 处理传入的locale，并设置全局语言
watch(
  () => props.locale,
  newLocale => {
    if (typeof newLocale === 'string') {
      // 如果是语言代码字符串，则设置全局语言
      setLocale(newLocale);
    }
  },
  { immediate: true }
);

// 提供locale上下文给子组件
provide(localeContextKey, currentLocale);
</script>
