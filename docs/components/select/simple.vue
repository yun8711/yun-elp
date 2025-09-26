<template>
  <y-select v-model="value" :options="options" placeholder="请选择水果" />

  <p>选中值: {{ value }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('');

const options = ['苹果', '香蕉', '橙子', '葡萄', '菠萝'];
</script>
