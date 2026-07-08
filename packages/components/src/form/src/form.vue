<template>
  <el-form ref="formRef" :class="ns.b()" v-bind="mergedFormAttrs" @submit.prevent>
    <el-row v-bind="rowAttrs">
      <slot />
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ElForm, ElRow } from 'element-plus';
import type { FormInstance as ElFormInstance, RowProps } from 'element-plus';
import {
  computed,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  toRef,
  useAttrs,
  watch
} from 'vue';
import { omit, pick } from 'lodash-es';
import { useNamespace } from '../../../hooks/use-namespace';
import {
  ATTRS_LAYOUT_KEYS,
  ROW_PROP_KEYS,
  Y_FORM_INJECTION_KEY,
  formProps,
  type FormChangeContext
} from './form';

defineOptions({
  name: 'YForm',
  inheritAttrs: false
});

const props = defineProps(formProps);
const attrs = useAttrs() as Record<string, unknown>;
const formRef = ref<ElFormInstance>();
const ns = useNamespace('form');

provide(Y_FORM_INJECTION_KEY, {
  span: toRef(() => props.span)
});

const rowAttrs = computed(() => ({
  class: [ns.e('row'), props.rowClass].filter(Boolean),
  style: props.rowStyle,
  ...pick(attrs, ROW_PROP_KEYS) as Partial<RowProps>
}));

const mergedFormAttrs = computed(() => ({
  model: props.model,
  rules: props.rules,
  class: [attrs.class, ns.b()].filter(Boolean),
  style: attrs.style,
  ...omit(attrs, [...ROW_PROP_KEYS, ...ATTRS_LAYOUT_KEYS])
}));

const configUpdating = ref(false);
const changeQueue = ref<FormChangeContext[]>([]);
let queueTimer: ReturnType<typeof setTimeout> | null = null;
let prevModelSnapshot: Record<string, any> | null = null;

const deepCopy = (obj: Record<string, any>) => JSON.parse(JSON.stringify(obj));

const detectChanges = (oldVal: Record<string, any>, newVal: Record<string, any>) => {
  const changes: FormChangeContext[] = [];
  const allKeys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
  allKeys.forEach((field) => {
    if (props.staticFields.includes(field)) return;
    const prev = oldVal[field];
    const curr = newVal[field];
    if (JSON.stringify(prev) !== JSON.stringify(curr)) {
      changes.push({ field, prevValue: prev, newValue: curr });
    }
  });
  if (changes.length && props.config) {
    pushToQueue(changes);
  }
};

const pushToQueue = (changes: FormChangeContext[]) => {
  changes.forEach((c) => {
    const existing = changeQueue.value.find((x) => x.field === c.field);
    if (existing) {
      existing.newValue = c.newValue;
    } else {
      changeQueue.value.push({ ...c });
    }
  });
  scheduleProcess();
};

const flushQueue = () => {
  if (changeQueue.value.length === 0 || configUpdating.value) return;
  const batch = changeQueue.value.splice(0);
  configUpdating.value = true;
  try {
    batch.forEach((ctx) => {
      props.config?.(props.model!, ctx);
    });
  } finally {
    nextTick(() => {
      configUpdating.value = false;
      prevModelSnapshot = deepCopy(props.model || {});
      if (changeQueue.value.length > 0) {
        scheduleProcess();
      }
    });
  }
};

const scheduleProcess = () => {
  if (changeQueue.value.length === 0) return;
  if (props.debounce > 0) {
    if (queueTimer) clearTimeout(queueTimer);
    queueTimer = setTimeout(() => {
      queueTimer = null;
      flushQueue();
    }, props.debounce);
  } else {
    nextTick(() => flushQueue());
  }
};

watch(
  () => props.model,
  (newVal) => {
    if (!props.config || configUpdating.value) return;
    const curr = newVal || {};
    const prev = prevModelSnapshot;
    if (prevModelSnapshot === null) {
      prevModelSnapshot = deepCopy(curr);
      return;
    }
    detectChanges(prev!, curr);
    prevModelSnapshot = deepCopy(curr);
  },
  { deep: true, immediate: true }
);

onBeforeUnmount(() => {
  if (queueTimer) {
    clearTimeout(queueTimer);
    queueTimer = null;
  }
});

/** 校验表单并返回 model，对齐 el-form.validate 的 Promise 用法 */
const validateSync = async (): Promise<Record<string, any>> => {
  const valid = await formRef.value!.validate();
  if (!valid) {
    return Promise.reject(new Error('validate failed'));
  }
  return props.model || {};
};

defineExpose(
  new Proxy({} as ElFormInstance & { validateSync: typeof validateSync }, {
    get(_target, key) {
      if (key === 'validateSync') {
        return validateSync;
      }
      return formRef.value?.[key as keyof ElFormInstance];
    },
    has(_target, key) {
      return key === 'validateSync' || !!(formRef.value && key in formRef.value);
    },
    ownKeys() {
      return formRef.value ? [...Object.keys(formRef.value), 'validateSync'] : ['validateSync'];
    },
    getOwnPropertyDescriptor(_target, key) {
      if (key === 'validateSync') {
        return {
          configurable: true,
          enumerable: true,
          value: validateSync
        };
      }
      return formRef.value
        ? Object.getOwnPropertyDescriptor(formRef.value, key)
        : undefined;
    }
  })
);
</script>
