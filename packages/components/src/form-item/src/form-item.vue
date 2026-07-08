<template>
  <el-col v-bind="mergedColAttrs">
    <el-form-item v-bind="mergedFormItemAttrs" ref="formItemRef" :class="ns.b()">
      <slot />
      <template v-if="slots.label" #label="slotProps">
        <slot name="label" v-bind="slotProps" />
      </template>
      <template v-if="slots.error" #error="{ error }">
        <slot name="error" :error="error" />
      </template>
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
import { ElCol, ElFormItem } from 'element-plus';
import type { ColProps, FormItemInstance } from 'element-plus';
import { computed, inject, ref, useAttrs, useSlots } from 'vue';
import { omit, pick } from 'lodash-es';
import { COL_PROP_KEYS } from './form-item';
import {
  ATTRS_LAYOUT_KEYS,
  Y_FORM_INJECTION_KEY
} from '../../form/src/form';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YFormItem',
  inheritAttrs: false
});

const attrs = useAttrs() as Record<string, unknown>;
const slots = useSlots();
const yForm = inject(Y_FORM_INJECTION_KEY, null);
const formItemRef = ref<FormItemInstance>();
const ns = useNamespace('form-item');
const colPropKeysWithoutSpan = COL_PROP_KEYS.filter((key) => key !== 'span');

const span = computed(() => {
  if (attrs.span !== undefined && attrs.span !== null) {
    return Number(attrs.span);
  }
  return yForm?.span.value ?? 24;
});

const mergedColAttrs = computed(() => ({
  span: span.value,
  ...pick(attrs, colPropKeysWithoutSpan) as Partial<Omit<ColProps, 'span'>>
}));

const mergedFormItemAttrs = computed(() =>
  omit(attrs, [...COL_PROP_KEYS, ...ATTRS_LAYOUT_KEYS])
);

defineExpose(
  new Proxy({} as FormItemInstance, {
    get(_target, key) {
      return formItemRef.value?.[key as keyof FormItemInstance];
    },
    has(_target, key) {
      return !!(formItemRef.value && key in formItemRef.value);
    },
    ownKeys() {
      return formItemRef.value ? [...Object.keys(formItemRef.value)] : [];
    },
    getOwnPropertyDescriptor(_target, key) {
      return formItemRef.value
        ? Object.getOwnPropertyDescriptor(formItemRef.value, key)
        : undefined;
    }
  })
);
</script>
