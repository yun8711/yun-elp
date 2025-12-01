<template>
  <el-table-column v-bind="mergedAttrs">
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
        <span>{{ attrs.label }}</span>
      </slot>
    </template>
    <template #expand="{ expanded }">
      <slot name="expand" :expanded="expanded" />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { ElTableColumn } from 'element-plus';
import type { ColumnTextProps } from './column-text';
import { toRefs, useAttrs, computed } from 'vue';
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
});

const { formatter, link, noTip, tipProps } = toRefs(props);

const mergedAttrs = computed(() => {
  const obj: any = {
    ...attrs,
    'min-width': attrs?.['min-width'] || 100,
    width: attrs?.width || 'auto',
    'class-name': attrs?.['class-name'] || 'y-column-text',
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

const cellValue = (row: any) => {
  if (!row) return '';
  return row[attrs.prop as string];
}

const formatterCellValue = (scope: any) => {
  const { row } = scope;
  const value = cellValue(row);
  if (formatter.value) {
    try {
      return formatter.value(value, row, scope);
    } catch (error) {
      // 如果formatter抛出异常，返回原始值
      console.warn('[YColumnText] formatter函数执行出错:', error);
      return value;
    }
  }
  return value;
}

const handleClick = (scope: any, event: MouseEvent) => {
  if (link.value && hasExternalListener('click') && scope) {
    const { row } = scope;
    emit('click', row, formatterCellValue(scope), scope, event);
  }
}

</script>
