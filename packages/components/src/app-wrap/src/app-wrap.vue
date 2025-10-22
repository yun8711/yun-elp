<!--
 * @Author: liuyun liuyun.dev@qq.com
 * @Date: 2025-09-01 11:30:49
 * @LastEditors: liuyun liuyun.dev@qq.com
 * @LastEditTime: 2025-09-11 14:57:15
 * @FilePath: /yun-elp/packages/components/src/app-wrap/src/app-wrap.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-config-provider v-bind="props.elpConfig">
    <slot></slot>
  </el-config-provider>
</template>

<script setup lang="ts">
import { provide, onMounted } from '@vue/runtime-core';
import { omit } from 'lodash-es';
import { localeContextKey } from '../../../locale';
import type { AppWrapProps } from './app-wrap';
import { appConfigKey } from './use-app-config';
import { preloadCustomModules } from '../../echarts/src/echarts-loader';

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
  })
});

// 从props中获取除elpConfig、locale以外的配置
const configProps = omit(props, ['elpConfig', 'locale']);

// 提供全局配置
provide(appConfigKey, configProps);
provide(localeContextKey, props.locale);

// 预加载ECharts模块（立即加载）
onMounted(() => {
  if (props.echarts && (props.echarts.chartTypes?.length || props.echarts.components?.length || props.echarts.renderers?.length || props.echarts.features?.length)) {
    preloadCustomModules({
      chartTypes: props.echarts.chartTypes,
      components: props.echarts.components,
      renderers: props.echarts.renderers,
      features: props.echarts.features
    }).then(() => {
      console.log('ECharts模块预加载完成');
    }).catch((error) => {
      console.warn('ECharts模块预加载失败:', error);
    });
  }
});
</script>
