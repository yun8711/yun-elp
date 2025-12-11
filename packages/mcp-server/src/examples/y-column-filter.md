### 基础用法

```vue
<template>

  <y-table :data="tableData">
    <!-- 基础文本展示 -->
    <y-column-text prop="name" label="姓名" />

    <!-- 筛选+状态展示 -->
    <y-column-filter prop="status" label="筛选+状态" :config="config" />

    <!-- 只筛选不展示状态 -->
    <y-column-filter prop="status" label="只展示筛选" :config="config" no-status />

    <!-- 只展示状态不筛选 -->
    <y-column-filter prop="status" label="只展示状态" :config="config" no-filter />
  </y-table>
</template>

<script setup lang="ts">
const tableData = [
  { name: '张三', status: 'active' },
  { name: '李四', status: 'inactive' }
]

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
</script>

```
