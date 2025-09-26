<template>
  <y-select v-model="value" :option-groups="optionGroups" placeholder="请选择城市" />

  <p>选中值: {{ value }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('');

const optionGroups = [
  {
    label: '热门城市',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' }
    ]
  },
  {
    label: '其他城市（已禁用）',
    disabled: true,
    options: [
      { label: '深圳', value: 'shenzhen' },
      { label: '杭州', value: 'hangzhou' },
      { label: '南京', value: 'nanjing' }
    ]
  },
  {
    label: '可选城市',
    options: ['成都', '武汉', '西安']
  }
];
</script>
