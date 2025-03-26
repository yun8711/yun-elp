<template>
  <el-button class="k-button" :type="type" :size="size" :disabled="disabled" :loading="loading" v-bind="$attrs" @click="handleClick">
    <slot>{{ loading ? t('kdelp.button.loading') : '' }}</slot>
  </el-button>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { useLocale } from '../../hooks/use-locale'

defineOptions({
  name: 'KButton',
  inheritAttrs: false
})

// 使用国际化
const { t } = useLocale()

// 定义组件 props
defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | ''
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  loading?: boolean
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// 点击处理函数
const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style lang="scss">
@use './k-button.scss';
</style>
