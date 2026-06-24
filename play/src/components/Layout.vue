<template>
  <div class="container">
    <h1>YUN-ELP 组件调试</h1>

    <div style="display: flex; gap: 15px; align-items: center;margin-bottom: 20px;">
      <!-- 语言切换按钮 -->
      <div class="config-item">
        <span>多语言：</span>
        <el-select v-model="localeModel" style="width: 120px">
          <el-option label="简体中文" value="zh-cn" />
          <el-option label="English" value="en" />
        </el-select>
      </div>

      <div class="config-item">
        <span>主题：</span>
        <el-select v-model="themeModel" style="width: 120px">
          <el-option label="KD" value="kd" />
          <el-option label="Arco" value="arco" />
          <el-option label="Antd" value="antd" />
        </el-select>
      </div>

      <!-- 展示区域控制 -->
      <div class="config-item">
        <span>背景色：</span>
        <el-color-picker
          v-model="backgroundColor"
          show-alpha
          @change="handleBackgroundColorChange" />
      </div>

      <!-- 显示容器尺寸 -->
      <div class="config-item">
        <span>容器尺寸：</span>
        <span class="size-info">{{ Math.round(width) }} x {{ Math.round(height) }}px</span>
        <el-switch
          v-model="isLocked"
          active-text="锁定"
          inactive-text="解锁"
          style="margin-left: 10px;" />
      </div>

      <div class="config-item">
        <!-- 组件选择器 -->
        <span>组件：</span>
        <el-select
          v-model="curComponent"
          placeholder="选择要查看的组件"
          :options="examples"
          @change="handleComponentChange"
          style="width: 200px;">
        </el-select>
      </div>

      <!-- element-plus链接 -->
      <el-link type="primary" href="https://element-plus.org/zh-CN/" target="_blank"
        >Element Plus 文档<el-icon><Link /></el-icon
      ></el-link>
    </div>

    <!-- 使用KD-ELP的ConfigProvider -->
    <section
      ref="sectionRef"
      class="demo-section"
      :class="{ 'is-locked': isLocked }"
      :style="{ backgroundColor }">
      <slot :locale="localeModel" :backgroundColor="backgroundColor" :curComponent="curComponent"></slot>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { Link } from '@element-plus/icons-vue'

const props = defineProps({
  examples: {
    type: Array,
    required: true
  },
  locale: {
    type: String,
    default: 'zh-cn'
  },
  theme: {
    type: String,
    default: 'kd'
  }
})
const emit = defineEmits(['update:locale', 'update:theme'])

const localeModel = computed({
  get: () => props.locale,
  set: value => emit('update:locale', value)
})

const themeModel = computed({
  get: () => props.theme,
  set: value => emit('update:theme', value)
})

// 背景颜色
const backgroundColor = ref(localStorage.getItem('YElp-backgroundColor') || '#ffffff')

// 背景颜色变化
const handleBackgroundColorChange = (color) => {
  console.log('背景颜色变化:', color)
  localStorage.setItem('YElp-backgroundColor', color)
}

// 容器尺寸监控
const sectionRef = ref(null)
const { width, height } = useElementSize(sectionRef, {
  debounce: 100,  // 添加100ms的防抖
  box: 'border-box'  // 使用border-box盒模型计算尺寸
})
// 尺寸锁定状态
const isLocked = ref(false)

// 组件选择
const curComponent = ref(props.examples.find(item => item.default)?.value || "")
const handleComponentChange = (value) => {
  console.log('切换组件:', value);
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px 50px;
  margin: 0 auto;

  .config-item {
    display: flex;
    align-items: center;

    &::before{
      display: inline-block;
      width: 2px;
      height: 20px;
      margin-right: 10px;
      content: '';
      background-color: #1b1717;
      border-radius: 50%;
    }

    span {
      margin-right: 10px;
      font-size: 14px;
    }

    .size-info {
      min-width: 120px; // 添加最小宽度防止数字变化时的抖动
      padding: 2px 6px;
      font-family: monospace;
      text-align: center; // 文字居中
      background-color: #f5f7fa;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
    }
  }

  .demo-section {
    position: relative;
    z-index: 1;
    box-sizing: border-box; // 确保padding和border不会影响整体尺寸计算
    width: 1000px;
    height: 800px;
    padding: 20px;
    margin-bottom: 30px;
    overflow: auto;
    resize: both;
    border: 2px solid #000;
    border-radius: 0;
    transition: background-color 0.3s; // 只对背景色变化添加过渡

    &.is-locked {
      overflow: auto;
      resize: none;
    }
  }
}
</style>
