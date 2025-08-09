<template>
  <div>
    <y-button @click="openDialog">打开对话框</y-button>

    <y-dialog v-model="dialogVisible" title="dialog测试" width="500px" maxBodyHeight="500px" @confirm="handleConfirm"
      @cancel="handleCancel">
      <div style="height: 500px;background-color: yellow;">这是 drawer 的内容</div>
      <div style="height: 500px;background-color:green;">这是 drawer 的内容</div>
    </y-dialog>
  </div>
</template>

<script setup lang="ts">
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
