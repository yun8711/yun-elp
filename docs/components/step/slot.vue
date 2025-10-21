<template>
  <y-step :steps="steps" :active-index="1">
    <template #default="{ step, index, active }">
      <div :style="{ color: active ? 'red' : '' }">
        <span>{{ step }}</span>
      </div>
    </template>
  </y-step>
</template>

<script setup>
import { ref } from 'vue'
const steps = ref(['步骤1', '步骤2', '步骤3'])
</script>
