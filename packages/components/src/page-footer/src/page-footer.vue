<template>
  <div class="y-page-footer" :style="style">
    <slot :height="style.height" />
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import type { PageFooterProps } from './page-footer';
import { computed } from 'vue';
import { isNumber } from 'lodash-es';

defineOptions({
  name: 'YPageFooter',
  inheritAttrs: true
});

const props = withDefaults(defineProps<PageFooterProps>(), {
  model: 'fixed'
});
const pageFooterConfig = useAppConfig('pageFooter');

const getStyleValue = (value: string | number | undefined, value2: string | number | undefined, defaultValue: string | number) => {
  if (value !== undefined && value !== '' && value !== null) {
    return isNumber(value) ? `${value}px` : value
  } else if (value2 !== undefined && value2 !== '' && value2 !== null) {
    return isNumber(value2) ? `${value2}px` : value2
  } else {
    return defaultValue
  }
}

const style = computed(() => {
  return {
    height: getStyleValue(props.height, pageFooterConfig?.height, '56px'),
    left: getStyleValue(props.left, pageFooterConfig?.left, '0'),
    right: getStyleValue(props.right, pageFooterConfig?.right, '0'),
    bottom: 0,
    position: props.model
  }
})

</script>
