<template>
  <el-table-column class="y-column-filter" v-bind="mergedAttrs">
    <template #default="scope">
      <slot :scope="scope" :value="formatterCellValue(scope)">
        <span
          :style="getStyle(scope)"
          class="y-column-filter__content"
          :class="{ 'y-column-filter__status': !noStatus }">
          {{ formatterCellValue(scope) }}
        </span>
      </slot>
    </template>
    <template #header="{ column, $index }">
      <slot name="header" :column="column" :index="$index">
        <span :style="headerStyle">{{ attrs.label }}</span>
      </slot>
    </template>
    <template #expand="{ expanded }">
      <slot name="expand" :expanded="expanded" />
    </template>
    <template #filter-icon="{ filterOpened }">
      <slot name="filter-icon" :filter-opened="filterOpened" />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { withDefaults, toRefs, useAttrs, computed } from '@vue/runtime-core';
import type { ColumnFilterProps, ColumnFilterConfig } from './column-filter';
import { isEmpty } from 'lodash-es';

defineOptions({
  name: 'YColumnFilter',
  inheritAttrs: true
});

const attrs = useAttrs();
const props = withDefaults(defineProps<ColumnFilterProps>(), {
  noStatus: false,
  noFilter: false,
  formatter: true,
  headerStyle: undefined,
  config: () => [],
  textStyle: undefined
});

const { noStatus, noFilter, formatter, headerStyle, config, textStyle } = toRefs(props);

// 使用 computed 确保属性正确获取
const propKey = computed(() => attrs.prop || 'name');

const cellValue = (row: any) => {
  if (!row || !propKey.value) return '';
  return row[propKey.value as string];
}

const formatterCellValue = (scope: any) => {
  const { row } = scope || {};
  if (!row) return '';
  const value = cellValue(row);
  let res = "";
  if (typeof formatter.value === 'boolean' && formatter.value) {
    const configItem = config.value.find((item: ColumnFilterConfig) => item.value === value);
    res = configItem?.text || value;
  } else if (typeof formatter.value === 'function') {
    res = formatter.value(value, row, scope);
  } else {
    res = value;
  }
  return res;
}

const mergedAttrs = computed(() => {
  const obj: any = {
    ...attrs,
    'min-width': attrs?.['min-width'] || 100,
    width: attrs?.width || 'auto',
    'column-key': attrs?.['column-key'] || attrs.prop,
  }

  if (!noFilter.value) {
    if (!isEmpty(attrs?.filters)) {
      obj['filters'] = attrs.filters;
    } else if (!isEmpty(config.value)) {
      obj['filters'] = config.value;
    }
  }
  return obj;
});

const getStyle = (scope: any) => {
  const { row } = scope || {};
  if (!row) return textStyle?.value || {};
  const configItem = config.value.find((item: ColumnFilterConfig) => item.value === cellValue(row));
  const obj: any = {
    ...(textStyle?.value || {}),
  }
  if (!noStatus.value) {
    obj.color = configItem?.color || '';
    obj.backgroundColor = configItem?.bgColor || '';
  }
  return obj;
}
</script>
