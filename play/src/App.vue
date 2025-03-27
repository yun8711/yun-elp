<template>
  <div class="container">
    <h1>KD-ELP 组件库测试</h1>

    <!-- 语言切换按钮 -->
    <div class="language-switch">
      <span>切换语言：</span>
      <el-radio-group v-model="locale" @change="handleLocaleChange">
        <el-radio value="zh-CN">简体中文</el-radio>
        <el-radio value="en-US">English</el-radio>
      </el-radio-group>
    </div>

    <!-- 展示区域控制 -->
    <div class="display-controls">
      <el-switch
        v-model="showGrid"
        active-text="显示网格"
        inactive-text="隐藏网格"
      />
      <el-color-picker
        v-model="backgroundColor"
        show-alpha
        @change="handleBackgroundChange"
      />
    </div>

    <!-- 使用KD-ELP的ConfigProvider -->
    <k-config-provider :locale="locale" :key="locale">
      <!-- 组件国际化演示 -->
      <section class="demo-section" :class="{ 'show-grid': showGrid }" :style="{ backgroundColor }">
        <k-label label="测试">
          <el-input v-model="input" />
        </k-label>

        <div>
          <el-button>测试</el-button>
          <el-input v-model="input" style="width: 240px" />
        </div>
      </section>
    </k-config-provider>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 当前语言
const locale = ref('zh-CN');

// 网格显示控制
const showGrid = ref(false);

// 背景颜色
const backgroundColor = ref('#ffffff');

// 切换语言
const handleLocaleChange = (newLocale) => {
  console.log('切换语言为:', newLocale);
  locale.value = newLocale;
};

// 切换背景颜色
const handleBackgroundChange = (color) => {
  console.log('背景颜色:', color);
};

const input = ref('');
</script>

<style lang="scss" scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;

  .language-switch {
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    span {
      margin-right: 10px;
    }
  }

  .display-controls {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .demo-section {
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 4px;
    transition: background-color 0.3s;

    &.show-grid {
      background-image: linear-gradient(to right, #f0f0f0 1px, transparent 1px),
                       linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
      background-size: 20px 20px;
    }
  }
}
</style>
