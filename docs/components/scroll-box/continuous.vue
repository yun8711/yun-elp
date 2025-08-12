<template>
  <div>
    <el-form-item label="连续滚动">
      <el-switch v-model="enableContinuous" />
    </el-form-item>

    <el-form-item v-if="enableContinuous" label="continuousTime">
      <el-slider v-model="continuousTime" :min="100" :max="1000" :step="50" show-input input-size="small"
        style="width: 300px" />
    </el-form-item>

    <el-form-item v-if="enableContinuous" label="连续滚动步长">
      <el-slider v-model="continuousStep" :min="10" :max="100" :step="5" show-input input-size="small"
        style="width: 300px" />
    </el-form-item>

    <el-form-item label="鼠标滚动">
      <el-switch v-model="enableWheel" />
    </el-form-item>

    <!-- 滚动容器 -->
    <YScrollBox :height="120" class="scroll-box" :width="400" :step="50" :wheel-scroll="enableWheel"
      :continuous="enableContinuous" :continuous-time="continuousTime" :continuous-step="continuousStep">
      <div class="content-wrapper">
        <div v-for="i in 8" :key="i" class="content-item">
          <div class="item-number">{{ i }}</div>
        </div>
      </div>
    </YScrollBox>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const enableContinuous = ref(false);
const continuousTime = ref(200);
const continuousStep = ref(30);
const enableWheel = ref(false);
</script>

<style scoped>
.scroll-box {
  border: 1px solid var(--el-border-color);
  padding: 0 20px;
  margin-top: 16px;
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
