<template>
  <y-pop tip-content="tooltip提示内容" no-pop>
    <el-button type="primary">测试tooltip</el-button>
  </y-pop>


  <y-pop tip-placement="right" no-pop>
    <el-button type="primary">自定义tooltip</el-button>
    <template #tip-content>
      <div>自定义tooltip内容</div>
      <div>自定义tooltip内容</div>
    </template>
  </y-pop>
</template>

<script setup lang="ts">

</script>
