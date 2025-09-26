<template>
  <div>
    <y-radio v-model="value" :options="options" @change="changeHandle"></y-radio>
  </div>

  <div style="margin-top: 20px">
    <y-radio
      v-model="value"
      :options="options"
      :disabled-method="disabledMethod"
      @change="changeHandle"
      child-type="button"
    ></y-radio>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(1);

const options = ref([
  { label: '选项1', value: 1 },
  { label: '选项2', value: 2 },
  { label: '选项3', value: 3 }
]);

const disabledMethod = (option: any) => {
  return option.value === 2;
};

const changeHandle = (value: number) => {
  console.log(value);
};
</script>
