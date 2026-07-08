<template>
  <div :class="ns.b()">
    <div
      v-for="(step, index) in computedOptions"
      :key="index"
      :class="[ns.e('item'), { [ns.is('active')]: index <= activeIndex }]"
    >
      <slot name="default" :step="step" :index="index" :active="index <= activeIndex">
        <div :class="[ns.e('item-content'), { [ns.is('inline')]: inlineLabel }]">
          <div :class="ns.e('item-index')">{{ index + 1 }}</div>
          <div v-if="step" :class="ns.e('item-label')">
            {{ step }}
          </div>
        </div>
      </slot>
      <div
        v-if="index < computedOptions.length - 1"
        :class="[ns.e('item-line'), { [ns.is('active')]: index < activeIndex }]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import type { StepProps } from './step';
import { useNamespace } from '../../../hooks/use-namespace';

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
const ns = useNamespace('step');

const { steps, activeIndex, inlineLabel, stepNumber } = toRefs(props);

// 如果没有steps，则根据stepNumber生成steps，不展示文本
const computedOptions = computed(() => {
  if (steps.value.length > 0) {
    return steps.value;
  }
  return Array.from({ length: stepNumber.value }, () => null);
});
</script>
