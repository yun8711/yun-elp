<template>
  <div class="page-progress-example">
    <h2>PageProgress 页面进度条示例</h2>

    <div class="example-section">
      <h3>基础用法</h3>
      <div class="controls">
        <el-button @click="startProgress" type="primary" :disabled="isLoading">
          {{ isLoading ? '加载中...' : '开始加载' }}
        </el-button>
        <el-button @click="completeProgress" type="danger" :disabled="!isLoading">
          完成
        </el-button>
      </div>

      <div class="status-info">
        <p>点击"开始加载"显示进度条，点击"完成"隐藏进度条。进度条会自动增量到99%。</p>
      </div>
    </div>

    <!-- PageProgress 组件 -->
    <y-page-progress v-model="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 状态
const isLoading = ref(false)

// 方法
const startProgress = () => {
  isLoading.value = true
  ElMessage.success('进度条已开始')
}

const completeProgress = () => {
  isLoading.value = false
  ElMessage.success('进度条已完成')
}
</script>

<style scoped>
.page-progress-example {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
}

.example-section h3 {
  margin: 0 0 15px 0;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 5px;
}

.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.status-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}
</style>
