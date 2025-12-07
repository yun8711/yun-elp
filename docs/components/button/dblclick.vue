<template>
  <y-button @click="onClick" @dblclick="onDblclick" type="primary">
    基础单双击测试：单击计数: {{ clickCount }}，双击计数: {{ dblclickCount }}
  </y-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const clickCount = ref(0);
const dblclickCount = ref(0);

const onClick = () => {
  clickCount.value++;
};

const onDblclick = () => {
  dblclickCount.value++;
};
</script>
