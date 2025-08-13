<template>
  <div class="y-group-select">
    <el-button-group>
      <el-button :type="modelValue === item.value ? 'primary' : 'default'" v-for="(item, index) in options"
        :key="item.value" :class="['item', itemClass]" :icon="item.icon" :loading="item.loading"
        :disabled="item.disabled" :style="itemStyles" @click="onClick(item.value)">
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
import { groupSelectProps, type GroupSelectOption } from './group-select';

defineOptions({
  name: 'YGroupSelect',
  inheritAttrs: true
});

const props = defineProps(groupSelectProps);
const emit = defineEmits(['update:modelValue', 'change']);

const onClick = (value: string | number) => {
  if (value === props.modelValue) {
    return;
  }
  emit('update:modelValue', value);
  emit('change', {
    value,
    item: props.options.find((item: GroupSelectOption) => item.value === value),
    index: props.options.findIndex((item: GroupSelectOption) => item.value === value)
  });
};

</script>
