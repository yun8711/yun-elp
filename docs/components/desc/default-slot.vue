<template>
  <y-desc :data="data" :config="config" :column="2">
    <template #label="{ item }">
      <el-icon><Warning /></el-icon>
      {{ item.label }}
    </template>
    <template #content="{ item, index }">
      <el-tag type="success" v-if="index % 2 === 0">{{ item.content || '默认内容' }}</el-tag>
      <span v-else>{{ item.content || '默认内容' }}</span>
    </template>
  </y-desc>
</template>

<script setup>
import { ref } from 'vue'
import { Warning } from '@element-plus/icons-vue'

const data = ref({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  phone: '13800138000',
  department: '技术部',
  position: '前端工程师'
})

const config = ref([
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email' },
  { label: '电话', path: 'phone' },
  { label: '部门', path: 'department' },
  { label: '职位', path: 'position' }
])
</script>
