<template>
  <y-button @click="onClick" delay="300" max-wait="1000">测试{{ count }}</y-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0)

const onClick = () => {
  count.value++
}
</script>
