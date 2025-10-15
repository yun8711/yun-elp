<template>
  <y-table :data="tableData">
    <y-column-text prop="name" label="姓名" />

    <y-column-operation label="label函数" :options="options1" />
    <y-column-operation label="显示/隐藏" :options="options2" />
    <y-column-operation label="按钮组" :options="options3" />

    <y-column-operation label="tooltip" :options="options4" />
  </y-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const loading = ref(false);

const tableData = ref([
  {
    id: '1',
    name: '老刘',
    age: '80',
    gender: '男',
    status: "START"
  },
  {
    id: '2',
    name: '小刘',
    age: '8',
    gender: '女',
    status: "STOP"
  }
]);

const options1 = ref([
  {
    prop: 'view',
    label: (scope) => {
      return scope.row.name+'详情' ;
    },
    confirm: (scope) => {
      ElMessage.success('This is a message.')
    }
  }
]);

const options2 = ref([
  {
    prop: 'view1',
    label: '详情1'
  },
  {
    prop: 'view',
    label: '详情',
    show: (scope, item) => {
      return scope.row.status === 'START';
    }
  }
]);



const options3 = ref([
  {
    prop: 'edit',
    label: '编辑',
    confirm: (scope,item) => {
      console.log('编辑 confirm', scope,item);
    }
  },
  {
    prop: 'delete',
    label: '删除',
    dropdown: true,
    // disabled: [[true,'无权限']],
    popProps: {
      tipContent: '123',
      popContent: "测试",
      noPop: false
    },
    confirm: (scope,item) => {
      console.log('删除 confirm', scope,item);
    }
  },
  // {
  //   prop: 'delete2',
  //   label: '删除2',
  //   dropdown: true,
  //   disabled: [[true, '无权限']],
  //   popProps: {
  //     tipContent: '123',
  //     popContent: "测试",
  //     noPop: false
  //   }
  // }
]);

const options4 = ref([
  {
    prop: 'edit',
    label: '编辑',
    disabled: true,
  },
]);
</script>
