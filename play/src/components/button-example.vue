<template>

  <y-button type="primary" size="small" ref="yButtonRef" @click="handleClick">按钮</y-button>
  <y-button type="primary">按钮</y-button>
  <y-button type="primary" loading size="large">按钮</y-button>
  <y-button type="primary" link>按钮</y-button>


  <el-button ref="elButtonRef" @click="handleClick2" size="small">el-button</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const yButtonRef = ref<InstanceType<typeof YButton>>()
const elButtonRef = ref<InstanceType<typeof ElButton>>()

function handleClick() {
  console.log(yButtonRef.value?.ref)
}
function handleClick2() {
  console.log(elButtonRef.value.size)
  console.log(elButtonRef.value.ref)
}
</script>
