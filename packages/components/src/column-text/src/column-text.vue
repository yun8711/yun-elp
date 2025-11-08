<template>
  <el-table-column class="y-column-text" v-bind="mergedAttrs">
    <template #default="scope">
      <slot :scope="scope" :value="formatterCellValue(scope)">
        <span
          :style="textStyle"
          class="y-column-text__content"
          :class="{ 'y-column-text__link': link }"
          @click="handleClick(scope, $event)">
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
  </el-table-column>
</template>

<script setup lang="ts">
import type { ColumnTextProps } from './column-text';
import { withDefaults, toRefs, useAttrs, computed } from '@vue/runtime-core';
import { useExternalListener } from '../../../hooks/use-external-listener';

defineOptions({
  name: 'YColumnText',
  inheritAttrs: true
});

const emit = defineEmits(['click']);
const attrs = useAttrs();
const { hasExternalListener } = useExternalListener();

const props = withDefaults(defineProps<ColumnTextProps>(), {
  link: false,
  textStyle: undefined,
  formatter: undefined,
  noTip: false,
  tipProps: undefined,
  headerStyle: undefined
});

const { formatter, link, noTip, tipProps } = toRefs(props);

const mergedAttrs = computed(() => {
  const obj: any = {
    ...attrs,
    'min-width': attrs?.['min-width'] || 100,
    width: attrs?.width || 'auto',
  }

  if (noTip.value) {
    obj['show-overflow-tooltip'] = false;
  } else {
    obj['show-overflow-tooltip'] = {
      popperClass: 'y-column-text__tooltip',
      ...(tipProps.value || {}),
    };
  }

  return obj;
});

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
  return formatter.value ? formatter.value(value, row, scope) : value;
}

const handleClick = (scope: any, event: MouseEvent) => {
  if (link.value && hasExternalListener('click') && scope) {
    const { row } = scope;
    emit('click', row, formatterCellValue(scope), scope, event);
  }
}
</script>
