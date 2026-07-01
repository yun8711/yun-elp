<template>
  <div class="dialog-example">
    <h2>Dialog 对话框示例</h2>

    <div class="example-section">
      <h3>基础用法</h3>
      <p class="section-desc">内置确认 / 取消按钮，默认防抖；监听 confirm、cancel 事件。</p>
      <y-button
        type="primary"
        @click="basicVisible = true">
        打开对话框
      </y-button>
      <y-dialog
        v-model="basicVisible"
        title="基础用法"
        width="520px"
        @confirm="handleConfirm('基础用法')"
        @cancel="handleCancel('基础用法')">
        <p>这是对话框内容区域，可放置表单、提示信息等。</p>
        <p>AppWrap 全局 dialog 配置会作用于标题样式（如 titleStyle）。</p>
      </y-dialog>
    </div>

    <div class="example-section">
      <h3>内容区滚动</h3>
      <p class="section-desc">通过 body-max-height 限制 body 最大高度，超出部分滚动。</p>
      <y-button @click="scrollVisible = true">打开可滚动对话框</y-button>
      <y-dialog
        v-model="scrollVisible"
        title="内容区滚动"
        width="480px"
        body-max-height="240px"
        @confirm="handleConfirm('内容区滚动')"
        @cancel="handleCancel('内容区滚动')">
        <div
          v-for="i in 10"
          :key="i"
          class="content-block">
          内容块 {{ i }}
        </div>
      </y-dialog>
    </div>

    <div class="example-section">
      <h3>无底部按钮</h3>
      <p class="section-desc">设置 show-footer 为 false，隐藏默认 footer。</p>
      <y-button @click="noFooterVisible = true">打开无 footer 对话框</y-button>
      <y-dialog
        v-model="noFooterVisible"
        title="无底部按钮"
        width="400px"
        :show-footer="false">
        <p>关闭请使用右上角关闭按钮或点击遮罩。</p>
      </y-dialog>
    </div>

    <div class="example-section">
      <h3>居中与全屏</h3>
      <p class="section-desc">透传 el-dialog 的 align-center、fullscreen 等属性。</p>
      <div class="controls">
        <y-button @click="centerVisible = true">居中对话框</y-button>
        <y-button @click="fullscreenVisible = true">全屏对话框</y-button>
      </div>
      <y-dialog
        v-model="centerVisible"
        title="居中对话框"
        width="420px"
        align-center
        @confirm="handleConfirm('居中对话框')"
        @cancel="handleCancel('居中对话框')">
        <p>align-center 使对话框在视口中水平垂直居中。</p>
      </y-dialog>
      <y-dialog
        v-model="fullscreenVisible"
        title="全屏对话框"
        fullscreen
        @confirm="handleConfirm('全屏对话框')"
        @cancel="handleCancel('全屏对话框')">
        <p>fullscreen 模式下对话框占满整个视口。</p>
      </y-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const basicVisible = ref(false)
const scrollVisible = ref(false)
const noFooterVisible = ref(false)
const centerVisible = ref(false)
const fullscreenVisible = ref(false)

const closeAll = () => {
  basicVisible.value = false
  scrollVisible.value = false
  centerVisible.value = false
  fullscreenVisible.value = false
}

const handleConfirm = (label: string) => {
  ElMessage.success(`${label}：确认操作`)
  closeAll()
}

const handleCancel = (label: string) => {
  ElMessage.info(`${label}：取消操作`)
  closeAll()
}
</script>

<style scoped>
.dialog-example {
  max-width: 720px;
  padding: 20px;
  margin: 0 auto;
}

.example-section {
  padding: 20px;
  margin-bottom: 20px;
  background: var(--ep-bg-color-page, #fafafa);
  border: 1px solid var(--ep-border-color-light, #e4e7ed);
  border-radius: 8px;
}

.example-section h3 {
  padding-bottom: 5px;
  margin: 0 0 8px;
  color: var(--ep-text-color-primary, #303133);
  border-bottom: 2px solid var(--ep-color-primary, #409eff);
}

.section-desc {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--ep-text-color-regular, #606266);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.content-block {
  padding: 12px 16px;
  margin-top: 8px;
  color: var(--ep-text-color-regular, #606266);
  background: var(--ep-fill-color-light, #f5f7fa);
  border-radius: 4px;
}
</style>
