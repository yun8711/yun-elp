<template>
  <!-- 容器宽度控制 -->
  <el-form-item label="容器宽度">
    <el-slider v-model="containerWidth" :min="200" :max="800" :step="50" show-input input-size="small"
      style="width: 300px" />
  </el-form-item>

  <!-- 滚动容器 -->
  <YScrollBox :height="120" class="scroll-box" :width="containerWidth">
    <div class="content-wrapper">
      <div v-for="i in 4" :key="i" class="content-item">
        <div class="item-number">{{ i }}</div>
      </div>
    </div>
  </YScrollBox>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const containerWidth = ref(400);
</script>

<style scoped>
.scroll-box {
  border: 1px solid var(--el-border-color);
  padding: 0 20px;
}

.content-wrapper {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.content-item {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  background: linear-gradient(135deg, var(--el-color-primary-light-7), var(--el-color-primary-light-5));
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.item-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}
</style>
