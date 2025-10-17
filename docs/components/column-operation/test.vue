<template>
  <y-table :data="tableData">
    <y-column-text prop="name" label="姓名" />
    <y-column-operation label="label函数" :options="options1" />
    <y-column-operation label="显示/隐藏" :options="options2" />
    <y-column-operation label="按钮组" :options="options3" />
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

const options1 = ref([
  {
    prop: 'view',
    label: scope => {
      return scope.row.name + '详情';
    },
    confirm: scope => {
      ElMessage.success('This is a message.');
    }
  }
]);

const options2 = ref([
  {
    prop: 'button1',
    label: '按钮1',
    show: (scope, item) => {
      return scope.row.status === 'START';
    }
  },
  {
    prop: 'button2',
    label: '按钮2',
    show: (scope, item) => {
      return scope.row.status === 'STOP';
    }
  },
  {
    prop: 'view',
    label: '切换状态',
    confirm: (scope, item) => {
      scope.row.status = scope.row.status === 'START' ? 'STOP' : 'START';
    }
  }
]);

const options3 = ref([
  {
    prop: 'button1',
    label: '按钮1'
  },
  {
    prop: 'button2',
    label: '按钮2',
    dropdown: true
  },
  {
    prop: 'button3',
    label: '按钮3',
    dropdown: true
  }
]);
</script>
