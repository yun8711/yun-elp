<template>
  <y-step
    :style="{ '--step-height': '100px', '--line-width': '3px', '--active-color': 'red', '--active-text-color': 'blue' }"
    :steps="steps" :active-index="1" />
</template>

<script setup>
import { ref } from 'vue'
const steps = ref(['步骤1', '步骤2', '步骤3'])
</script>
