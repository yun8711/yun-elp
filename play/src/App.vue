<template>
  <div class="container">
    <h1>KD-ELP 组件库国际化测试</h1>

    <!-- 语言切换按钮 -->
    <div class="language-switch">
      <span>切换语言：</span>
      <el-radio-group v-model="currentLocale" @change="handleLocaleChange">
        <el-radio label="zh-CN">简体中文</el-radio>
        <el-radio label="en-US">English</el-radio>
      </el-radio-group>
    </div>

    <!-- 使用KD-ELP的ConfigProvider -->
    <k-config-provider :locale="currentLocale">
      <!-- 组件国际化演示 -->
      <section class="demo-section">
        <h2>{{ t('common.button') }}</h2>
        <div class="demo-buttons">
          <k-button>{{ t('button.default') }}</k-button>
          <k-button type="primary">{{ t('button.primary') }}</k-button>
          <k-button type="success">{{ t('button.success') }}</k-button>
        </div>
      </section>

      <!-- 国际化文本键值展示 -->
      <section class="demo-section">
        <h2>{{ t('common.i18n') }}</h2>
        <div class="i18n-table">
          <table>
            <thead>
              <tr>
                <th>{{ t('i18n.key') }}</th>
                <th>{{ t('i18n.value') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="key in i18nKeys" :key="key">
                <td>{{ key }}</td>
                <td>{{ t(key) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- VoerkaI18n使用说明 -->
      <section class="demo-section">
        <h2>VoerkaI18n集成说明</h2>
        <p>在实际项目中，我们将使用VoerkaI18n库来实现国际化，需要：</p>
        <ol>
          <li>安装VoerkaI18n: <code>npm install @voerkai18n/vue</code></li>
          <li>创建语言包和配置</li>
          <li>在应用程序中初始化VoerkaI18n</li>
          <li>可参考VoerkaI18n文档实现更复杂的国际化功能</li>
        </ol>
      </section>
    </k-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLocale, setLocale, LocaleType } from '@kd-elp/components';

// 获取国际化翻译方法
const { t } = useLocale();

// 当前语言
const currentLocale = ref<LocaleType>('zh-CN');

// 切换语言
const handleLocaleChange = (locale: LocaleType) => {
  setLocale(locale);
};

// 展示的国际化文本键值
const i18nKeys = [
  'common.button',
  'common.loading',
  'common.i18n',
  'button.default',
  'button.primary',
  'button.success'
];
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
