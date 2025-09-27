<template>
  <el-table-column class="y-column-forms" v-bind="manageAttrs">
    <template #default="scope">
      <div class="y-column-forms__content" :class="[inline ? 'is-line' : 'is-flex']">
        <div v-for="item in mergedFormArr(scope)" :key="`${scope.$index}_${item.prop}`" :style="item.style">
          <el-form-item :style="{ width: item.width || 'auto' }" v-bind="item.formAttrs"
            :prop="`${tableName}.${scope.$index}.${item.prop}`"
            @mouseenter.native="handleMouseEnter(`${scope.$index}_${item.prop}`)"
            @mouseleave.native="handleMouseLeave(`${scope.$index}_${item.prop}`)">
            <!-- 这里使用slot，方便在外部定义表单项 -->
            <slot :name="item.prop" :scope="scope" :row="scope.row" :prop="item.prop"></slot>
            <!-- 这里是el-form-item的错误提示，以tooltip的形式展示-->
            <template #error="{ error }">
              <div>
                <el-tooltip v-bind="item.tooltipAttrs" :content="error" :disabled="!error"
                  :visible="errorMessageMap[`${scope.$index}_${item.prop}`]">
                  <span class="y-column-form__error" :class="{ 'is-hidden': !error }"></span>
                </el-tooltip>
              </div>
            </template>
          </el-form-item>
        </div>
      </div>
    </template>
    <template #header="{ column, $index }">
      <slot name="header" :column="column" :index="$index">
        <span :style="headerStyle">{{ attrs.label }}</span>
      </slot>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import type { ColumnFormsProps } from './column-forms';
import { withDefaults, toRefs, useAttrs, computed, inject, ref } from '@vue/runtime-core';
import { useAppConfig } from '../../app-wrap/src/use-app-config';

defineOptions({
  name: 'YColumnForms',
  inheritAttrs: true
});

const columnFormConig = useAppConfig('columnForm')
// y-table下发的，最外层el-form中el-table绑定的字段名
const formTableProp = inject('formTableProp', 'tableData');
const attrs = useAttrs();
const props = withDefaults(defineProps<ColumnFormsProps>(), {
  options: () => [],
  inline: true,
  tName: '',
  headerStyle: () => ({})
});

const { options, inline, tName, headerStyle } = toRefs(props);
// 每个表单项的错误信息
const errorMessageMap = ref<Record<string, any>>({});
// form中table字段名，用于绑定校验组
const tableName = computed(() => {
  return tName.value || formTableProp || 'tableData';
});

const manageAttrs = computed(() => {
  return {
    'show-overflow-tooltip': false,
    'min-width': attrs?.['min-width'] || 100,
    width: attrs?.width || 'auto',
    ...attrs,
  };
});

// 合并表单项的属性
const mergedItemFormAttrs = (scope: any, item: any) => {
  const defaultObj = {
    label: item?.label,
    'label-width': item?.labelWidth ? item.labelWidth : (item?.label ? 'auto' : '0px'),
    rules: typeof item.rules === 'function' ? item.rules(scope, item.prop) : item.rules,
  }
  const compObj = typeof item.formAttrs === 'function' ? item.formAttrs(scope, item.prop) : item.formAttrs
  return {
    ...defaultObj,
    ...compObj
  }
}

// 合并表单项错误提示的tooltip属性
const mergedItemTooltipAttrs = (scope: any, item: any) => {
  const defaultObj = {
    popperClass: columnFormConig?.popperClass || 'y-column-form__error-tooltip',
    effect: 'dark',
    placement: columnFormConig?.placement || 'top',
    enterable: false,
  }
  const compObj = typeof item.tooltipAttrs === 'function' ? item.tooltipAttrs(scope, item.prop) : item.tooltipAttrs
  return {
    ...defaultObj,
    ...compObj
  }
}

// 整理表单数据
const mergedFormArr = (scope: any) => {
  return options.value?.map((item: any) => {
    return {
      prop: item.prop,
      show: typeof item.show === 'function' ? item.show(scope, item.prop) : item.show || true,
      formAttrs: mergedItemFormAttrs(scope, item),
      tooltipAttrs: mergedItemTooltipAttrs(scope, item),
      width: typeof item.width === 'function' ? item.width(scope, item.prop) : item.width || 'auto',
      style: typeof item.style === 'function' ? item.style(scope, item.prop) : item.style || {},
    }
  })?.filter((x: any) => x.show) || [];
}

const handleMouseEnter = (index: string) => {
  // 鼠标进入时显示错误提示
  errorMessageMap.value[index] = true;
};
const handleMouseLeave = (index: string) => {
  // 鼠标离开时隐藏错误提示
  errorMessageMap.value[index] = false;
};
</script>
