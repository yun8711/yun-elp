<template>
  <div class="order-group">
    <y-order-button
      v-for="item in fields"
      :key="item.value"
      :model-value="active === item.value ? order : ''"
      @change="next => onChange(item.value, next)"
    >
      {{ item.label }}
    </y-order-button>
  </div>
  <p>当前：{{ active || '未排序' }} / {{ order || '无' }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const fields = [
  { label: '更新时间', value: 'updateTime' },
  { label: '申请次数', value: 'applyCount' },
  { label: '服务次数', value: 'serviceCount' }
];

const active = ref('updateTime');
const order = ref<'asc' | 'desc' | ''>('desc');

function onChange(field: string, next: 'asc' | 'desc' | '') {
  if (!next) {
    active.value = '';
    order.value = '';
    return;
  }
  active.value = field;
  order.value = next;
}
</script>

<style scoped>
.order-group {
  display: inline-flex;
  gap: 8px;
}
</style>
