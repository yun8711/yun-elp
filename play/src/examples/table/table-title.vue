<template>
  <div class="table-title-demo">
    <y-table title="用户列表" :data="tableData" :pagination-props="{ total: 2 }">
      <template #title-right>
        <el-button type="primary">新增</el-button>
      </template>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
    </y-table>

    <y-table :data="tableData" :show-footer="false">
      <template #title>
        <span class="table-title-demo__custom">
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
  </div>
</template>

<script lang="ts" setup>
const tableData = [
  { name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { name: 'Jerry', address: 'No. 190, Grove St, Los Angeles' }
]
</script>

<style scoped>
.table-title-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.table-title-demo__custom {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
</style>
