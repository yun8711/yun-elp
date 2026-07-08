<template>
  <div>
    <h3>基础用法</h3>
    <y-cron-picker v-model="cronValue" @change="handleChange" />

    <h3>带默认周期</h3>
    <y-cron-picker v-model="cronValue2" :default-period="'HOUR'" @confirm="handleConfirm" />

    <h3>禁用某些周期</h3>
    <y-cron-picker v-model="cronValue3" :disabled-period="['YEAR', 'MONTH']" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const cronValue = ref('')
const cronValue2 = ref('')
const cronValue3 = ref('')

const handleChange = (value: string) => {
  console.log('Cron changed:', value)
}

const handleConfirm = (period: string) => {
  console.log('Period confirmed:', period)
}
</script>
