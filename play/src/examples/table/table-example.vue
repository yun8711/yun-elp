<template>
  <y-table :data="tableData2">
    <!-- 基础文本 -->
    <y-column-text
      prop="name"
      label="姓名" />

    <!-- 链接态与点击事件 -->
    <y-column-text
      prop="name"
      label="可点击"
      :link="true"
      @click="onRowClick" />

    <!-- 自定义格式化显示 -->
    <y-column-text
      prop="age"
      label="年龄(格式化)"
      :formatter="formatAge" />

    <!-- 文本样式 -->
    <y-column-text
      prop="address"
      label="自定义文本样式"
      :text-style="{ color: 'red', fontSize: '16px', fontWeight: '600' }" />

    <!-- 溢出 Tooltip 与禁用 -->
    <y-column-text
      prop="desc"
      label="tooltip(默认)" />
    <y-column-text
      prop="desc"
      label="无tooltip"
      no-tip />

    <!-- 自定义插槽 -->
    <y-column-text prop="status">
      <template #default="{ value }">
        <el-tag :type="value === 'active' ? 'success' : 'warning'">{{ value }}</el-tag>
      </template>
    </y-column-text>

    <!-- 配合y-text-tooltip自定义tooltip，注意要禁用column本身的tooltip -->
    <y-column-text
      prop="desc"
      label="自定义tooltip"
      no-tip>
      <template #default="{ value }">
        <y-text-tooltip
          :lineClamp="2"
          placement="top-end">
          {{ value }}
        </y-text-tooltip>
      </template>
    </y-column-text>
  </y-table>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const tableData2 = [
  { name: '张三', age: 25, address: '杭州市拱墅区', desc: '这是一段较长的描述文本，用于演示溢出提示这是一段较长的描述文本，用于演示溢出提示这是一段较长的描述文本，用于演示溢出提示', status: 'active' },
  { name: '李四', age: 30, address: '苏州市吴中区', desc: '短文案', status: 'inactive' }
]

const onRowClick = (row: any, _formattedValue?: any, _scope?: any, _event?: any) => {
  console.log('row clicked:', row.name)
  ElMessage.success(`点击了：${row.name}`)
}

const formatAge = (value: any) => `${value} 岁`
</script>
