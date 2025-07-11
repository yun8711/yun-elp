<template>
  <y-label label="用户名">
    <template #prefix>
      <el-tooltip class="box-item" effect="dark" content="前置插槽" placement="top">
        <el-icon>
          <WarningFilled />
        </el-icon>
      </el-tooltip>
    </template>
    admin
    <template #suffix>
      <el-tooltip class="box-item" effect="dark" content="后置插槽" placement="right">
        <el-icon>
          <WarningFilled />
        </el-icon>
      </el-tooltip>
    </template>
  </y-label>
</template>

<script setup>
import {WarningFilled} from "@element-plus/icons-vue"
</script>
