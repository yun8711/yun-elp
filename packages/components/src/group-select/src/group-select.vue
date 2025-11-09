<template>
  <div class="y-group-select">
    <el-button-group>
      <el-button
        v-for="(item, index) in options"
        :key="item.value"
        :type="modelValue === item.value ? 'primary' : 'default'"
        :class="['item', itemClass]"
        :icon="item.icon"
        :loading="item.loading"
        :disabled="item.disabled"
        :style="itemStyles"
        @click="onClick(item.value, item, index, $event)">
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
import { groupSelectProps, type GroupSelectOption, type GroupSelectEmits } from './group-select';

defineOptions({
  name: 'YGroupSelect',
  inheritAttrs: true
});

const props = defineProps(groupSelectProps);
const emit = defineEmits<GroupSelectEmits>();

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
