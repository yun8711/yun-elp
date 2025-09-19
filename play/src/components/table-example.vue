<template>
  <y-table :data="tableData" @paginationChange="paginationChange" @select="onSelect">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="date" />
    <el-table-column prop="name" label="Name" />
    <!-- <el-table-column prop="address" label="Address" :tooltip-formatter="tooltipFormatter"
      :show-overflow-tooltip="false" /> -->
    <y-column-text prop="address" label="Address" link />

    <y-column-text prop="address" label="Address" no-tip>
      <template #default="scope">
        <y-text-tooltip :text="scope.value">
          <span>{{ scope.value }}</span>
        </y-text-tooltip>
      </template>
    </y-column-text>
  </y-table>

  <y-table :data="tableData2">
    <!-- 基础文本 -->
    <y-column-text prop="name" label="姓名" />

    <!-- 链接态与点击事件 -->
    <y-column-text prop="name" label="可点击" :link="true" @click="onRowClick" />

    <!-- 自定义格式化显示 -->
    <y-column-text prop="age" label="年龄(格式化)" :formatter="formatAge" />

    <!-- 文本样式 -->
    <y-column-text prop="address" label="自定义文本样式" :text-style="{ color: 'red', fontSize: '16px', fontWeight: '600' }" />

    <!-- 溢出 Tooltip 与禁用 -->
    <y-column-text prop="desc" label="tooltip(默认)" />
    <y-column-text prop="desc" label="无tooltip" no-tip />

    <!-- 自定义插槽 -->
    <y-column-text prop="status" label="插槽">
      <template #default="{ value }">
        <el-tag :type="value === 'active' ? 'success' : 'warning'">{{ value }}</el-tag>
      </template>
    </y-column-text>

    <!-- 配合y-text-tooltip自定义tooltip，注意要禁用column本身的tooltip -->
    <y-column-text prop="desc" label="自定义tooltip" no-tip>
      <template #default="{ value }">
        <y-text-tooltip lineClamp="2" placement="top-end">
          {{ value }}
        </y-text-tooltip>
      </template>
    </y-column-text>
  </y-table>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { toRaw } from 'vue'

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los AngelesNo. 189, Grove St, Los AngelesNo. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const tooltipFormatter = (row: any) => {
  return "123"
}

const paginationChange = (obj: { currentPage: number, pageSize: number }) => {
  console.log(obj);
}

const onSelect = (selection: any, row: any) => {
  console.log(toRaw(selection), toRaw(row));
}

const tableData2 = [
  { name: '张三', age: 25, address: '杭州市拱墅区', desc: '这是一段较长的描述文本，用于演示溢出提示这是一段较长的描述文本，用于演示溢出提示这是一段较长的描述文本，用于演示溢出提示', status: 'active' },
  { name: '李四', age: 30, address: '苏州市吴中区', desc: '短文案', status: 'inactive' }
]

const onRowClick = (row: any, formattedValue?: any, scope?: any, event?: any) => {
  console.log('row clicked:', row.name)
  ElMessage.success(`点击了：${row.name}`)
}

const formatAge = (value: any) => `${value} 岁`
</script>
