<template>
  <y-step :steps="steps" :active-index="1" />

  <el-divider />

  <y-step :step-number="3" :active-index="2" />
</template>

<script setup>
import { ref } from 'vue'
const steps = ref(['步骤1', '步骤2', '步骤3'])
</script>
