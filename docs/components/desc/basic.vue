<template>
  <y-desc :data="data" :config="config" />

  <el-divider />

  <y-desc :data="data" :config="config" border />
</template>

<script setup>
import { ref } from 'vue'

const data = ref({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  phone: '13800138000',
  department: '技术部',
  position: '前端工程师',
  salary: '15000',
  addresses: [
    {
      address: '北京市朝阳区某某街道某某小区北京市朝阳区某某街道某某小区北京市朝阳区某某街道某某小区',
      phone: '13800138000',
      email: 'zhangsan@example.com'
    },
    {
      address: '北京市海淀区某某街道某某小区',
      phone: '13800138001',
    }
  ],
})

const config = ref([
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email' },
  { label: '电话', path: 'phone' },
  { label: '部门', path: 'department' },
  { label: '职位', path: 'position' },
  { label: '薪资', path: 'salary' },
  { label: '地址1', path: 'addresses[0].address' },
  { label: '地址2', path: 'addresses[1].address' }
])
</script>
