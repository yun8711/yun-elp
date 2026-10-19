<template>
  <div>
    <y-group-select v-model="selectedValue" active-type="plain" :options="options" />
    <p>选中值: {{ selectedValue }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GroupSelectOption } from '@yun-elp/components'

const options: GroupSelectOption[] = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
]

const selectedValue = ref('1')
</script>
