<template>
  <el-dialog
    v-model="dialogVisible"
    ref="dialogRef"
    v-bind="dialogAttrs"
    class="y-dialog"
    :style="{
      '--body-max-height': bodyMaxHeight
    }"
  >
    <template #header>
      <slot name="header">
        <div class="y-dialog__header-title" :style="titleStyle">
          <slot name="title">
            {{ title }}
          </slot>
        </div>
      </slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer v-if="props.showFooter">
      <slot name="footer">
        <slot name="confirm">
          <y-button v-if="!props.noConfirm" v-bind="confirmBtnProps" @click="confirmClick">{{
            confirmText
          }}</y-button>
        </slot>
        <slot name="cancel">
          <y-button v-if="!props.noCancel" v-bind="cancelProps" @click="cancelClick">{{
            cancelText
          }}</y-button>
        </slot>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from '@vue/runtime-core';
import { DialogProps } from './dialog';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';
import { useExternalListener } from '../../../hooks/use-external-listener';
import { omit } from 'lodash-es';

defineOptions({
  name: 'YDialog',
  inheritAttrs: true
});

const emit = defineEmits(['confirm', 'cancel', 'update:modelValue']);

const dialogConfig = useAppConfig('dialog');
const attrs = useAttrs();
const { t } = useLocale();
const { hasExternalListener } = useExternalListener();

const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: '',
  titleStyle: () => ({}),
  showFooter: true,
  noConfirm: false,
  confirmProps: () => ({}),
  noCancel: false,
  cancelProps: () => ({}),
  bodyMaxHeight: ''
});

// 受控组件的显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val);
  }
});

const dialogAttrs = computed(() => {
  return {
    headerClass: 'y-dialog__header',
    bodyClass: 'y-dialog__body',
    footerClass: 'y-dialog__footer',
    ...omit(dialogConfig, [
      'titleStyle',
      'confirmText',
      'cancelText',
      'confirmProps',
      'cancelProps'
    ]),
    ...attrs
  };
});

const bodyMaxHeight = computed(() => {
  return props.bodyMaxHeight || dialogConfig?.bodyMaxHeight || '50vh';
});

const titleStyle = computed(() => {
  const configStyle = dialogConfig?.titleStyle || {};
  const propStyle = props?.titleStyle || {};
  return {
    ...configStyle,
    ...propStyle
  } as Record<string, any>;
});

const confirmBtnProps = computed(() => {
  const configProps = dialogConfig?.confirmProps || {};
  const propProps = props.confirmProps || {};
  return {
    type: 'primary',
    ...configProps,
    ...propProps
  };
});

const cancelProps = computed(() => {
  const configProps = dialogConfig?.cancelProps || {};
  const propProps = props.cancelProps || {};
  return {
    type: 'default',
    ...configProps,
    ...propProps
  };
});

const confirmText = computed(() => {
  return props?.confirmText || dialogConfig?.confirmText || t('common.confirm');
});

const cancelText = computed(() => {
  return props?.cancelText || dialogConfig?.cancelText || t('common.cancel');
});

const cancelClick = () => {
  if (hasExternalListener('cancel')) {
    emit('cancel');
  } else {
    emit('update:modelValue', false);
  }
};

const confirmClick = () => {
  if (hasExternalListener('confirm')) {
    emit('confirm');
  } else {
    emit('update:modelValue', false);
  }
};

const dialogRef = ref(null);

defineExpose({
  dialogRef
});
</script>
