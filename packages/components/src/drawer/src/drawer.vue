<template>
  <el-drawer v-model="show" v-bind="drawerAttrs" class="y-drawer">
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
      <slot></slot>
    </template>
    <template #footer v-if="props.showFooter">
      <slot name="footer">
        <slot name="confirm">
          <y-button v-if="!props.noConfirm" v-bind="confirmBtnProps" @click="confirmClick">{{ confirmText }}</y-button>
        </slot>
        <slot name="cancel">
          <y-button v-if="!props.noCancel" v-bind="cancelProps" @click="cancelClick">{{ cancelText }}</y-button>
        </slot>
      </slot>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from '@vue/runtime-core';
import { DrawerProps } from './drawer';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';

defineOptions({
  name: 'YDrawer',
  inheritAttrs: true
});

const emit = defineEmits(['confirm', 'cancel'])

const show = ref(false)
const drawerConfig = useAppConfig('drawer');
const attrs = useAttrs();
const { t } = useLocale();
const props = withDefaults(defineProps<DrawerProps>(), {
  title: '',
  titleStyle: () => ({}),
  showFooter: true,
  noConfirm: false,
  confirmProps: () => { },
  noCancel: false,
  cancelProps: () => { },
})

const drawerAttrs = computed(() => {
  return {
    headerClass: 'y-drawer__header',
    bodyClass: 'y-drawer__body',
    footerClass: 'y-drawer__footer',
    size: drawerConfig?.size || '640px',
    ...attrs,
  }
})

const titleStyle = computed(() => {
  const configStyle = drawerConfig?.titleStyle || {};
  const propStyle = props?.titleStyle || {};
  return {
    ...configStyle,
    ...propStyle,
  } as Record<string, any>
})

const confirmBtnProps = computed(() => {
  return {
    type: props.confirmType || 'primary',
    ...props.confirmProps,
  }
})
const confirmText = computed(() => {
  return props?.confirmText || drawerConfig?.confirmText || t('common.confirm')
})

const cancelText = computed(() => {
  return props?.cancelText || drawerConfig?.cancelText || t('common.cancel')
})

const open = () => {
  show.value = true
}

const close = () => {
  show.value = false
}

const cancelClick = () => {
  show.value = false
  emit('cancel')
}

const confirmClick = () => {
  show.value = false
  emit('confirm')
}

defineExpose({
  open,
  close,
})
</script>
