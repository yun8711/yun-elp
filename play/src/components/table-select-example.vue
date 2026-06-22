<template>
  <div class="table-example">
    <el-card shadow="never" class="table-example__card">
      <template #header>ColumnSelect 多选</template>
      <y-table
        :data="selectTableData"
        row-key="id"
        @select="onMultipleSelect"
        @selection-change="multipleSelection = $event">
        <y-column-select
          :selectable="isSelectable"
          :disabled-tip="getDisabledTip"
          reserve-selection />
        <y-column-text prop="name" label="姓名" />
        <y-column-text prop="role" label="角色" />
        <y-column-text prop="status" label="状态" />
      </y-table>
      <div class="table-example__result">
        多选结果：{{ multipleSelection.map(item => item.name).join('、') || '暂无' }}
      </div>
    </el-card>

    <el-card shadow="never" class="table-example__card">
      <template #header>ColumnSelect 单选</template>
      <y-table :data="selectTableData" highlight-current-row @current-change="currentRow = $event">
        <y-column-select single :selectable="isSelectable" :disabled-tip="getDisabledTip">
          <template #header>单选</template>
        </y-column-select>
        <y-column-text prop="name" label="姓名" />
        <y-column-text prop="role" label="角色" />
        <y-column-text prop="status" label="状态" />
      </y-table>
      <div class="table-example__result">单选结果：{{ currentRow?.name || '暂无' }}</div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRaw } from 'vue'

type SelectTableRow = {
  id: number
  name: string
  role: string
  status: 'enabled' | 'disabled'
}

const selectTableData: SelectTableRow[] = [
  { id: 1, name: '张三', role: '管理员', status: 'enabled' },
  { id: 2, name: '李四', role: '访客', status: 'disabled' },
  { id: 3, name: '王五', role: '编辑', status: 'enabled' },
]

const multipleSelection = ref<SelectTableRow[]>([])
const currentRow = ref<SelectTableRow>()

const isSelectable = (row: SelectTableRow) => row.status === 'enabled'

const getDisabledTip = ({ row }: { row: SelectTableRow }) => {
  return row.status === 'disabled' ? '当前状态不可选择' : ''
}

const onMultipleSelect = (selection: SelectTableRow[], row: SelectTableRow) => {
  console.log('column-select select:', toRaw(selection), toRaw(row))
}
</script>

<style scoped>
.table-example {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-example__result {
  margin-top: 12px;
  color: var(--el-text-color-regular);
}
</style>
