<template>
  <y-step :style="{ '--line-width': '2px' }" :steps="steps" :active-index="activeIndex" :inline-label="false" />

  <!-- 使用steps属性定义步骤内容 -->
  <y-step :steps="steps" :active-index="activeIndex" />

  <!-- 使用stepNumber属性定义步骤数量 -->
  <y-step :step-number="3" />

  <!-- 使用插槽定义每个step的内容 -->
  <y-step :steps="steps" :active-index="1">
    <template #default="{ step, index, active }">
      <div :style="{ color: active ? 'red' : '' }">
        <span>{{ step }}</span>
      </div>
    </template>
  </y-step>

  <y-step :style="{ '--line-width': '3px', '--active-color': 'red', '--active-text-color': 'blue' }" :steps="steps" :active-index="1" />
</template>

<script setup>
import { ref } from 'vue'

const steps = ref(['步骤1', '步骤2', '步骤3'])

const activeIndex = ref(1)
</script>
