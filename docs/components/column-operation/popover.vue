<template>
  <y-table :data="tableData">
    <y-column-text prop="name" label="姓名" />
    <y-column-operation label="popover" :options="options6" />
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

const options6 = ref([
  {
    prop: 'delete',
    label: '删除',
    // 默认不显示popover，只有confirm方法生效，表示按钮本身的点击事件
    // noPop: true,
    confirm: (scope, item) => {
      ElMessage.success('确认删除');
    }
  },
  {
    prop: 'delete2',
    label: '删除2',
    dropdown: true,
    // 显示popover时，confirm和cancel方法都生效，表示弹出框的确认和取消事件
    noPop: false,
    popProps: {
      popContent: '是否确认删除该数据？'
    },
    confirm: (scope, item) => {
      ElMessage.success('确认删除');
    },
    cancel: (scope, item) => {
      ElMessage.info('取消删除');
    }
  }
]);
</script>
