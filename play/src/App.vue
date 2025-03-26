<template>
  <div class="container">
    <h1>KD-ELP 组件库国际化测试</h1>

    <!-- 语言切换按钮 -->
    <div class="language-switch">
      <span>切换语言：</span>
      <el-radio-group v-model="locale" @change="handleLocaleChange">
        <el-radio value="zh-CN">简体中文</el-radio>
        <el-radio value="en-US">English</el-radio>
      </el-radio-group>
    </div>

    <!-- 使用KD-ELP的ConfigProvider -->
    <k-config-provider :locale="locale" :key="locale">
      <!-- 组件国际化演示 -->
      <section class="demo-section">
        <!-- <h2>{{ t('common.button') }}</h2> -->
        <div class="demo-buttons">
          <k-button></k-button>
        </div>
        <div>
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

// 切换语言
const handleLocaleChange = (newLocale) => {
  console.log('切换语言为:', newLocale);
  locale.value = newLocale;
};

// 展示的国际化文本键值
const i18nKeys = [
  'common.button',
  'common.loading',
  'common.search',
  'common.i18n',
  'button.default',
  'button.primary',
  'button.success'
];

const input = ref('');
</script>

<style lang="scss" scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    font-size: 24px;
    color: #303133;
    margin-bottom: 30px;
  }

  .language-switch {
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    span {
      margin-right: 10px;
    }
  }

  .demo-section {
    margin-bottom: 30px;

    h2 {
      font-size: 18px;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
    }

    .demo-buttons {
      .k-button {
        margin-right: 12px;
        margin-bottom: 12px;
      }
    }

    .demo-input {
      margin-top: 16px;
      margin-bottom: 16px;

      p {
        margin-bottom: 8px;
      }
    }

    .i18n-table {
      width: 100%;

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        border: 1px solid #ebeef5;
        padding: 10px;
        text-align: left;
      }

      th {
        background-color: #f5f7fa;
      }
    }

    ol {
      padding-left: 20px;

      li {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
