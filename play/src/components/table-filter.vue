<template>

  <y-table :data="tableData2">
    <!-- 基础文本 -->
    <!-- 基础文本展示 -->
    <y-column-text prop="name" label="姓名" />

    <!-- 筛选+状态展示 -->
    <y-column-filter prop="status" label="筛选+状态" :config="config" :formatter="formatter2" />

    <!-- 只筛选不展示状态 -->
    <y-column-filter prop="status" label="只展示筛选" :config="config" no-status />

    <!-- 只展示状态不筛选 -->
    <y-column-filter prop="status" label="只展示状态" :config="config" no-filter />
  </y-table>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { toRaw } from 'vue'

const tableData2 = [
  { name: '张三', age: 25, address: '杭州市拱墅区', desc: '这是一段较长的描述文本，用于演示溢出提示这是一段较长的描述文本，用于演示溢出提示这是一段较长的描述文本，用于演示溢出提示', status: 'active' },
  { name: '李四', age: 30, address: '苏州市吴中区', desc: '短文案', status: 'inactive' }
]

const formatter = (value: any) => {
  return value === 'active' ? '启用' : '禁用'
}

const config = [
  {
    text: '禁用',
    value: 'inactive',
    color: 'rgb(54, 94, 223)',
    bgColor: 'rgb(234, 238, 251)'
  },
  {
    text: '启用',
    value: 'active',
    color: 'green',
    bgColor: 'yellow'
  }
]

const formatter2 = (value: any) => {
  return value === 'active' ? '启用2' : '禁用2'
}
</script>
