<template>
  <el-select ref="selectRef" v-model="modelValue" v-bind="$attrs">
    <!-- 透传所有插槽到 el-select -->
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" :key="name" />
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
import type { YSelectProps, SelectOption } from './select';
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

const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

// 计算属性
const modelValue = computed({
  get: () => (props as any).modelValue,
  set: (value: any) => emit('update:modelValue', value)
});

// 获取 el-select 的引用
const selectRef = ref();

// 暴露 el-select 的方法
defineExpose({
  // 聚焦方法
  focus: () => selectRef.value?.focus?.(),
  // 失焦方法
  blur: () => selectRef.value?.blur?.(),
  // 获取当前选中的标签
  getSelectedLabel: () => selectRef.value?.selectedLabel,
  // 获取 el-select 实例，以便访问其他方法
  getSelectInstance: () => selectRef.value
});
</script>
