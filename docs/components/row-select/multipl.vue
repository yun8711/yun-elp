<template>
  <y-row-select v-model="value" :options="options" @change="changeHandle"></y-row-select>

  <div style="margin-top: 20px;">选中值：{{ value }}</div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

const options = ref([])

for (let i = 0; i < 30; i++){
  options.value.push({
    label: "选项" + i,
    value:i
  })
}


const changeHandle = (val) => {
  console.log(val)
}

</script>
