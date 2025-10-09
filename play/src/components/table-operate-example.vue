<template>
  <y-table :data="tableData">
    <y-column-text prop="name" label="姓名" />
    <y-column-operation label="按钮组" :options="options0" />
  </y-table>

  <el-button type="primary" :loading="loading" text @click="loading = !loading">123</el-button>

  <!-- <el-link type="primary" v-loading="loading" @click="loading = !loading">123</el-link> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);

const tableData = ref([
  {
    name: '张三'
  },
  {
    name: '李四'
  }
]);

const options0 = ref([
  {
    prop: 'view',
    label: '详情'
  },
  {
    prop: 'edit',
    label: '编辑'
  },
  {
    prop: 'copy',
    label: '复制'
  },
  {
    prop: 'delete',
    label: '删除',
    dropdown: true
  }
]);
</script>
