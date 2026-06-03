<template>
  <!-- <div> -->
    <y-web-view src="https://example.org/" width="100%" height="100%" :border="border" id="20" @error="handleError" @load="handleLoad"/>
  <!-- </div> -->
</template>

<script setup>
import { ref } from 'vue';

const border = ref('0');

const handleError = (event) => {
  console.log('handleError', event);
}

const handleLoad = (event) => {
  console.log('handleLoad', event);
}
</script>

<style lang="scss" scoped>

</style>
