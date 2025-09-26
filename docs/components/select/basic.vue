<template>
  <y-select v-model="value" :options="options" placeholder="请选择选项" />

  <p>选中值: {{ value }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('');

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' }
];
</script>
