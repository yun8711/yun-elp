<template>
  <y-button color="gray" @click="onClick" model="throttle">delay默认300</y-button>

  <y-button plain @click="onClick" model="throttle" :delay="1000">delay=1000</y-button>

  <div>回调次数：{{ count }}</div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
const count = shallowRef(0)

const onClick = () => {
  count.value++
}
</script>
