<template>
  <y-cron-picker v-model="cronValue" :clearable="true" placeholder="请选择Cron表达式" @change="handleChange"
    @confirm="handleConfirm" />


  <el-input v-model="editCronValueTrunk" clearable></el-input>


  <el-popover trigger="click">
    <template #reference>
      <el-input v-model="editCronValueTrunk"></el-input>
    </template>
  </el-popover>
</template>

<script setup>
import { ref } from '@vue/runtime-core'

const cronValue = ref('')
const editCronValueTrunk = ref('')
const placeholder = ref('请选择Cron表达式')
const clearable = ref(true)

const handleChange = (value) => {
  console.log(value)
}

const handleConfirm = (value) => {
  console.log(value)
}
</script>
