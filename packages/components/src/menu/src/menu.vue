<template>
  <div class="y-menu">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'YMenu',
  inheritAttrs: true
});
</script>
