<template>
  <div class="demo-page-progress">
    <div class="demo-section">
      <h3>基础用法</h3>
      <div class="demo-controls">
        <el-button @click="startProgress" :disabled="isLoading" type="primary">
          开始加载
        </el-button>
        <el-button @click="setProgress(0.5)" :disabled="!isLoading" type="warning">
          设置50%
        </el-button>
        <el-button @click="incrementProgress" :disabled="!isLoading" type="success">
          增加进度
        </el-button>
        <el-button @click="completeProgress" :disabled="!isLoading" type="danger">
          完成
        </el-button>
      </div>
      <div class="demo-info">
        <p>当前状态: {{ isLoading ? '加载中' : '未开始' }}</p>
        <p>当前进度: {{ Math.round(percentage * 100) }}%</p>
      </div>
    </div>

    <div class="demo-section">
      <h3>配置示例</h3>
      <div class="demo-config">
        <div class="config-item">
          <label>颜色:</label>
          <el-color-picker v-model="config.color" @change="updateConfig" />
        </div>
        <div class="config-item">
          <label>动画速度 (ms):</label>
          <el-input-number v-model="config.speed" :min="100" :max="2000" @change="updateConfig" />
        </div>
        <div class="config-item">
          <label>最小进度:</label>
          <el-input-number v-model="config.minimum" :min="0" :max="0.5" :step="0.01" @change="updateConfig" />
        </div>
        <div class="config-item">
          <label>显示加载图标:</label>
          <el-switch v-model="config.showSpinner" @change="updateConfig" />
        </div>
        <div class="config-item">
          <label>自动增量:</label>
          <el-switch v-model="config.trickle" @change="updateConfig" />
        </div>
      </div>
    </div>

    <!-- 页面进度条组件 -->
    <y-page-progress
      ref="progressRef"
      v-model:show="isLoading"
      v-model:percentage="percentage"
      v-bind="config"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElButton, ElColorPicker, ElInputNumber, ElSwitch } from 'element-plus';

// 进度条引用
const progressRef = ref();

// 状态
const isLoading = ref(false);
const percentage = ref(0);

// 配置
const config = reactive({
  color: '#29d',
  speed: 200,
  minimum: 0.08,
  showSpinner: true,
  trickle: true,
  trickleSpeed: 200
});

// 方法
const startProgress = () => {
  isLoading.value = true;
  percentage.value = 0;
  if (progressRef.value) {
    progressRef.value.start();
  }
};

const setProgress = (value: number) => {
  if (progressRef.value) {
    progressRef.value.set(value);
  }
};

const incrementProgress = () => {
  if (progressRef.value) {
    progressRef.value.inc(0.1);
  }
};

const completeProgress = () => {
  if (progressRef.value) {
    progressRef.value.done();
  }
};

const updateConfig = () => {
  if (progressRef.value) {
    progressRef.value.configure(config);
  }
};
</script>

<style scoped>
.demo-page-progress {
  padding: 20px;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.demo-section h3 {
  margin: 0 0 15px 0;
  color: #303133;
}

.demo-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.demo-info {
  display: flex;
  gap: 20px;
}

.demo-info p {
  margin: 0;
  color: #606266;
}

.demo-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-item label {
  min-width: 100px;
  color: #606266;
}
</style>