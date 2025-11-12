<template>
  <el-drawer
    ref="drawerRef"
    v-model="drawerVisible"
    v-bind="drawerAttrs"
    class="y-drawer">
    <template #header>
      <slot name="header">
        <div class="y-drawer__header-title" :style="titleStyle">
          <slot name="title">
            {{ title }}
          </slot>
        </div>
      </slot>
    </template>
    <template #default>
      <slot />
    </template>
    <template v-if="props.showFooter" #footer>
      <slot name="footer">
        <slot name="confirm">
          <y-button v-if="!props.noConfirm" v-bind="confirmBtnProps" @click="confirmClick">
            {{ confirmText }}
          </y-button>
        </slot>
        <slot name="cancel">
          <y-button v-if="!props.noCancel" v-bind="cancelBtnProps" @click="cancelClick">
            {{ cancelText }}
          </y-button>
        </slot>
      </slot>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from '@vue/runtime-core';
import { DrawerProps, DrawerEmits } from './drawer';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';
import { useExternalListener } from '../../../hooks/use-external-listener';
import { omit } from 'lodash-es';
import YButton from '../../button/src/button.vue';

defineOptions({
  name: 'YDrawer',
  inheritAttrs: true
});

const emit = defineEmits<DrawerEmits>();

const drawerConfig = useAppConfig('drawer');
const attrs = useAttrs();
const { t } = useLocale();
const { hasExternalListener } = useExternalListener();

const props = withDefaults(defineProps<DrawerProps>(), {
  modelValue: false,
  title: '',
  titleStyle: () => ({}),
  showFooter: true,
  noConfirm: false,
  confirmProps: () => ({}),
  noCancel: false,
  cancelProps: () => ({})
});

// 受控组件的显示状态
const drawerVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val);
  }
});

const drawerAttrs = computed(() => {
  return {
    headerClass: 'y-drawer__header',
    bodyClass: 'y-drawer__body',
    footerClass: 'y-drawer__footer',
    size: drawerConfig?.size || '640px',
    ...omit(drawerConfig, [
      'titleStyle',
      'confirmText',
      'cancelText',
      'confirmProps',
      'cancelProps'
    ]),
    ...attrs
  };
});

const titleStyle = computed(() => {
  const configStyle = drawerConfig?.titleStyle || {};
  const propStyle = props?.titleStyle || {};
  return {
    ...configStyle,
    ...propStyle
  } as Record<string, any>;
});

const confirmBtnProps = computed(() => {
  const defaultProps = { type: 'primary',model: 'debounce' };
  const configProps = drawerConfig?.confirmProps || {};
  return {
    ...defaultProps,
    ...configProps,
    ...props.confirmProps
  };
});

const cancelBtnProps = computed(() => {
  const defaultProps = { type: 'default',model: 'debounce' };
  const configProps = drawerConfig?.cancelProps || {};
  return {
    ...defaultProps,
    ...configProps,
    ...props.cancelProps
  };
});

const confirmText = computed(() => {
  return props?.confirmText || drawerConfig?.confirmText || t('common.confirm');
});

const cancelText = computed(() => {
  return props?.cancelText || drawerConfig?.cancelText || t('common.cancel');
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

const drawerRef = ref(null);
defineExpose({
  drawerRef
});
</script>
