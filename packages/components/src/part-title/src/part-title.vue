<template>
  <div
    :class="ns.b()"
    v-bind="$attrs">
    <div :class="ns.e('left')">
      <span>
        <slot>{{ props.title }}</slot>
      </span>
      <div :class="ns.e('left-extra')">
        <slot name="extra" />
      </div>
    </div>
    <div :class="ns.e('right')">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PartTitleProps } from './part-title';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YPartTitle',
  inheritAttrs: true
});

const props = withDefaults(defineProps<PartTitleProps>(), {
  title: ''
});
const ns = useNamespace('part-title');
</script>
