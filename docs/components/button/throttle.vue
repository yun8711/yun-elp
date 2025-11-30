<template>
  <y-button color="gray" @click="count++" model="throttle">delay默认300，回调次数：{{ count }}</y-button>

  <y-button plain @click="count2++" model="throttle" :delay="1000">delay=1000，回调次数：{{ count2 }}</y-button>

</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const count = shallowRef(0)
const count2 = shallowRef(0)
</script>
