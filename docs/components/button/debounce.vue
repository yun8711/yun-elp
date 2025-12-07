<template>
  <y-button type="danger" @click="count++" model="debounce">delay默认300，回调次数：{{ count }}</y-button>

  <y-button type="success" @click="count2++" model="debounce" :delay="1000"
    :max-wait="3000">delay=1000,max-wait=3000，回调次数：{{ count2 }}</y-button>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const count = shallowRef(0)
const count2 = shallowRef(0)
</script>
