<template>
  <button
    type="button"
    :class="[ns.b(), ns.m(icon), ns.is('active', isActive), ns.is('disabled', disabled)]"
    :disabled="disabled"
    :aria-pressed="isActive"
    @click="onClick"
  >
    <span v-if="slots.default" :class="ns.e('label')">
      <slot />
    </span>
    <span :class="ns.e('icons')" aria-hidden="true">
      <el-icon :size="12" :class="[ns.e('icon'), ns.is('active', modelValue === 'asc')]">
        <CaretTop v-if="icon === 'caret'" />
        <ArrowUp v-else />
      </el-icon>
      <el-icon :size="12" :class="[ns.e('icon'), ns.is('active', modelValue === 'desc')]">
        <CaretBottom v-if="icon === 'caret'" />
        <ArrowDown v-else />
      </el-icon>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { ElIcon } from 'element-plus';
import { ArrowDown, ArrowUp, CaretBottom, CaretTop } from '@element-plus/icons-vue';
import { orderButtonProps, resolveNextOrder, type OrderButtonEmits } from './order-button';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YOrderButton',
  inheritAttrs: true
});

const props = defineProps(orderButtonProps);
const emit = defineEmits<OrderButtonEmits>();
const slots = useSlots();
const ns = useNamespace('order-button');

const isActive = computed(() => props.modelValue === 'asc' || props.modelValue === 'desc');

function onClick(): void {
  if (props.disabled) {
    return;
  }
  const next = resolveNextOrder(props.modelValue, {
    defaultOrder: props.defaultOrder,
    clearable: props.clearable
  });
  emit('update:modelValue', next);
  emit('change', next);
}
</script>
