<template>
  <y-table :data="tableData" @paginationChange="paginationChange" @select="onSelect">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="date" label="Date" />
    <el-table-column prop="name" label="Name" />
    <el-table-column width="100px" prop="address" label="Address" :tooltip-formatter="tooltipFormatter"
      show-overflow-tooltip />
  </y-table>
</template>

<script lang="ts" setup>
import { toRaw } from 'vue'

const tableData = [
  // {
  //   date: '2016-05-03',
  //   name: 'Tom',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
  // {
  //   date: '2016-05-02',
  //   name: 'Tom',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
  // {
  //   date: '2016-05-04',
  //   name: 'Tom',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
  // {
  //   date: '2016-05-01',
  //   name: 'Tom',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
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
</script>
