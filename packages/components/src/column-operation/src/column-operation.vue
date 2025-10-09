<template>
  <el-table-column class="y-column-operation" v-bind="mergedColumnAttrs">
    <template #default="scope">
      <div v-for="item in getOptions(scope).normalList" :key="item.prop">
        <span>{{ item.label }}</span>
      </div>
      <div v-for="item in getOptions(scope).dropdownList" :key="item.prop">
        <span>{{ item.label }}</span>
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
import type {
  ColumnOperationProps,
  TableItemScope,
  ColumnOperationItemType
} from './column-operation';
import { withDefaults, toRefs, useAttrs, computed, ref } from '@vue/runtime-core';

defineOptions({
  name: 'YColumnOperation',
  inheritAttrs: true
});

const attrs = useAttrs();
const props = withDefaults(defineProps<ColumnOperationProps>(), {
  options: () => [],
  headerStyle: () => ({})
});

const { options, headerStyle } = toRefs(props);

const mergedColumnAttrs = computed(() => {
  return {
    'min-width': attrs?.['min-width'] || 100,
    width: attrs?.width || 'auto',
    'show-overflow-tooltip': false,
    fixed: attrs?.fixed || 'right',
    ...attrs
  };
});

const getOptions = (scope: TableItemScope) => {
  // 正常展示的操作项
  const normalList = ref<ColumnOperationItemType[]>([]);
  // 以dropdown的形式展示的操作项
  const dropdownList = ref<ColumnOperationItemType[]>([]);
  const optionsArr = typeof options.value === 'function' ? options.value(scope) : options.value;

  optionsArr?.forEach((item: ColumnOperationItemType) => {
    const defaultObj = {
      prop: item.prop,
      label: '',
      disabled: false,
      show: true,
      hide: false,
      dropdown: false
    };
    defaultObj.label = typeof item.label === 'function' ? item.label(scope, item) : item.label;
    const disabledValue =
      typeof item.disabled === 'function' ? item.disabled(scope, item) : item.disabled;
    if (Array.isArray(disabledValue)) {
      // 如果是数组形式，取第一个元素的第一个值（布尔值）
      defaultObj.disabled = Array.isArray(disabledValue[0])
        ? disabledValue[0][0]
        : (disabledValue[0] ?? false);
    } else {
      // 如果是布尔值直接使用
      defaultObj.disabled = disabledValue ?? false;
    }
    defaultObj.show =
      typeof item.show === 'function' ? item.show(scope, item) : (item.show ?? true);
    defaultObj.hide =
      typeof item.hide === 'function' ? item.hide(scope, item) : (item.hide ?? false);
    defaultObj.dropdown =
      typeof item.dropdown === 'function' ? item.dropdown(scope, item) : (item.dropdown ?? false);

    // 如果按钮隐藏，则不展示
    if (defaultObj.hide) return;

    // 根据dropdown的值，将操作项添加到对应的列表中
    if (defaultObj.dropdown) {
      dropdownList.value.push(defaultObj);
    } else {
      normalList.value.push(defaultObj);
    }
  });
  return {
    normalList: normalList.value,
    dropdownList: dropdownList.value
  };
};
</script>
