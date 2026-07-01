<template>
  <div
    v-loading="loading"
    :class="ns.b()">
    <el-table
      v-bind="tableProps"
      ref="tableRef"
      :class="ns.e('table')">
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
    <div
      v-if="showFooter"
      :class="ns.e('footer')">
      <slot name="footer">
        <div :class="ns.e('footer-default')">
          <div :class="ns.e('footer-total')">
            {{ totalTextParts.before



            }}<span :class="ns.e('footer-total-num')">{{ totalTextParts.total }}</span
            >{{ totalTextParts.after }}
          </div>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            v-bind="restPaginationProps"
            :class="ns.e('footer-pagination')" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, useAttrs, useTemplateRef, watch } from 'vue';
import { omit } from 'lodash-es';
import type { TableProps, TableEmits } from './table';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';
import { useNamespace } from '../../../hooks/use-namespace';
import type { EmptyProps } from '../../empty/src/empty';
import YEmpty from '../../empty/src/empty.vue';
import { ElTable, ElPagination, type TableInstance } from 'element-plus';

defineOptions({
  name: 'YTable',
  inheritAttrs: true
});


const emit = defineEmits<TableEmits>();

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
const ns = useNamespace('table');

const tableProps = computed(() => {
  return {
    ...(attrs || {}),
    ...props,
    border: true,
    size: 'large' as const,
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
  const configPaginationProps = tableConfig?.paginationProps || {};
  const propsPaginationProps = props?.paginationProps || {};
  return {
    layout: 'prev, pager, next, sizes, jumper',
    background: true,
    pageSizes: [10, 20, 30, 40, 50, 100, 200],
    total: 0,
    currentPage: 1,
    pageSize: 10,
    ...configPaginationProps,
    ...propsPaginationProps
  };
});

// 除currentPage和pageSize外的其他分页配置
const restPaginationProps = computed(() =>
  omit(paginationProps.value, ['currentPage', 'pageSize'])
);

const totalTextParts = computed(() => {
  const [before = '', after = ''] = t('table.totalText').split('{total}');
  return {
    before,
    after,
    total: paginationProps.value.total
  };
});

const currentPage = ref(paginationProps.value.currentPage ?? 1);
const pageSize = ref(paginationProps.value.pageSize ?? 10);
// 防止无限循环
let syncingFromProps = false;

watch(
  paginationProps,
  ({ currentPage: page, pageSize: size }) => {
    syncingFromProps = true;
    if (page !== undefined) {
      currentPage.value = page;
    }
    if (size !== undefined) {
      pageSize.value = size;
    }
    syncingFromProps = false;
  },
  { deep: true, immediate: true }
);

watch([currentPage, pageSize], ([page, size]) => {
  if (syncingFromProps) {
    return;
  }
  emit('paginationChange', { currentPage: page, pageSize: size });
});

const tableRef = useTemplateRef<TableInstance>('tableRef')

defineExpose(new Proxy({} as TableInstance, {
  get: (_target, key) => {
    return tableRef.value?.[key as keyof TableInstance];
  },
  has: (_target, key) => {
    return !!(tableRef.value && key in tableRef.value);
  },
  ownKeys: () => {
    return tableRef.value ? [...Object.keys(tableRef.value)] : [];
  },
  getOwnPropertyDescriptor: (_target, key) => {
    return tableRef.value ? Object.getOwnPropertyDescriptor(tableRef.value, key) : undefined;
  }
}))

provide('tableData', attrs.data);
provide('formTableProp', props.formTableProp);
</script>
