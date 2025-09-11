<!--
 * @Author: liuyun liuyun.dev@qq.com
 * @Date: 2025-07-28 10:01:33
 * @LastEditors: liuyun liuyun.dev@qq.com
 * @LastEditTime: 2025-09-11 15:01:48
 * @FilePath: /yun-elp/packages/components/src/simple-select/src/simple-select.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
          <el-option v-for="option in group.options" :key="option.value" v-bind="option" />
        </el-option-group>
      </template>

      <!-- 渲染普通选项 -->
      <template v-else-if="options.length > 0">
        <el-option v-for="option in options" :key="option.value" v-bind="option" />
      </template>
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { computed, ref } from '@vue/runtime-core';
import type { SimpleSelectProps } from './simple-select';

defineOptions({
  name: 'YSimpleSelect',
  inheritAttrs: true
});

const props = withDefaults(defineProps<SimpleSelectProps>(), {
  options: () => [],
  optionGroups: () => []
});

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
