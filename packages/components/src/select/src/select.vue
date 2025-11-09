<template>
  <el-select ref="selectRef" v-model="modelValue" v-bind="$attrs">
    <!-- 透传所有插槽到 el-select -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot v-bind="slotData" :key="name" :name="name" />
    </template>

    <!-- 如果没有提供插槽，则渲染选项 -->
    <template v-if="!$slots.default">
      <!-- 渲染分组选项 -->
      <template v-if="optionGroups.length > 0">
        <el-option-group
          v-for="group in optionGroups"
          :key="group.label"
          :label="group.label"
          :disabled="group.disabled"
          v-bind="group"
        >
          <el-option
            v-for="option in getOptions(group.options || [])"
            :key="option.value"
            v-bind="option"
          />
        </el-option-group>
      </template>

      <!-- 渲染普通选项 -->
      <template v-else-if="options.length > 0">
        <el-option v-for="option in getOptions(options)" :key="option.value" v-bind="option" />
      </template>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { computed, ref } from '@vue/runtime-core';
import type { YSelectProps, SelectOption, SelectEmits } from './select';
import { isPlainObject } from 'lodash-es';

defineOptions({
  name: 'YSelect',
  inheritAttrs: true
});

const props = withDefaults(defineProps<YSelectProps>(), {
  options: () => [],
  optionGroups: () => [],
  disabledMethod: undefined
});

const getOptions = (options: SelectOption[]) => {
  return (
    options?.map(option => {
      let newOption = option;
      if (isPlainObject(option)) {
        newOption = option;
      } else {
        newOption = { label: option, value: option };
      }

      if (newOption.disabled === undefined && props.disabledMethod) {
        newOption.disabled = props.disabledMethod(newOption);
      }

      return newOption;
    }) || []
  );
};

const emit = defineEmits<SelectEmits>();

// 计算属性
const modelValue = computed({
  get: () => (props as any).modelValue,
  set: (value: any) => emit('update:modelValue', value)
});

// 获取 el-select 的引用
const selectRef = ref();

// 自动代理 el-select 的所有方法
defineExpose(
  new Proxy({}, {
    get: (_target, key) => selectRef.value?.[key as keyof typeof selectRef.value],
    has: (_target, key) => key in (selectRef.value || {})
  })
);
</script>
