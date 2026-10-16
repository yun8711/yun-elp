<template>
  <div>
    <p>三角形</p>
    <y-order-button v-model="order">更新时间</y-order-button>
    <p>{{ order || '未排序' }}</p>

    <p>箭头</p>
    <y-order-button v-model="arrowOrder" icon="arrow">更新时间</y-order-button>
    <p>{{ arrowOrder || '未排序' }}</p>

    <p>按钮组</p>
    <div class="order-group">
      <y-order-button
        v-for="item in fields"
        :key="item.value"
        :model-value="active === item.value ? groupOrder : ''"
        @change="next => onChange(item.value, next)"
      >
        {{ item.label }}
      </y-order-button>
    </div>
    <p>{{ active || '未排序' }} / {{ groupOrder || '无' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const fields = [
  { label: '更新时间', value: 'updateTime' },
  { label: '申请次数', value: 'applyCount' },
  { label: '服务次数', value: 'serviceCount' }
];

const order = ref<'asc' | 'desc' | ''>('desc');
const arrowOrder = ref<'asc' | 'desc' | ''>('asc');
const active = ref('updateTime');
const groupOrder = ref<'asc' | 'desc' | ''>('desc');

function onChange(field: string, next: 'asc' | 'desc' | '') {
  if (!next) {
    active.value = '';
    groupOrder.value = '';
    return;
  }
  active.value = field;
  groupOrder.value = next;
}
</script>

<style scoped>
.order-group {
  display: inline-flex;
  gap: 8px;
}
</style>
