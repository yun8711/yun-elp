<template>
  <div class="group-select-demo">
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

<style scoped>
.group-select-demo {
  padding: 20px;
}

.group-select-demo h3 {
  margin: 20px 0 10px 0;
  color: #333;
  font-size: 16px;
}

.group-select-demo p {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
}

.custom-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.custom-label {
  font-weight: 500;
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .group-select-demo {
    padding: 10px;
  }

  .group-select-demo h3 {
    font-size: 14px;
  }
}
</style>
