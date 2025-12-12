<script setup lang="ts">
import { isExternal } from '../../utils'
// @ts-ignore - unplugin-icons 自动生成的类型
import IconRiExternalLinkLine from '~icons/ri/external-link-line'

defineProps<{
  href?: string
  noIcon?: boolean
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    class="link-item"
    :class="{ link: href }"
    :href="href"
    :target="isExternal(href) ? '_blank' : undefined"
    :rel="isExternal(href) ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <ElIcon v-if="isExternal(href) && !noIcon">
      <IconRiExternalLinkLine class="link-icon" />
    </ElIcon>
  </component>
</template>

<style scoped>
.link-item {
  display: flex;
  align-items: center;
}

.el-icon {
  margin-left: 4px;
}
</style>
