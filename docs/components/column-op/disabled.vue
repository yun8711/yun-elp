<template>
  <y-table :data="tableData">
    <y-column-text prop="name" label="姓名" />
    <!-- 禁用但不显示提示文案 -->
    <y-column-op label="无tooltip" :options="options4" />
    <!-- 禁用并显示默认提示文案 -->
    <y-column-op label="默认tooltip" :options="options4" disabledDefaultTip="无权限" />
    <!-- 禁用并自定义提示文案 -->
    <y-column-op label="动态tooltip" :options="options5" />
  </y-table>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const tableData = ref([
  {
    id: '1',
    name: '老刘',
    age: '80',
    gender: '男',
    status: 'START'
  },
  {
    id: '2',
    name: '小刘',
    age: '8',
    gender: '女',
    status: 'STOP'
  }
]);

const options4 = ref([
  {
    prop: 'edit',
    label: '编辑',
    disabled: true
  }
]);

const options5 = ref([
  {
    prop: 'edit',
    label: '编辑',
    disabled: [true, '自定义提示']
  },
  {
    prop: 'edit2',
    label: '编辑2',
    disabled: (scope, item) => {
      if (scope.row.status === 'STOP') {
        return [true, '停止状态不可编辑'];
      } else {
        return false;
      }
    }
  }
]);
</script>
