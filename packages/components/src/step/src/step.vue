<template>
  <div class="y-step">
    <div
      v-for="(step, index) in computedOptions"
      :key="index"
      class="y-step__item"
      :class="{ 'is-active': index <= activeIndex }">
      <slot
        name="default"
        :step="step"
        :index="index"
        :active="index <= activeIndex">
        <div class="y-step__item-content" :class="{ 'is-inline': inlineLabel }">
          <div class="y-step__item-index"> {{ index + 1 }}</div>
          <div v-if="step" class="y-step__item-label"> {{ step }} </div>
        </div>
      </slot>
      <div
        v-if="index < computedOptions.length - 1"
        class="y-step__item-line"
        :class="{ 'is-active': index < activeIndex }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from '@vue/runtime-core';
import type { StepProps } from './step';

defineOptions({
  name: 'YStep',
  inheritAttrs: true
});

const props = withDefaults(defineProps<StepProps>(), {
  steps: () => [],
  activeIndex: 0,
  inlineLabel: true,
  stepNumber: 2
});

const { steps, activeIndex, inlineLabel, stepNumber } = toRefs(props);

// 如果没有steps，则根据stepNumber生成steps，不展示文本
const computedOptions = computed(() => {
  if (steps.value.length > 0) {
    return steps.value;
  }
  return Array.from({ length: stepNumber.value }, () => null);
});
</script>
