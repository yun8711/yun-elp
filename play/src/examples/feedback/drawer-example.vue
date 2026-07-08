<template>
  <div class="drawer-example">
    <h2>Drawer 抽屉示例</h2>

    <div class="example-section">
      <h3>基础用法</h3>
      <p class="section-desc">内置确认 / 取消按钮，默认防抖；监听 confirm、cancel 事件。</p>
      <y-button type="primary" @click="basicVisible = true"> 打开抽屉 </y-button>
      <y-drawer
        v-model="basicVisible"
        title="基础用法"
        @confirm="handleConfirm('基础用法')"
        @cancel="handleCancel('基础用法')"
      >
        <p>这是抽屉内容区域，可放置表单、详情等。</p>
        <p>向下滚动可验证 body 区域滚动行为。</p>
        <div v-for="i in 8" :key="i" class="content-block">内容块 {{ i }}</div>
      </y-drawer>
    </div>

    <div class="example-section">
      <h3>无底部按钮</h3>
      <p class="section-desc">设置 show-footer 为 false，隐藏默认 footer。</p>
      <y-button @click="noFooterVisible = true">打开无 footer 抽屉</y-button>
      <y-drawer v-model="noFooterVisible" title="无底部按钮" :show-footer="false">
        <p>关闭请使用右上角关闭按钮或点击遮罩。</p>
      </y-drawer>
    </div>

    <div class="example-section">
      <h3>自定义尺寸与方向</h3>
      <p class="section-desc">透传 el-drawer 的 size、direction 等属性。</p>
      <div class="controls">
        <y-button @click="openCustom('ltr')">从左打开 (480px)</y-button>
        <y-button @click="openCustom('ttb')">从上打开 (320px)</y-button>
      </div>
      <y-drawer
        v-model="customVisible"
        :title="customTitle"
        :direction="customDirection"
        :size="customSize"
        @confirm="handleConfirm(customTitle)"
        @cancel="handleCancel(customTitle)"
      >
        <p>当前方向：{{ customDirection }}，尺寸：{{ customSize }}</p>
      </y-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const basicVisible = ref(false)
const noFooterVisible = ref(false)
const customVisible = ref(false)
const customDirection = ref<'ltr' | 'ttb'>('ltr')
const customSize = ref('480px')
const customTitle = ref('从左打开')

const openCustom = (direction: 'ltr' | 'ttb') => {
  customDirection.value = direction
  if (direction === 'ltr') {
    customSize.value = '480px'
    customTitle.value = '从左打开'
  } else {
    customSize.value = '320px'
    customTitle.value = '从上打开'
  }
  customVisible.value = true
}

const handleConfirm = (label: string) => {
  ElMessage.success(`${label}：确认操作`)
  basicVisible.value = false
  customVisible.value = false
}

const handleCancel = (label: string) => {
  ElMessage.info(`${label}：取消操作`)
  basicVisible.value = false
  customVisible.value = false
}
</script>

<style scoped>
.drawer-example {
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
