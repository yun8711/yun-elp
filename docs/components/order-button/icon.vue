<template>
  <y-order-button v-model="caretOrder">三角形</y-order-button>
  <y-order-button v-model="arrowOrder" icon="arrow" style="margin-left: 8px">箭头</y-order-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const caretOrder = ref<'asc' | 'desc' | ''>('asc');
const arrowOrder = ref<'asc' | 'desc' | ''>('desc');
</script>
