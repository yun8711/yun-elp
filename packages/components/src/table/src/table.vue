<template>
  <div class="y-table" v-loading="loading">
    <el-table v-bind="tableProps" class="y-table__table" ref="tableRef">
      <slot></slot>
      <template #empty>
        <slot name="empty">
          <y-empty v-bind="emptyProps"></y-empty>
        </slot>
      </template>
      <template #append>
        <slot name="append"></slot>
      </template>
    </el-table>
    <div class="y-table__footer" v-if="showFooter">
      <slot name="footer">
        <div class="y-table__footer-default">
          <div class="y-table__footer-total">
            {{ t('table.total') }}
            <span class="y-table__footer-total-num">{{ paginationProps.total }}</span>
            <span>{{ t('table.items') }}</span>
          </div>
          <el-pagination class="y-table__footer-pagination" v-bind="paginationProps" @change="paginationChange" ref="paginationRef" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, useTemplateRef } from '@vue/runtime-core';
import type { TableProps } from './table';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';
import type { EmptyProps } from '../../empty/src/empty';

defineOptions({
  name: 'YTable',
  inheritAttrs: true
});

const emit = defineEmits<{
  (e: 'paginationChange', obj: { currentPage: number, pageSize: number }): void
}>();

const attrs = useAttrs();
const slots = defineSlots<{
  footer(): any
}>();

const props = withDefaults(defineProps<TableProps>(), {
  loading: false,
  showFooter: true,
  emptyProps: undefined,
  paginationProps: undefined
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
</script>
