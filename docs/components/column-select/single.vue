<template>
  <div>
    <y-table
      ref="singleTableRef"
      :data="tableData"
      highlight-current-row
      @current-change="currentRow = $event">
      <y-column-select
        single
        :selectable="isSelectable"
        :disabled-tip="getDisabledTip">
        <template #header>单选</template>
      </y-column-select>
      <y-column-text prop="name" label="姓名" />
      <y-column-text prop="role" label="角色" />
      <y-column-text prop="status" label="状态" />
    </y-table>

    <p>单选结果：{{ currentRow?.name || '暂无' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Row = {
  id: number;
  name: string;
  role: string;
  status: 'enabled' | 'disabled';
};

const tableData: Row[] = [
  { id: 1, name: '张三', role: '管理员', status: 'enabled' },
  { id: 2, name: '李四', role: '访客', status: 'disabled' },
  { id: 3, name: '王五', role: '编辑', status: 'enabled' }
];

const currentRow = ref<Row>();

const isSelectable = (row: Row) => row.status === 'enabled';

const getDisabledTip = ({ row }: { row: Row }) => {
  return row.status === 'disabled' ? '当前状态不可选择' : '';
};
</script>
