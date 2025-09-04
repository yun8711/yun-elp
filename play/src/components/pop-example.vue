<template>
  <y-pop tip-content="基本用法">
    <el-button type="primary">基本用法</el-button>
  </y-pop>


  <y-pop tip-content="提示" no-popover>
    <el-button type="primary">只显示tooltip</el-button>
  </y-pop>

  <y-pop>
    <el-button type="primary">只显示popover</el-button>
  </y-pop>


  <el-button type="primary" plain>23</el-button>
  <el-button type="primary" plain>45</el-button>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";



</script>
