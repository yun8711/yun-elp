<template>
  <div>
    <y-button @click="openDialog">打开drawer</y-button>

    <y-drawer v-model="dialogVisible" title="drawer测试" @confirm="handleConfirm" @cancel="handleCancel">
      <div style="height: 500px;background-color: yellow;">这是 drawer 的内容</div>
      <div style="height: 500px;background-color:green;">这是 drawer 的内容</div>
      <div style="height: 500px;background-color:red;">这是 drawer 的内容</div>
    </y-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

const openDialog = () => {
  dialogVisible.value = true
}

const handleConfirm = () => {
  ElMessage.success('确认操作')
  dialogVisible.value = false
}

const handleCancel = () => {
  ElMessage.error('取消操作')
  dialogVisible.value = false
}
</script>
