<template>
  <y-button @click="onClick" delay="300" max-wait="1000">测试{{ count }}，maxWait=1000</y-button>

  <y-button @click="onClick2" delay="300">测试{{ count2 }}，无maxWait</y-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0)

const onClick = () => {
  count.value++
}

const count2 = ref(0)

const onClick2 = () => {
  count2.value++
}
</script>
