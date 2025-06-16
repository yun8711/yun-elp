<template>
  <y-border-label label="用户名" no-border>
    <el-input v-model="input" placeholder="请输入用户名" />
  </y-border-label>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
</script>