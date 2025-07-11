<template>
  <y-label label="用户名" colon=":" height="100px" :label-style="labelStyle" :content-style="contentStyle">
    Yingdu Building, Zhichun Road, BeijingYingdu Building, Zhichun Road, BeijingYingdu Building, Zhichun Road,
    BeijingYingdu Building, Zhichun Road
  </y-label>
</template>

<script setup>
const labelStyle = {
  color: 'red',
  backgroundColor: '#eee',
  justifyContent: 'flex-start',
  alignItems: 'flex-start'
}

const contentStyle = {
  color: 'blue',
  backgroundColor: '#eee',
  justifyContent: 'flex-end',
  alignItems: 'flex-end'
}
</script>
