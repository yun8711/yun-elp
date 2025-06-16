<template>
  <y-border-label>
    <template #prefix>
      <el-icon>
        <User />
      </el-icon>
    </template>
    <template #label>用户名</template>
    <el-input v-model="input" placeholder="请输入用户名" />
    <template #suffix>
      <el-icon>
        <InfoFilled />
      </el-icon>
    </template>
  </y-border-label>
</template>

<script setup>
import { ref } from 'vue'
import { User, InfoFilled } from '@element-plus/icons-vue'

const input = ref('')
</script>