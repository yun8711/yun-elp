<template>
  <div class="k-label">
    <!-- 组件内容 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'KLabel',
  inheritAttrs: false
});

// 定义组件属性
defineProps<{
  // 在此处定义组件属性
}>();

// 定义组件事件
const emit = defineEmits<{
  // 在此处定义组件事件
}>();
</script>

<style lang="scss">
@use './label.scss';
</style>
