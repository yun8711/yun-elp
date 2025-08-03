<template>
  <el-config-provider v-bind="props.elpConfig">
    <slot></slot>
  </el-config-provider>
</template>

<script setup lang="ts">
import { watch, provide } from '@vue/runtime-core';
import { omit } from 'lodash-es';
import { setLocale, type LocaleType } from '../../../locale';
import type { AppWrapProps } from './app-wrap';
import { appConfigKey } from './use-app-config';

defineOptions({
  name: 'YAppWrap',
  inheritAttrs: true
});

const props = withDefaults(defineProps<AppWrapProps>(), {
  elpConfig: () => ({
    namespace: 'el',
    a11y: true,
    keyboardNavigation: true,
    size: 'default',
    zIndex: 2000,
    button: {
      autoInsertSpace: true
    },
    message: {
      max: 3,
      grouping: true,
      duration: 3000,
      showClose: true,
      offset: 20
    }
  }),
  locale: 'zh-cn',
  borderLabel: () => ({
    width: '316px',
    height: '32px'
  }),
  button: () => ({
    delay: 300,
    maxWait: undefined,
    placement: 'top'
  })
});

// 从props中获取除elpConfig/locale以外的配置
const configProps = omit(props, ['elpConfig', 'locale']);

// 提供全局配置
provide(appConfigKey, configProps);

// 处理传入的locale，并设置全局语言
watch(
  () => props.locale,
  (newLocale: LocaleType) => {
    setLocale(newLocale as LocaleType);
  },
  { immediate: true }
);
</script>
