<template>
  <div class="container">
    <h1>KD-ELP 组件库测试</h1>

    <div style="display: flex; align-items: center; gap: 20px;margin-bottom: 50px;">
      <!-- 语言切换按钮 -->
      <div class="config-item">
        <span>切换语言：</span>
        <el-select v-model="locale" style="width: 120px">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
        </el-select>
      </div>

      <!-- 展示区域控制 -->
      <div class="config-item">
        <span>背景网格：</span>
        <el-switch v-model="showGrid" active-text="显示" inactive-text="隐藏" />
      </div>

      <div class="config-item">
        <span>背景颜色：</span>
        <el-color-picker v-model="backgroundColor" show-alpha @change="handleBackgroundChange" />
      </div>
    </div>

    <!-- 使用KD-ELP的ConfigProvider -->

    <section class="demo-section" :style="{ backgroundColor }">
      <grid-canvas v-if="showGrid" :show-grid="showGrid" :background-color="backgroundColor" />
      <slot locale backgroundColor></slot>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import GridCanvas from './GridCanvas.vue'

// 当前语言
const locale = ref('zh-CN')

// 网格显示控制
const showGrid = ref(false)

// 背景颜色
const backgroundColor = ref('#ffffff')

// 切换语言
const handleLocaleChange = newLocale => {
  console.log('切换语言为:', newLocale)
  locale.value = newLocale
}

// 切换背景颜色
const handleBackgroundChange = color => {
  console.log('背景颜色:', color)
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 50px;

  .config-item {
    display: flex;
    align-items: center;

    span {
      margin-right: 10px;
      font-size: 14px;
    }
  }

  .demo-section {
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 4px;
    transition: background-color 0.3s;
    position: relative;
    z-index: 1;
  }
}
</style>
