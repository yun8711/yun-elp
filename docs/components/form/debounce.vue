<template>
  <y-form
    :model="form"
    :config="handleFormChange"
    :debounce="debounceMs"
    label-width="120px"
    :span="12"
    :gutter="24"
  >
    <y-form-item label="防抖时间">
      <el-radio-group v-model="debounceMs">
        <el-radio :value="0">0ms（无防抖）</el-radio>
        <el-radio :value="300">300ms</el-radio>
      </el-radio-group>
    </y-form-item>
    <y-form-item label="关键词" prop="keyword">
      <el-input v-model="form.keyword" placeholder="快速输入测试防抖" />
    </y-form-item>
    <y-form-item label="config 调用次数" :span="24">
      <span>{{ configCallCount }}</span>
      <el-button size="small" style="margin-left: 12px" @click="configCallCount = 0"
        >重置计数</el-button
      >
    </y-form-item>
  </y-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ keyword: '' })
const debounceMs = ref(0)
const configCallCount = ref(0)

const handleFormChange = () => {
  configCallCount.value += 1
}
</script>
