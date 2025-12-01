<template>
  <div class="y-pop">
    <el-tooltip v-bind="tooltipProps" ref="tooltipRef" :disabled="disabledTooltip">
      <!-- 重要 -->
      <span>
        <el-popover
          v-bind="popoverProps"
          ref="popoverRef"
          v-model:visible="showPopover"
          :disabled="noPop">
          <slot name="pop-content">
            <p>{{ popoverProps.content }}</p>
            <div v-if="!props.noFooter" class="y-pop__popover-footer">
              <slot name="pop-footer">
                <y-button
                  v-if="!props.noCancel"
                  v-bind="cancelProps"
                  @click="cancelClick"
                >{{ cancelText }}</y-button
                >
                <y-button v-if="!props.noConfirm" v-bind="confirmBtnProps" @click="confirmClick">
                  {{ confirmText }}
                </y-button>
              </slot>
            </div>
          </slot>

          <template #reference>
            <slot name="default" />
          </template>
        </el-popover>
      </span>

      <template #content>
        <slot name="tip-content" />
      </template>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue";
import type { PopProps, PopEmits } from './pop';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useLocale } from '../../../hooks/use-locale';
import { useExternalListener } from '../../../hooks/use-external-listener';
import YButton from '../../button/src/button.vue';
import { ElTooltip, ElPopover } from 'element-plus';

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

const emit = defineEmits<PopEmits>();
const popConfig = useAppConfig('pop');
const props = defineProps<PopProps>();
const { t } = useLocale();
const { hasExternalListener } = useExternalListener();

const confirmText = computed(() => {
  return props?.confirmText || popConfig?.confirmText || t('common.confirm')
})

// 确认按钮属性
const confirmBtnProps = computed(() => {
  const configProps = popConfig?.confirmProps || {};
  const propProps = props.confirmProps || {};
  return {
    type: 'primary',
    size: 'small',
    model: 'debounce',
    ...configProps,
    ...propProps,
  }
})

const cancelText = computed(() => {
  return props?.cancelText || popConfig?.cancelText || t('common.cancel')
})

// 取消按钮属性
const cancelProps = computed(() => {
  const configProps = popConfig?.cancelProps || {};
  const propProps = props.cancelProps || {};
  return {
    type: 'default',
    size: 'small',
    model: 'debounce',
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

// tooltip属性合并计算
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
