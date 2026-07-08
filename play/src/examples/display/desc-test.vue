<template>
  <div>
    <h3>默认插槽测试</h3>
    <y-desc :data="data" :config="config">
      <template #label="{ item }">
        <el-icon><Star /></el-icon>
        <strong>{{ item.label }}</strong>
      </template>
      <template #content="{ item }">
        <el-tag type="success">{{ getDisplayValue(item) }}</el-tag>
      </template>
    </y-desc>

    <h3>混合插槽测试（有prop和无prop）</h3>
    <y-desc :data="data" :config="mixedConfig">
      <template #name-label>
        <em>特殊姓名标签</em>
      </template>
      <template #name-content>
        <el-button type="primary" size="small">{{ data.name }}</el-button>
      </template>
      <template #label="{ item }">
        <span style="color: blue;">{{ item.label }}:</span>
      </template>
      <template #content="{ item }">
        <span style="color: green;">{{ getDisplayValue(item) }}</span>
      </template>
    </y-desc>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Star } from '@element-plus/icons-vue'

const data = ref({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  department: '技术部'
})

const config = ref([
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email' },
  { label: '部门', path: 'department' }
])

const mixedConfig = ref([
  { label: '姓名', path: 'name', prop: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email', prop: 'email' },
  { label: '部门', path: 'department' }
])

const getDisplayValue = (item) => {
  return item.content || (item.path ? data.value[item.path] : '')
}
</script>
