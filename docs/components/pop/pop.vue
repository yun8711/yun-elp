<template>
  <y-pop tip-content="点击触发popover" @confirm="confirm" @cancel="cancel">
    <el-button type="primary">默认popover</el-button>
  </y-pop>

  <y-pop tip-content="点击触发popover" @confirm="confirm" @cancel="cancel" pop-title="自定义popover标题"
    pop-content="自定义popover内容">
    <el-button type="primary">自定义popover文本</el-button>
  </y-pop>

  <y-pop tip-content="点击触发popover">
    <el-button type="primary">自定义popover内容</el-button>
    <template #pop-content>
      <div>自定义popover内容</div>
      <div>自定义popover内容</div>
    </template>
  </y-pop>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
const confirm = () => {
  ElMessage.success('确认');
}
const cancel = () => {
  ElMessage.error('取消');
}
</script>
