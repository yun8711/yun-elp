<template>
  <div>
    <y-table-search :options="options" @search="onSearch" @reset="onReset" @change="onChange">
      <template #type="{ prop, value, item, form }">
        <el-select v-model="form[prop]" placeholder="请选择">
          <el-option label="用户" value="user" />
          <el-option label="部门" value="department" />
        </el-select>
      </template>
      <template #right>
        <el-button type="primary">搜索</el-button>
      </template>
    </y-table-search>

    <div style="margin-top: 20px;">
      <h4>表单数据：</h4>
      <pre>{{ JSON.stringify(form, null, 2) }}</pre>

      <h4>说明：</h4>
      <ul>
        <li>当"类型"选择"用户"时，"用户ID"字段会显示，"部门"字段会隐藏</li>
        <li>当"类型"选择"部门"时，"部门"字段会显示，"用户ID"字段会隐藏</li>
        <li>日期字段的placeholder会根据类型动态变化</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { ElSelect, ElDatePicker } from 'element-plus'
import type { DynamicPropsParams } from '@yun-elp/components'

const form = ref({})

const options = ref([
  {
    prop: 'keyword',
    label: '关键词',
    first: true
  },
  {
    prop: 'type',
    label: '类型',
    custom: true
  },
  {
    prop: 'userId',
    label: '用户ID',
    hidden: (params: DynamicPropsParams) => params.form.type !== 'user'
  },
  {
    prop: 'department',
    label: '部门',
    hidden: (params: DynamicPropsParams) => params.form.type !== 'department'
  },
  {
    prop: 'date',
    label: '日期',
    comp: markRaw(ElDatePicker),
    // 值格式化函数，返回对象时，对象的属性会被合并到formatForm中，原始字段会被删除
    valueFormat: (value: any, prop: string, form: Record<string, any>) => {
      return {
        startTime: value[0] ?? '',
        endTime: value[1] ?? ''
      }
    },
    innerAttrs: (params: DynamicPropsParams) => ({
      type: "datetimerange",
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    })
  },
])

function onSearch(formData: Record<string, any>) {
  console.log('搜索', formData)
}

function onReset(formData: Record<string, any>) {
  console.log('重置', formData)
}

function onChange(formData: Record<string, any>) {
  console.log('变化', formData)
  form.value = { ...formData }
}
</script>
