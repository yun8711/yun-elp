<template>
  <div>
    <div style="height: 40px;line-height: 40px;text-align: center; background-color: #eee;">
      导航栏
    </div>
    <div
      class="custom-scroll-container"
      ref="scrollContainerRef">
      <y-sticky-layout :scroll-container="scrollContainerRef">
        <template #left="{ height }">
          <div :style="{ height: height + 'px', width: '200px' }">当前高度: {{ height }}px</div>
        </template>

        <template #default>
          <div style="height: 800px; background-color: #ccc">内容区域一</div>
          <div style="height: 700px; background-color: #bbb">内容区域二</div>
        </template>

        <template #right="{ height }">
          <div class="right-sidebar">
            <div>高度: {{ height }}px</div>
          </div>
        </template>
      </y-sticky-layout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const scrollContainerRef = ref<HTMLElement>();
</script>

<style scoped>
.custom-scroll-container {
  height: 500px;
  overflow-y: auto;
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
}

.right-sidebar {
  width: 140px;
  padding: 16px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}
</style>
