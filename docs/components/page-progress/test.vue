<template>
  <div>
    <y-page-progress v-model="isStarted" v-bind="config" />

    <div class="controls">
      <el-button @click="startProgress" type="primary" :disabled="isStarted">
        {{ isStarted ? '加载中...' : '开始加载' }}
      </el-button>
      <el-button @click="completeProgress" type="danger" :disabled="!isStarted"> 完成 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElButton, ElColorPicker, ElInputNumber, ElSwitch } from 'element-plus';

// 状态
const isStarted = ref(false);

// 配置
const config = reactive({
  color: 'red',
  strokeWidth: 10,
  speed: 200,
  spinner: true,
  delay: 200,
  step: 10,
});

const startProgress = () => {
  isStarted.value = true;
};

const completeProgress = () => {
  isStarted.value = false;
};
</script>
