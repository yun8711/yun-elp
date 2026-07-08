<template>
  <div>
    <y-table-search :options="options" @search="onSearch" @reset="onReset" @change="onChange">
      <template #status="{ prop, value, item, form }">
        <el-select v-model="form[prop]" placeholder="请选择">
          <el-option label="选项1" value="1" />
          <el-option label="选项2" value="2" />
        </el-select>
      </template>
      <template #right>
        <el-button type="primary">新增</el-button>
      </template>
    </y-table-search>

    <div style="margin-top: 20px;">
      <h4>表单数据：</h4>
      <pre>{{ JSON.stringify(form, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { ElInput, ElSelect, ElDatePicker, ElCascader } from 'element-plus'

const form = ref({})

const options = ref([
  {
    prop: 'keyword',
    label: '关键词',
    first: true,
    innerAttrs: {
      placeholder: '请输入关键词',
      clearable: true
    }
  },
  {
    prop: 'status',
    label: '状态',
    custom: true
  },
  {
    prop: 'date',
    label: '日期',
    comp: markRaw(ElDatePicker),
    innerAttrs: {
      type: 'date',
      placeholder: '请选择日期'
    }
  },
  {
    prop: 'category',
    label: '分类',
    comp: markRaw(ElCascader),
    innerAttrs: {
      placeholder: '请选择分类',
      clearable: true
    }
  }
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
