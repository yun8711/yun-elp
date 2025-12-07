<template>
  <el-config-provider v-bind="props.elpConfig">
    <slot />
  </el-config-provider>
</template>

<script lang="ts">
import { ElConfigProvider } from 'element-plus';
import type { AppWrapProps } from './app-wrap';

// 默认配置 - 在模块级别声明，避免Vue编译器限制
export const defaultConfig: AppWrapProps = {
  elpConfig: {
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
  },
  locale: 'zh-cn'
};
</script>

<script setup lang="ts">
import { provide, computed } from 'vue';
import { omit, merge } from 'lodash-es';
import { localeContextKey } from '../../../locale';
import { appConfigKey } from './use-app-config';

defineOptions({
  name: 'YAppWrap',
  inheritAttrs: true
});

const props = withDefaults(defineProps<AppWrapProps>(), defaultConfig as any);

// 深度合并props和默认配置，确保嵌套对象也能正确合并
const mergedProps = computed(() => {
  return merge({}, defaultConfig, props);
});

// 从合并后的props中获取除elpConfig、locale以外的配置
const configProps = computed(() => omit(mergedProps.value, ['elpConfig', 'locale']));

// 提供全局配置
provide(appConfigKey, configProps.value);
provide(localeContextKey, props.locale);
</script>
