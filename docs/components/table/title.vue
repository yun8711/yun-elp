<template>
  <y-table title="用户列表" :data="tableData" :show-footer="false">
    <template #title-right>
      <el-button type="primary">新增</el-button>
    </template>
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="address" label="地址" />
  </y-table>

  <el-divider />

  <y-table :data="tableData" :show-footer="false">
    <template #title>
      <span class="table-title">
        <el-tag>自定义</el-tag>
        <span>成员</span>
      </span>
    </template>
    <template #title-right>
      <el-button>导出</el-button>
    </template>
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="address" label="地址" />
  </y-table>
</template>

<script lang="ts" setup>
const tableData = [
  { name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { name: 'Jerry', address: 'No. 190, Grove St, Los Angeles' }
]
</script>

<style scoped>
.table-title {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
</style>
