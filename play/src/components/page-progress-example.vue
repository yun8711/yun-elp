<template>
  <div class="page-progress-example">
    <h2>PageProgress 页面进度条示例</h2>

    <div class="intro-section">
      <p><strong>PageProgress</strong> 是一个基于 NProgress 理念的页面进度条组件，支持以下特性：</p>
      <ul>
        <li>✅ 自动模式：自动监听页面加载状态</li>
        <li>✅ 手动控制：提供完整的API进行精确控制</li>
        <li>✅ 队列优化：避免动画冲突，提供流畅体验</li>
        <li>✅ 自动增量：模拟真实的加载过程</li>
        <li>✅ 高度可配置：颜色、速度、动画等均可自定义</li>
      </ul>
    </div>

    <div class="example-section">
      <h3>基础用法</h3>
      <div class="controls">
        <el-button @click="startProgress" type="primary">
          开始加载
        </el-button>
        <el-button @click="completeProgress" type="danger">
          完成
        </el-button>
      </div>

      <div class="status-info">
        <p>提示: 使用 v-model 控制进度条显示/隐藏，trickle 会自动增量到96%。v-model 和 auto 模式互斥。</p>
      </div>
    </div>

    <div class="example-section">
      <h3>自动增量演示</h3>
      <div class="controls">
        <el-button @click="startWithTrickle" type="primary">
          开始自动增量
        </el-button>
        <el-button @click="completeProgress" type="danger">
          停止并完成
        </el-button>
      </div>
      <p class="desc">启用trickle后，进度条会自动增加到96%，然后等待手动设置为 false 完成</p>
    </div>

    <div class="example-section">
      <h3>自动模式演示</h3>
      <div class="controls">
        <el-button @click="toggleAutoMode" type="primary">
          {{ config.auto ? '禁用' : '启用' }}自动模式
        </el-button>
        <el-button @click="simulatePageRefresh" type="warning">
          模拟页面刷新
        </el-button>
      </div>
      <p class="desc">
        自动模式下，进度条会自动监听页面加载状态：
        <br>• 当页面开始加载时，进度条自动出现并开始增量
        <br>• 当页面加载完成时，进度条自动消失
        <br>• 当前状态: <strong :class="{ 'text-success': config.auto, 'text-warning': !config.auto }">{{ config.auto ? '已启用' : '已禁用' }}</strong>
      </p>
    </div>

    <div class="example-section">
      <h3>配置选项</h3>
      <div class="config-controls">
        <div class="config-item">
          <label>自动模式:</label>
          <el-switch v-model="config.auto" @change="updateConfig" />
        </div>
        <div class="config-item">
          <label>颜色:</label>
          <el-color-picker v-model="config.color" @change="updateConfig" />
        </div>
        <div class="config-item">
          <label>动画速度 (ms):</label>
          <el-input-number
            v-model="config.speed"
            :min="50"
            :max="2000"
            :step="50"
            @change="updateConfig"
          />
        </div>
        <div class="config-item">
          <label>最小进度:</label>
          <el-input-number
            v-model="config.minimum"
            :min="0"
            :max="100"
            :step="1"
            @change="updateConfig"
          />
        </div>
        <div class="config-item">
          <label>自动增量:</label>
          <el-switch v-model="config.trickle" @change="updateConfig" />
        </div>
        <div class="config-item">
          <label>增量速度 (ms):</label>
          <el-input-number
            v-model="config.trickleSpeed"
            :min="50"
            :max="1000"
            :step="50"
            @change="updateConfig"
          />
        </div>
      </div>
    </div>

    <div class="example-section">
      <h3>模拟页面加载</h3>
      <div class="controls">
        <el-button @click="simulatePageLoad" :disabled="isSimulating" type="primary">
          模拟页面加载
        </el-button>
        <el-button @click="simulateAjaxLoad" :disabled="isSimulating" type="success">
          模拟Ajax请求
        </el-button>
      </div>
      <p class="desc">演示在实际场景中的使用方式</p>
    </div>

    <!-- PageProgress 组件 -->
    <y-page-progress
      v-model="isLoading"
      v-bind="config"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 进度条引用
const progressRef = ref()

// 状态
const isLoading = ref(false)
const isSimulating = ref(false)

// 配置
const config = reactive({
  auto: false,
  color: 'red',
  speed: 200,
  minimum: 8,
  trickle: true,
  trickleSpeed: 200,
  strokeWidth:10
})

// 方法
const toggleAutoMode = () => {
  config.auto = !config.auto
  ElMessage.info(`自动模式已${config.auto ? '启用' : '禁用'}`)
}

const simulatePageRefresh = () => {
  ElMessage.info('模拟页面刷新中...')

  // 触发页面加载开始事件
  window.dispatchEvent(new Event('beforeunload'))

  // 模拟加载时间
  setTimeout(() => {
    // 触发页面加载完成事件
    window.dispatchEvent(new Event('load'))
    ElMessage.success('页面刷新完成！')
  }, 2000)
}

const startProgress = () => {
  isLoading.value = true
  ElMessage.success('进度条已开始')
}

const completeProgress = () => {
  isLoading.value = false
  ElMessage.success('进度条已完成')
}

const startWithTrickle = () => {
  isLoading.value = true
  ElMessage.info('自动增量已启动，请观察进度条缓慢增加')
}

const updateConfig = () => {
  ElMessage.info('配置已更新（注意：现在配置通过 props 传入，动态更新无效）')
}

// 模拟页面加载
const simulatePageLoad = async () => {
  isSimulating.value = true
  ElMessage.info('开始模拟页面加载...')

  // 开始进度条（会自动启用 trickle）
  isLoading.value = true

  // 模拟加载时间
  await delay(2500)

  // 完成加载
  isLoading.value = false

  isSimulating.value = false
  ElMessage.success('页面加载完成！')
}

// 模拟Ajax请求
const simulateAjaxLoad = async () => {
  isSimulating.value = true
  ElMessage.info('开始模拟Ajax请求...')

  // 开始进度条（会自动启用 trickle）
  isLoading.value = true

  // 模拟多个并发请求的总时间
  await delay(2500)

  // 完成所有请求
  isLoading.value = false

  isSimulating.value = false
  ElMessage.success('所有请求完成！')
}


// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
</script>

<style scoped>
.page-progress-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.intro-section {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.intro-section p {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #303133;
}

.intro-section ul {
  margin: 0;
  padding-left: 20px;
}

.intro-section li {
  margin-bottom: 6px;
  color: #606266;
}

.text-success {
  color: #67c23a !important;
}

.text-warning {
  color: #e6a23c !important;
}

.example-section {
  margin-bottom: 30px;
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

.status-info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.status-info p {
  margin: 0;
  color: #606266;
  font-weight: 500;
}

.status-active {
  color: #409eff;
  font-weight: bold;
}

.config-controls {
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
  font-weight: 500;
}

.desc {
  margin: 10px 0 0 0;
  color: #909399;
  font-size: 14px;
  font-style: italic;
}
</style>
