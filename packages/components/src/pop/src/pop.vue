<template>
  <div class="y-pop">
    <el-tooltip v-bind="tooltipProps" :disabled="disabledTooltip" ref="tooltipRef">
      <!-- 重要 -->
      <span>
        <el-popover v-bind="popoverProps" v-model:visible="showPopover" :disabled="noPop" ref="popoverRef">
          <slot name="pop-content">
            <p>{{ popoverProps.content }}</p>
            <div class="y-pop__popover-footer" v-if="!props.noFooter">
              <slot name="pop-footer">
                <y-button v-bind="cancelProps" v-if="!props.noCancel" @click="cancelClick">{{ cancelText }}</y-button>
                <y-button v-bind="confirmBtnProps" v-if="!props.noConfirm" @click="confirmClick">
                  {{ confirmText }}
                </y-button>
              </slot>
            </div>
          </slot>

          <template #reference>
            <slot name="default"></slot>
          </template>
        </el-popover>
      </span>

      <template #content>
        <slot name="tip-content"></slot>
      </template>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineSlots, useTemplateRef } from "@vue/runtime-core";
import type { PopProps } from './pop';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';
import { useExternalListener } from '../../../hooks/use-external-listener';

defineOptions({
  name: 'YPop',
  inheritAttrs: false
});

const slots = defineSlots<{
  default(): any,
  'tip-content'(): any,
  'pop-content'(): any,
  'pop-footer'(): any
}>()

const emit = defineEmits(['confirm', 'cancel'])
const popConfig = useAppConfig('pop');
const props = defineProps<PopProps>();
const { t } = useLocale();
const { hasExternalListener } = useExternalListener();

const confirmText = computed(() => {
  return props?.confirmText || popConfig?.confirmText || t('common.confirm')
})

const confirmBtnProps = computed(() => {
  const configProps = popConfig?.confirmProps || {};
  const propProps = props.confirmProps || {};
  return {
    type: 'primary',
    size: 'small',
    ...configProps,
    ...propProps,
  }
})

const cancelText = computed(() => {
  return props?.cancelText || popConfig?.cancelText || t('common.cancel')
})

const cancelProps = computed(() => {
  const configProps = popConfig?.cancelProps || {};
  const propProps = props.cancelProps || {};
  return {
    type: 'default',
    size: 'small',
    ...configProps,
    ...propProps,
  }
})

const cancelClick = () => {
  if (hasExternalListener('cancel')) {
    emit('cancel');
  }
  showPopover.value = false
}

const confirmClick = () => {
  if (hasExternalListener('confirm')) {
    emit('confirm');
  }
  showPopover.value = false
}


const tooltipProps = computed(() => {
  const configProps = popConfig?.tipProps || {};
  const propProps = props.tipProps || {};
  return {
    content: props.tipContent || "",
    placement: popConfig?.tipPlacement || props.tipPlacement || 'top',
    effect: 'dark',
    popperClass: 'y-pop__tooltip',
    trigger: 'hover',
    ...configProps,
    ...propProps,
  }
})
const disabledTooltip = computed(() => {
  return tooltipProps.value?.disabled ?? (!tooltipProps.value?.content && !slots["tip-content"]);
});

const showPopover = ref(false);
const popoverProps = computed(() => {
  const configProps = popConfig?.popProps || {};
  const propProps = props.popProps || {};
  return {
    placement: popConfig?.popPlacement || props?.popPlacement || 'bottom',
    width: popConfig?.popWidth ?? props?.popWidth ?? 226,
    title: popConfig?.popTitle || props?.popTitle || t('common.notice'),
    content: popConfig?.popContent || props?.popContent || t('pop.popContent'),
    trigger: 'click',
    popperClass: 'y-pop__popover',
    ...configProps,
    ...propProps,
  }
})

const tipRef = useTemplateRef<HTMLElement>('tooltipRef');
const popRef = useTemplateRef<HTMLElement>('popoverRef');

defineExpose({
  tipRef,
  popRef
})
</script>
