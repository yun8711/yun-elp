<template>
  <y-drawer ref="drawerRef" title="测试" />

  <y-button @click="handleClick">open</y-button>
</template>

<script setup>
import { ref } from 'vue';

const drawerRef = ref(null)

const handleClick = () => {
  drawerRef.value.open()
}
</script>
