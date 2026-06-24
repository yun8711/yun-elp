<template>
  <div class="container">
    <header class="page-header">
      <h1>YUN-ELP 组件调试</h1>
      <p>左侧渲染组件，右侧控制环境、容器和示例切换。</p>
    </header>

    <div class="workspace">
      <aside class="control-sidebar">
        <div class="control-panel">
          <section class="control-group">
            <div class="control-group__header">
              <h2>示例切换</h2>
            </div>
            <div class="control-grid control-grid--single">
              <div class="control-item control-item--full">
                <span class="control-item__label">组件</span>
                <el-select
                  v-model="curComponent"
                  placeholder="选择要查看的组件"
                  :options="examples"
                  @change="handleComponentChange">
                </el-select>
              </div>
            </div>
          </section>

          <section class="control-group">
            <div class="control-group__header">
              <h2>调试环境</h2>
            </div>
            <div class="control-grid control-grid--single">
              <div class="control-item">
                <span class="control-item__label">多语言</span>
                <el-select v-model="localeModel">
                  <el-option
                    label="简体中文"
                    value="zh-cn" />
                  <el-option
                    label="English"
                    value="en" />
                </el-select>
              </div>

              <div class="control-item">
                <span class="control-item__label">主题</span>
                <el-select v-model="themeModel">
                  <el-option
                    label="KD"
                    value="kd" />
                  <el-option
                    label="Arco"
                    value="arco" />
                  <el-option
                    label="Antd"
                    value="antd" />
                </el-select>
              </div>
            </div>
          </section>

          <section class="control-group">
            <div class="control-group__header">
              <h2>容器调试</h2>
            </div>
            <div class="control-grid control-grid--single">
              <div class="control-item">
                <span class="control-item__label">容器尺寸</span>
                <span class="size-info">{{ Math.round(width) }} x {{ Math.round(height) }}px</span>
              </div>

              <div class="control-item">
                <span class="control-item__label">缩放控制</span>
                <el-switch
                  v-model="isLocked"
                  active-text="锁定"
                  inactive-text="解锁" />
              </div>

              <div class="control-item">
                <span class="control-item__label">背景色</span>
                <div class="control-item__inline">
                  <el-color-picker
                    v-model="backgroundColor"
                    show-alpha
                    @change="handleBackgroundColorChange" />
                  <span class="color-value">{{ backgroundColor }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="control-group">
            <div class="control-group__header">
              <h2>参考文档</h2>
            </div>
            <div class="control-grid control-grid--single">
              <div class="control-item control-item--full">
                <span class="control-item__label">Element Plus</span>
                <el-link
                  type="primary"
                  href="https://element-plus.org/zh-CN/"
                  target="_blank"
                  class="doc-link"
                  >打开文档<el-icon><Link /></el-icon
                ></el-link>
              </div>
            </div>
          </section>
        </div>
      </aside>

      <div class="stage-panel">
        <section
          ref="sectionRef"
          class="demo-section"
          :class="{ 'is-locked': isLocked }"
          :style="{ backgroundColor }">
          <slot
            :locale="localeModel"
            :backgroundColor="backgroundColor"
            :curComponent="curComponent"></slot>
        </section>
      </div>
    </div>
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

  .page-header {
    margin-bottom: 18px;

    h1 {
      margin: 0 0 6px;
      font-size: 28px;
      font-weight: 700;
      color: #111827;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }
  }

  .workspace {
    display: grid;
    grid-template-columns: 340px minmax(0, 1fr);
    gap: 18px;
    align-items: start;
  }

  .stage-panel {
    min-width: 0;
  }

  .stage-panel__header {
    display: flex;
    align-items: flex-end;
    padding: 0 0 12px;

    h2 {
      margin: 4px 0 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
  }

  .stage-panel__eyebrow {
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .control-sidebar {
    position: sticky;
    top: 20px;
  }

  .control-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
    background: #fbfcfe;
    border: 1px solid #d8dee9;
    border-radius: 12px;
  }

  .control-group__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 1px solid #e7ebf3;

    h2 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .control-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    &--single {
      grid-template-columns: 1fr;
    }
  }

  .control-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;

    &--full {
      grid-column: 1 / -1;
    }

    :deep(.el-select),
    :deep(.el-input),
    :deep(.el-input-number) {
      width: 100%;
    }
  }

  .control-item__label {
    font-size: 12px;
    font-weight: 600;
    color: #5b6472;
  }

  .control-item__inline {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;

    &--between {
      justify-content: space-between;
    }
  }

  .color-value {
    padding: 4px 8px;
    font-family: monospace;
    font-size: 12px;
    color: #4b5563;
    background: #f0f3f8;
    border: 1px solid #dde3ee;
    border-radius: 6px;
  }

  .size-info {
    min-width: 120px;
    padding: 6px 10px;
    font-family: monospace;
    font-size: 12px;
    text-align: center;
    background-color: #f0f3f8;
    border: 1px solid #dde3ee;
    border-radius: 6px;
  }

  .doc-link {
    align-self: flex-start;
    font-weight: 600;
    line-height: 32px;
  }

  :deep(.el-select__wrapper),
  :deep(.el-input__wrapper),
  :deep(.el-input-number),
  :deep(.el-color-picker__trigger),
  :deep(.el-switch) {
    border-radius: 8px;
  }

  .demo-section {
    position: relative;
    z-index: 1;
    box-sizing: border-box; // 确保padding和border不会影响整体尺寸计算
    width: 100%;
    min-width: 0;
    height: 800px;
    padding: 20px;
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

  @media (max-width: 1100px) {
    .workspace {
      grid-template-columns: 1fr;
    }

    .control-sidebar {
      position: static;
    }
  }

  @media (max-width: 900px) {
    padding: 20px;

    .stage-panel__header {
      flex-direction: column;
      align-items: flex-start;
    }

    .control-grid {
      grid-template-columns: 1fr;
    }

    .control-item__inline--between {
      align-items: flex-start;
      justify-content: flex-start;
    }

    .demo-section {
      width: 100%;
      min-height: 560px;
      height: auto;
    }
  }
}
</style>
