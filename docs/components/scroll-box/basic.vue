<template>
  <div class="demo-container">
    <h3>水平滚动示例</h3>
    <div class="demo-item">
      <h4>水平滚动</h4>
      <p class="demo-tip">
        注意：在 auto 模式下，左侧按钮只有在向右滚动后才会显示，右侧按钮在内容超出容器时显示
      </p>
      <YScrollBox
        :height="80"
        :width="400"
        direction="horizontal"
        :arrow-model="arrowModel"
        :step="50"
        :continuous="continuous"
        :wheel-scroll="wheelScroll"
      >
        <div class="scroll-content">
          <div v-for="i in 30" :key="i" class="scroll-item">项目 {{ i }}</div>
        </div>
      </YScrollBox>
    </div>

    <h3>垂直滚动示例</h3>
    <div class="demo-item">
      <h4>垂直滚动</h4>
      <p class="demo-tip">注意：垂直滚动在 auto 模式下默认不显示箭头，因为可以通过鼠标滚轮操作</p>
      <YScrollBox
        :height="200"
        :width="300"
        direction="vertical"
        :arrow-model="arrowModel"
        :step="30"
        :continuous="continuous"
      >
        <div class="scroll-content-vertical">
          <div v-for="i in 30" :key="i" class="scroll-item-vertical">垂直项目 {{ i }}</div>
        </div>
      </YScrollBox>
    </div>

    <h3>配置选项</h3>
    <div class="config-panel">
      <el-form :model="config" label-width="120px">
        <el-form-item label="箭头模式">
          <el-radio-group v-model="config.arrowModel">
            <el-radio label="auto">自动显示</el-radio>
            <el-radio label="always">始终显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="连续滚动">
          <el-switch v-model="config.continuous" />
        </el-form-item>
        <el-form-item label="滚动步长">
          <el-input-number v-model="config.step" :min="10" :max="100" />
        </el-form-item>
        <el-form-item label="滚轮滚动">
          <el-switch v-model="config.wheelScroll" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const config = ref({
  arrowModel: 'auto',
  continuous: false,
  step: 50,
  wheelScroll: false
});

const arrowModel = computed(() => config.value.arrowModel);
const continuous = computed(() => config.value.continuous);
const wheelScroll = computed(() => config.value.wheelScroll);
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.demo-item {
  margin-bottom: 30px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 20px;
}

.demo-tip {
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background-color: var(--el-fill-color-light);
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid var(--el-color-info);
}

.scroll-content {
  display: flex;
  gap: 10px;
}

.scroll-item {
  flex-shrink: 0;
  padding: 10px 20px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  white-space: nowrap;
}

.scroll-content-vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scroll-item-vertical {
  padding: 10px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.config-panel {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
