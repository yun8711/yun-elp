<template>
  <div v-loading="loading" class="y-table">
    <el-table v-bind="tableProps" ref="tableRef" class="y-table__table">
      <slot />
      <template #empty>
        <slot name="empty">
          <y-empty v-bind="emptyProps" />
        </slot>
      </template>
      <template #append>
        <slot name="append" />
      </template>
    </el-table>
    <div v-if="showFooter" class="y-table__footer">
      <slot name="footer">
        <div class="y-table__footer-default">
          <div class="y-table__footer-total">
            {{ t('table.total') }}
            <span class="y-table__footer-total-num">{{ paginationProps.total }}</span>
            <span>{{ t('table.items') }}</span>
          </div>
          <el-pagination
            v-bind="paginationProps"
            ref="paginationRef"
            class="y-table__footer-pagination"
            @change="paginationChange" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, useAttrs, useTemplateRef } from '@vue/runtime-core';
import type { TableProps } from './table';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';
import type { EmptyProps } from '../../empty/src/empty';
import YEmpty from '../../empty/src/empty.vue';

defineOptions({
  name: 'YTable',
  inheritAttrs: true
});


const emit = defineEmits<{
  (e: 'paginationChange', obj: { currentPage: number, pageSize: number }): void
}>();

const attrs = useAttrs();
const slots = defineSlots<{
  default(): any;
  empty(): any;
  append(): any;
  footer(): any;
}>();

const props = withDefaults(defineProps<TableProps>(), {
  loading: false,
  showFooter: true,
  emptyProps: undefined,
  paginationProps: undefined,
  formTableProp: 'tableData'
});

const tableConfig = useAppConfig('table');
const { t } = useLocale();

const tableProps = computed(() => {
  return {
    ...(attrs || {}),
    ...props,
    border: true,
    size: 'large',
  }
});

const emptyProps = computed<EmptyProps>(() => {
  const emptyProps = tableConfig?.emptyProps || {};
  const propsEmptyProps = props?.emptyProps || {};
  return {
    ...emptyProps,
    ...propsEmptyProps
  }
});


const paginationProps = computed(() => {
  const paginationProps = tableConfig?.paginationProps || {};
  const propsPaginationProps = props?.paginationProps || {};
  return {
    layout: 'prev, pager, next, sizes, jumper',
    background: true,
    pageSizes: [10, 20, 30, 40, 50, 100, 200],
    total: 0,
    ...paginationProps,
    ...propsPaginationProps
  }
});

const paginationChange = (currentPage: number, pageSize: number) => {
  emit('paginationChange', { currentPage, pageSize });
}

const tableRef = useTemplateRef('tableRef')
const paginationRef = useTemplateRef('paginationRef')

defineExpose({
  tableRef,
  paginationRef
})

provide('tableData', attrs.data);
provide('formTableProp', props.formTableProp);
</script>
