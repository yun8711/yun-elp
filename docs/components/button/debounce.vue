<template>
  <y-button type="danger" @click="onClick" model="debounce">delay默认300</y-button>

  <y-button type="success" @click="onClick" model="debounce" :delay="1000" :max-wait="3000">delay=1000,max-wait=3000</y-button>

  <div>回调次数：{{ count }}</div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
const count = shallowRef(0)

const onClick = () => {
  count.value++
}
</script>
