<template>
  <div :class="ns.b()">
    <el-button-group>
      <el-button
        v-for="(item, index) in options"
        :key="item.value"
        :type="isPrimarySelected(item.value) ? 'primary' : 'default'"
        :class="[
          'item',
          itemClass,
          ns.is('plain', isPlainSelected(item.value)),
          ns.is('active', isPlainSelected(item.value))
        ]"
        :icon="item.icon"
        :loading="item.loading"
        :disabled="item.disabled"
        :style="itemStyles"
        @click="onClick(item.value, item, index, $event)"
      >
        <slot v-bind="{ item, index }">
          {{ item.label }}
        </slot>
        <slot name="icon" />
        <slot name="loading" />
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import { ElButtonGroup, ElButton } from 'element-plus';
import { groupSelectProps, type GroupSelectOption, type GroupSelectEmits } from './group-select';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YGroupSelect',
  inheritAttrs: true
});

const props = defineProps(groupSelectProps);
const emit = defineEmits<GroupSelectEmits>();
const ns = useNamespace('group-select');

const isSelected = (value: string | number) => value === props.modelValue;
const isPrimarySelected = (value: string | number) =>
  props.activeType === 'primary' && isSelected(value);
const isPlainSelected = (value: string | number) =>
  props.activeType === 'plain' && isSelected(value);

const onClick = (value: string | number, item: GroupSelectOption, index: number, event: MouseEvent) => {
  if (value === props.modelValue) {
    return;
  }
  emit('update:modelValue', value);
  emit('change',
    {
      value,
      item,
      index,
      event
    }
  );
};
</script>
