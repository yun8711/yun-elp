<template>
  <div
    :class="ns.b()"
    :dir="resolvedDirection">
    <el-config-provider v-bind="elpConfig">
      <slot />
    </el-config-provider>
  </div>
</template>

<script lang="ts">
import { ElConfigProvider } from 'element-plus';
import type { ConfigProviderProps } from 'element-plus';
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
  yNamespace: 'y',
  locale: 'zh-cn',
  direction: 'auto'
};
</script>

<script setup lang="ts">
import { provide, computed } from 'vue';
import { omit, merge } from 'lodash-es';
import {
  localeContextKey,
  resolveDirection,
  directionContextKey,
  getElementPlusLocale,
  type LocaleType
} from '../../../locale';
import { useNamespace } from '../../../hooks/use-namespace';
import { appConfigKey, namespaceConfigKey } from './use-app-config';

defineOptions({
  name: 'YAppWrap',
  inheritAttrs: false
});

const props = withDefaults(defineProps<AppWrapProps>(), defaultConfig as any);
const ns = useNamespace('app-wrap');

// 深度合并props和默认配置，确保嵌套对象也能正确合并
const mergedProps = computed(() => {
  return merge({}, defaultConfig, props);
});

// 提取 elpConfig 用于 el-config-provider；未显式设置 locale 时与 yun-elp locale 对齐
const elpConfig = computed((): ConfigProviderProps => {
  const config = mergedProps.value.elpConfig as ConfigProviderProps;
  const locale = (mergedProps.value.locale ?? 'zh-cn') as LocaleType;

  if (config.locale != null) {
    return config;
  }

  return {
    ...config,
    locale: getElementPlusLocale(locale)
  };
});

const resolvedDirection = computed(() =>
  resolveDirection(mergedProps.value.locale ?? 'zh-cn', mergedProps.value.direction ?? 'auto')
);

// 从合并后的props中获取除 elpConfig、locale、direction 以外的配置
const configProps = computed(() => omit(mergedProps.value, ['locale', 'direction']));
const namespaceConfig = computed(() => ({
  el: mergedProps.value.elpConfig?.namespace || 'el',
  y: mergedProps.value.yNamespace || 'y'
}));

// 提供全局配置
provide(appConfigKey, configProps.value);
provide(namespaceConfigKey, namespaceConfig.value);
provide(localeContextKey, props.locale);
provide(directionContextKey, resolvedDirection);
</script>
