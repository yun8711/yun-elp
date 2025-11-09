<template>
  <div
    class="y-page-header"
    :class="{ 'y-page-header--border': showBorder }"
    :style="containerStyle">
    <div class="y-page-header__left">
      <div class="y-page-header__left-title" :style="titleStyle">
        <slot name="title">
          {{ displayTitle }}
        </slot>
      </div>
      <div class="y-page-header__left-extra">
        <slot name="extra" />
      </div>
    </div>

    <div class="y-page-header__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { PageHeaderProps } from './page-header';
import { useRoute } from 'vue-router';
import { get, isEmpty } from 'lodash-es';

defineOptions({
  name: 'YPageHeader',
  inheritAttrs: true
});

const props = withDefaults(defineProps<PageHeaderProps>(), {
  title: '',
  titleStyle: () => ({}),
});

// 从app-wrap配置中获取默认值
const appConfig = useAppConfig('pageHeader');

// 计算显示的高度
const displayHeight = computed(() => {
  if (props.height !== undefined && props.height !== null && props.height !== '') {
    return props.height;
  }
  if (appConfig?.height !== undefined && appConfig?.height !== null && appConfig?.height !== '') {
    return appConfig.height;
  }
  return '40px';
});

// 计算是否显示边框
const showBorder = computed(() => {
  if (props.border !== undefined) {
    return props.border;
  }
  if (appConfig?.border !== undefined) {
    return appConfig.border;
  }
  return true;
});

// 计算内边距, 支持字符串、数字、数组, 数组格式为 [left, right],转换为字符串
const displayPadding = computed(() => {
  let paddingArr = props.paddingX ?? appConfig?.paddingX;

  if (isEmpty(paddingArr)) {
    paddingArr = ['24px', '24px'];
  }
  let paddingLeft, paddingRight;
  if (Array.isArray(paddingArr)) {
    paddingLeft = paddingArr[0];
    paddingRight = paddingArr[1];
  } else {
    paddingLeft = paddingArr;
    paddingRight = paddingArr;
  }
  return {
    paddingLeft,
    paddingRight
  };
});

// 计算显示的标题
const displayTitle = computed(() => {
  if (props.title) {
    return props.title;
  }
  // 获取路由对象
  const route = useRoute();

  if (!appConfig?.titlePath) {
    return get(route, 'meta.title', '');
  }

  // 从app-wrap配置中获取标题
  return get(route, appConfig.titlePath, '');
});

// 容器样式
const containerStyle = computed(() => {
  const style: Record<string, any> = {
    height: displayHeight.value,
  };

  if (displayPadding.value.paddingLeft) {
    style.paddingLeft = displayPadding.value.paddingLeft;
  }
  if (displayPadding.value.paddingRight) {
    style.paddingRight = displayPadding.value.paddingRight;
  }

  return style;
});
</script>
