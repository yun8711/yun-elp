<template>
  <div style="position:relative;height:100px;border:1px solid red;">
    <y-page-footer
      :model="model"
      class="page-footer">
      <y-button @click="handleClick">{{ model === 'fixed' ? '相对父元素' : '相对页面' }}</y-button>
    </y-page-footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const model = ref<'fixed' | 'absolute'>('absolute');

const handleClick = () => {
  model.value = model.value === 'fixed' ? 'absolute' : 'fixed';
}
</script>

<style scoped>
.page-footer {
  background-color: #eee;
}
</style>
