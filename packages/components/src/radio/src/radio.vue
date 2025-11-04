<template>
  <el-radio-group v-model="radioValue" class="y-radio" v-bind="$attrs">
    <template v-for="option in compOptions" :key="option.value">
      <component :is="comName" v-bind="option">
        <slot v-bind="option">
          {{ option.label }}
        </slot>
      </component>
    </template>
  </el-radio-group>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import type { RadioProps, RadioOption } from './radio';
import { ElRadio, ElRadioButton } from 'element-plus';
import { isPlainObject } from 'lodash-es';

defineOptions({
  name: 'YRadio',
  inheritAttrs: true
});

const props = withDefaults(defineProps<RadioProps>(), {
  options: () => [],
  childType: 'radio',
  modelValue: '',
  disabledMethod: undefined
});

const comName = computed(() => {
  return props.childType === 'radio' ? ElRadio : ElRadioButton;
});

const compOptions = computed(() => {
  return props.options.map((option: RadioOption) => {
    let newOption: any;
    if (isPlainObject(option)) {
      newOption = option;
    } else {
      newOption = { label: String(option), value: option };
    }
    if (newOption.disabled === undefined && props.disabledMethod) {
      newOption.disabled = props.disabledMethod(option);
    }
    return newOption;
  });
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean];
  change: [value: string | number | boolean];
}>();

const radioValue = computed({
  get: () => props.modelValue,
  set: (value: string | number | boolean) => {
    emit('update:modelValue', value);
    emit('change', value);
  }
});
</script>
