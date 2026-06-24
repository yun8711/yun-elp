<template>
  <div>
    <y-table
      :data="tableData"
      row-key="id"
      @selection-change="multipleSelection = $event">
      <y-column-select
        :selectable="isSelectable"
        :disabled-tip="getDisabledTip"
        reserve-selection />
      <y-column-text
        prop="name"
        label="姓名" />
      <y-column-text
        prop="role"
        label="角色" />
      <y-column-text
        prop="status"
        label="状态" />
    </y-table>

    <p>多选结果：{{ multipleSelection.map(item => item.name).join('、') || '暂无' }}</p>
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

const multipleSelection = ref<Row[]>([]);

const isSelectable = (row: Row) => row.status === 'enabled';

const getDisabledTip = ({ row }: { row: Row }) => {
  return row.status === 'disabled' ? '当前状态不可选择' : '';
};
</script>
