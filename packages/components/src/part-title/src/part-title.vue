<template>
  <div class="y-part-title" v-bind="$attrs">
    <div class="y-part-title__left">
      <span>
        <slot>{{ props.title }}</slot>
      </span>
      <div class="y-part-title__left-extra">
        <slot name="extra" />
      </div>
    </div>
    <div class="y-part-title__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PartTitleProps } from './part-title';

defineOptions({
  name: 'YPartTitle',
  inheritAttrs: true
});

const props = withDefaults(defineProps<PartTitleProps>(), {
  title: ''
});
</script>
