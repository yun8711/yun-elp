<template>
  <div class="y-simple-radio">
    <el-radio-group v-model="radioValue" v-bind="$attrs">
      <template v-for="option in options" :key="option.value">
        <component :is="comName" v-bind="option">
          <slot v-bind="option">
            {{ option.label }}
          </slot>
        </component>
      </template>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import type { SimpleRadioProps } from './simple-radio';
import { ElRadio, ElRadioButton } from 'element-plus';

defineOptions({
  name: 'YSimpleRadio',
  inheritAttrs: true
});

const props = withDefaults(defineProps<SimpleRadioProps>(), {
  options: () => [],
  childType: 'radio',
  modelValue: '',
});

const comName = computed(() => {
  return props.childType === 'radio' ? ElRadio : ElRadioButton;
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean];
  'change': [value: string | number | boolean];
}>();

const radioValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | boolean) => {
    emit('update:modelValue', value);
    emit('change', value);
  }
});
</script>
