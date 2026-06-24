<template>
  <el-table-column v-bind="manageAttrs">
    <template #default="scope">
      <div :class="[ns.e('content'), inline ? ns.is('line') : ns.is('flex')]">
        <div
          v-for="item in mergedFormArr(scope)"
          :key="`${scope.$index}_${item.prop}`"
          :style="item.style">
          <el-form-item
            :style="{ width: item.width || 'auto' }"
            v-bind="item.formAttrs"
            :prop="`${tableName}.${scope.$index}.${item.prop}`"
            @mouseenter="handleMouseEnter(`${scope.$index}_${item.prop}`)"
            @mouseleave="handleMouseLeave(`${scope.$index}_${item.prop}`)">
            <!-- 这里使用slot，方便在外部定义表单项 -->
            <slot
              :name="item.prop"
              :scope="scope"
              :row="scope.row"
              :prop="item.prop" />
            <!-- 这里是el-form-item的错误提示，以tooltip的形式展示-->
            <template #error="{ error }">
              <div>
                <el-tooltip
                  v-bind="item.tipProps"
                  :content="error"
                  :disabled="!error"
                  :visible="errorMessageMap[`${scope.$index}_${item.prop}`]">
                  <span :class="[formNs.e('error'), { [formNs.is('hidden')]: !error }]" />
                </el-tooltip>
              </div>
            </template>
          </el-form-item>
        </div>
      </div>
    </template>
    <template #header="{ column, $index }">
      <slot
        name="header"
        :column="column"
        :index="$index">
        <span>{{ attrs.label }}</span>
      </slot>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { ElTableColumn, ElFormItem, ElTooltip } from 'element-plus';
import type { ColumnFormsProps } from './column-forms';
import { toRefs, computed, inject, ref } from 'vue';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useTableColumnAttrs } from '../../../hooks/use-table-column-attrs';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YColumnForms',
  inheritAttrs: true
});

const columnFormConfig = useAppConfig('columnForm')
const ns = useNamespace('column-forms');
const formNs = useNamespace('column-form');
// y-table下发的，最外层el-form中el-table绑定的字段名
const formTableProp = inject('formTableProp', 'tableData');
const { attrs, mergedColumnAttrs: manageAttrs } = useTableColumnAttrs({
  className: ns.b(),
  showOverflowTooltip: false,
});
const props = withDefaults(defineProps<ColumnFormsProps>(), {
  options: () => [],
  inline: true,
  tName: '',
});

const { options, inline, tName } = toRefs(props);
// 每个表单项的错误信息
const errorMessageMap = ref<Record<string, any>>({});
// form中table字段名，用于绑定校验组
const tableName = computed(() => {
  return tName.value || formTableProp || 'tableData';
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
    popperClass: columnFormConfig?.popperClass || formNs.e('error-tooltip'),
    effect: 'dark',
    placement: columnFormConfig?.placement || 'top',
    enterable: false,
  }
  const compObj = typeof item.tipProps === 'function' ? item.tipProps(scope, item.prop) : item.tipProps
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
      show: typeof item.show === 'function' ? item.show(scope, item.prop) : (item.show ?? true),
      formAttrs: mergedItemFormAttrs(scope, item),
      tipProps: mergedItemTooltipAttrs(scope, item),
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
