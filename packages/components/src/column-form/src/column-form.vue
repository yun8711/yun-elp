<template>
  <el-table-column v-bind="mergedColumnAttrs">
    <template #default="scope">
      <slot
        v-if="noFrom"
        name="default"
        :scope="scope"
        :row="scope.row"
        :prop="prop" />
      <el-form-item
        v-else
        v-bind="mergedFormAttrs(scope)"
        @mouseenter="handleMouseEnter(`${scope.$index}_${prop}`)"
        @mouseleave="handleMouseLeave(`${scope.$index}_${prop}`)">
        <slot
          name="default"
          :scope="scope"
          :row="scope.row"
          :prop="prop" />
        <template #error="{ error }">
          <div>
            <el-tooltip
              v-bind="mergedTipProps"
              :content="error"
              :disabled="!error"
              :visible="errorMessageMap[`${scope.$index}_${prop}`]">
              <span class="y-column-form__error" :class="{ 'is-hidden': !error }" />
            </el-tooltip>
          </div>
        </template>
      </el-form-item>
    </template>
    <template #header="{ column, $index }">
      <slot name="header" :column="column" :index="$index">
        <span>{{ attrs.label }}</span>
      </slot>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { ElTableColumn, ElFormItem, ElTooltip } from 'element-plus';
import type { ColumnFormProps } from './column-form';
import { withDefaults, toRefs, useAttrs, computed, inject, ref } from '@vue/runtime-core';
import { useAppConfig } from '../../app-wrap/src/use-app-config';

defineOptions({
  name: 'YColumnForm',
  inheritAttrs: true
});


const columnFormConig = useAppConfig('columnForm')
const formTableProp = inject('formTableProp', 'tableData');
const attrs = useAttrs();
const props = withDefaults(defineProps<ColumnFormProps>(), {
  noFrom: false,
  tName: 'tableData',
  rules: undefined,
  formProps: undefined,
  tipProps: undefined,
});
const { noFrom, tName, rules, formProps, tipProps } = toRefs(props);

// 类型安全的 prop 值
const prop = computed(() => attrs.prop as string);

// form中table字段名，用于绑定校验组
const tableName = computed(() => {
  return tName.value || formTableProp || 'tableData';
});

const mergedColumnAttrs = computed(() => {
  return {
    'min-width': attrs?.['min-width'] || 100,
    width: attrs?.width || 'auto',
    'show-overflow-tooltip': false,
    'class-name': attrs?.['class-name'] || 'y-column-form',
    ...attrs,
  }
});

const mergedFormAttrs = (scope: any) => {
  return {
    label: "",
    labelWidth: '0px',
    prop: `${tableName.value}.${scope.$index}.${prop.value}`,
    rules: typeof rules?.value === 'function' ? rules.value(scope, prop.value) : (rules?.value || {}),
    ...(formProps?.value || {}),
  }
};

const mergedTipProps = computed(() => {
  return {
    popperClass: columnFormConig?.popperClass || 'y-column-form__error-tooltip',
    placement: columnFormConig?.placement || 'top',
    enterable: false,
    ...(tipProps?.value || {}),
  }
})


// 每个表单项的错误信息
const errorMessageMap = ref<Record<string, any>>({});
const handleMouseEnter = (index: string) => {
  // 鼠标进入时显示错误提示
  errorMessageMap.value[index] = true;
};
const handleMouseLeave = (index: string) => {
  // 鼠标离开时隐藏错误提示
  errorMessageMap.value[index] = false;
};
</script>
