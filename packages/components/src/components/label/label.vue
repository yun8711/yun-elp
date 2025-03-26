<template>
  <div class="k-label" :style="{ width: props.width, display: props.block ? 'block' : 'inline-block' }">
    <div class="k-label__inner">
      <div v-if="props.label" class="k-label__label">
        <slot name="label">{{ props.label }}</slot>
      </div>
      <div class="k-label__content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'KLabel',
  inheritAttrs: false
});

interface Props {
  label?: string;
  width?: string;
  block?: boolean;
}

// 定义组件属性
const props = withDefaults(defineProps<Props>(), {
  width: '316px',
  block: false,
})
</script>

<style lang="scss">
@use './label.scss';
</style>
