<template>
  <div class="wrap">
    <div style="height: 20px; background-color: red">header</div>
    <y-sticky-layout scroll-container=".wrap">
      <template #left="{ height }">
        <div style="width: 200px; height: 100%; background-color: red">left-{{ height }}</div>
      </template>
      <template #right="{ height }">
        <div style="width: 180px; height: 100%; background-color: blue">right-{{ height }}</div>
      </template>
      <template #default>
        <div style="height: 2000px; background-color: green">content</div>
      </template>
    </y-sticky-layout>
  </div>
</template>
<script setup>
defineOptions({
  name: 'StickyPage2',
  inheritAttrs: true
});
</script>
<style scoped>
.wrap {
  height: 100%;
  overflow: auto;
}
</style>
