<template>
  <el-config-provider v-bind="configProviderAttrs">
    <slot></slot>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, provide, watch, useAttrs } from 'vue';
import { ElConfigProvider } from 'element-plus';
import { getLocale, setLocale, locales } from '../../locale';
import { localeContextKey } from '../../hooks/use-locale';
import type { KConfigProviderProps } from './types';
import type { ConfigProviderProps } from 'element-plus';
const attrs = useAttrs();

defineOptions({
  name: 'KConfigProvider'
});

const props = withDefaults(defineProps<KConfigProviderProps>(), {
  locale: 'zh-CN'
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

const configProviderAttrs = computed<ConfigProviderProps>(() => {
  return {
    locale: currentLocale.value,
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
    zIndex: 2000,
    a11y: true,
    keyboardNavigation: true,
    namespace: 'el',
    ...(attrs.value as Record<string, any>)
  };
});

// 计算出最终使用的语言包
const currentLocale = computed(() => {
  // 如果传入的是语言代码（字符串）
  if (typeof props.locale === 'string') {
    // 从语言集合中获取对应的语言包
    return locales[props.locale];
  }

  // 如果传入的是完整的语言包对象
  if (props.locale && typeof props.locale === 'object') {
    return props.locale;
  }

  // 默认使用当前语言
  return getLocale();
});

// 提供locale上下文给子组件
provide(localeContextKey, currentLocale);
</script>

<style lang="scss">
@use './k-config-provider.scss';
</style>
