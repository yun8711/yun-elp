### 基础用法

```vue
<template>
  <div class="wrapper" :style="{ width: `${value}px` }">
    <y-text-tooltip :line-clamp="num" :model="model">
      Self element set width 100px,Self element set width 100px,Self element set width 100px
    </y-text-tooltip>

    <el-divider />

    <y-text-tooltip :line-clamp="num" :model="model">
      DeepSeek R1 模型已完成小版本升级，当前版本为 DeepSeek-R1-0528。用户通过官方网站、APP
      或小程序进入对话界面后，开启“深度思考”功能即可体验最新版本。API 也已同步更新，调用方式不变。
    </y-text-tooltip>
  </div>

  <div class="btn-wrapper">
    <span>width：</span>
    <el-slider style="width: 200px;" v-model="value" :max="1200" :min="10" />
    <span style="margin-left: 20px;">line-clamp：</span>
    <el-input-number v-model="num" :min="1" :max="5" :step="1" />
    <span style="margin-left: 20px;">tooltip：</span>
    <el-select v-model="model" :options="tooltipOptions" style="width: 100px;" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(600);
const num = ref(1);
const model = ref('auto');
const tooltipOptions = ref([
  { label: 'auto', value: 'auto' },
  { label: 'always', value: 'always' },
  { label: 'none', value: 'none' },
]);
</script>

<style scoped>
.wrapper {
  width: 500px;
  padding: 20px;
  border: 1px solid #ccc;
}

.btn-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 50px;
  word-break: normal;
}
</style>

```
