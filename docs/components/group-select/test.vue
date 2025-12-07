<template>
  <div>
    <h3>基础用法</h3>
    <y-group-select
      v-model="selectedValue1"
      :options="basicOptions"
      @change="handleChange"
    />
    <p>选中值: {{ selectedValue1 }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GroupSelectOption } from '@yun-elp/components'

// 基础选项
const basicOptions: GroupSelectOption[] = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
  { label: '选项四', value: '4', disabled: true },
  { label: '选项五', value: '5', loading: true },
]


// 响应式数据
const selectedValue1 = ref('1')

// 事件处理
const handleChange = ({ value, item, index, event }: { value: string | number, item: GroupSelectOption, index: number, event: MouseEvent }) => {
  console.log('选择变化:', { value, item, index, event })
}
</script>
