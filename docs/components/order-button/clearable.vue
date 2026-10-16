<template>
  <y-order-button v-model="order" clearable>更新时间</y-order-button>
  <p>当前：{{ order || '未排序' }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const order = ref<'asc' | 'desc' | ''>('');
</script>
