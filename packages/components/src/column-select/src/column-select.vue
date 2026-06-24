<template>
  <el-table-column
    v-bind="managedColumnAttrs"
    :type="single ? undefined : 'selection'"
    :selectable="selectable">
    <template v-if="single" #header="{ column, $index }">
      <slot
        name="header"
        :table="table"
        :column="column"
        :index="$index" />
    </template>

    <template #default="scope">
      <el-tooltip
        :disabled="!getDisabledTip(scope)"
        :content="getDisabledTip(scope)"
        v-bind="managedTipProps">
        <div :class="ns.e('cell')" @click.stop>
          <slot
            :scope="scope"
            :row="scope.row"
            :selected="isRowSelected(scope)"
            :disabled="isDisabled(scope)">
            <el-checkbox
              :model-value="isRowSelected(scope)"
              :disabled="isDisabled(scope)"
              :class="{ [ns.e('radio')]: single }"
              @update:model-value="handleSelect(scope, Boolean($event))"
              @click.stop />
          </slot>
        </div>
      </el-tooltip>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, isRef, type ComponentPublicInstance } from 'vue';
import { ElCheckbox, ElTableColumn, ElTooltip } from 'element-plus';
import type { UseTooltipProps } from 'element-plus';
import { TABLE_INJECTION_KEY } from 'element-plus/es/components/table/src/tokens.mjs';
import type { ColumnSelectProps, ColumnSelectScope } from './column-select';
import { useTableColumnAttrs } from '../../../hooks/use-table-column-attrs';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YColumnSelect',
  inheritAttrs: true
});

type TableLike = ComponentPublicInstance & {
  store?: {
    states?: Record<string, unknown>;
  };
  toggleRowSelection?: (row: any, selected?: boolean) => void;
  setCurrentRow?: (row?: any) => void;
};

const props = withDefaults(defineProps<ColumnSelectProps>(), {
  single: false,
  selectable: () => true,
  disabledTip: undefined,
  width: 55,
  minWidth: 55,
  tipProps: () => ({})
});
const ns = useNamespace('column-select');

const instance = getCurrentInstance();
const injectedTable = inject<TableLike | undefined>(TABLE_INJECTION_KEY, undefined);
const { mergedColumnAttrs: managedColumnAttrs } = useTableColumnAttrs({
  width: props.width,
  minWidth: props.minWidth,
  className: ns.b(),
  showOverflowTooltip: false,
  resizable: false,
});

const table = computed<TableLike | null>(() => {
  if (injectedTable) return injectedTable;

  let parent = instance?.parent;

  while (parent) {
    if (parent.type?.name === 'ElTable' || parent.type?.name === 'ElTableV2') {
      return parent.proxy as TableLike;
    }
    parent = parent.parent;
  }

  return null;
});

const managedTipProps = computed<Partial<UseTooltipProps>>(() => ({
  placement: 'top',
  enterable: false,
  popperClass: ns.e('tooltip'),
  ...props.tipProps
}));

const getStoreState = <T,>(key: string): T | undefined => {
  const value = table.value?.store?.states?.[key];
  return (isRef(value) ? value.value : value) as T | undefined;
};

const getScopeStoreState = <T,>(scope: ColumnSelectScope, key: string): T | undefined => {
  const states = scope.store?.states as Record<string, unknown> | undefined;
  const value = states?.[key];
  return (isRef(value) ? value.value : value) as T | undefined;
};

const isDisabled = (scope: ColumnSelectScope) => {
  return !props.selectable?.(scope.row, scope.$index);
};

const getDisabledTip = (scope: ColumnSelectScope) => {
  const tip = props.disabledTip?.(scope);
  return tip ? String(tip) : '';
};

const isRowSelected = (scope: ColumnSelectScope) => {
  const row = scope.row;

  if (!props.single) {
    return (getScopeStoreState<any[]>(scope, 'selection') || getStoreState<any[]>('selection') || []).includes(row);
  }

  return (getScopeStoreState<any>(scope, 'currentRow') ?? getStoreState<any>('currentRow')) === row;
};

const handleSelect = (scope: ColumnSelectScope, selected: boolean) => {
  if (isDisabled(scope)) return;

  const row = scope.row;

  if (!props.single) {
    if (table.value?.toggleRowSelection) {
      table.value.toggleRowSelection(row, selected);
      return;
    }

    scope.store?.toggleRowSelection?.(row, selected, false, true);
    scope.store?.updateAllSelected?.();
    return;
  }

  if (table.value?.setCurrentRow) {
    table.value.setCurrentRow(selected ? row : undefined);
    return;
  }

  scope.store?.commit?.('setCurrentRow', selected ? row : undefined);
};
</script>
