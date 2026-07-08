<template>
  <div class="table-search-example">
    <y-table-search :options="searchOptions" @search="onSearch" @reset="onReset">
      <template #status="{ prop, form }">
        <el-select v-model="form[prop]" placeholder="请选择状态" clearable style="width: 100%">
          <el-option label="启用" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </template>
      <template #department="{ prop, form }">
        <el-select v-model="form[prop]" placeholder="请选择部门" clearable style="width: 100%">
          <el-option
            v-for="item in departmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template #right>
        <el-button type="primary">新增用户</el-button>
      </template>
    </y-table-search>

    <y-table :data="filteredData" class="table-search-example__table">
      <y-column-text prop="name" label="姓名" />
      <y-column-text prop="department" label="部门" />
      <y-column-text prop="role" label="角色" />
      <y-column-text prop="status" label="状态" :formatter="formatStatus" />
      <y-column-text prop="createTime" label="创建时间" />
    </y-table>

    <div class="table-search-example__result">
      共 {{ filteredData.length }} 条，当前查询条件：{{ JSON.stringify(lastSearchParams) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, markRaw } from 'vue'
import { ElDatePicker } from 'element-plus'
import { filter } from 'lodash-es'

type UserRow = {
  id: number
  name: string
  department: string
  role: string
  status: 'active' | 'inactive'
  createTime: string
}

const sourceData: UserRow[] = [
  { id: 1, name: '张三', department: '研发部', role: '前端工程师', status: 'active', createTime: '2024-03-01 09:00:00' },
  { id: 2, name: '李四', department: '产品部', role: '产品经理', status: 'active', createTime: '2024-04-12 14:30:00' },
  { id: 3, name: '王五', department: '研发部', role: '后端工程师', status: 'inactive', createTime: '2024-05-20 10:15:00' },
  { id: 4, name: '赵六', department: '设计部', role: 'UI 设计师', status: 'active', createTime: '2024-06-08 16:45:00' },
  { id: 5, name: '钱七', department: '产品部', role: '产品助理', status: 'inactive', createTime: '2024-07-18 11:20:00' },
]

const filteredData = ref<UserRow[]>([...sourceData])
const lastSearchParams = ref<Record<string, any>>({})

const departmentOptions = [
  { label: '研发部', value: '研发部' },
  { label: '产品部', value: '产品部' },
  { label: '设计部', value: '设计部' },
]

const searchOptions = ref([
  {
    prop: 'keyword',
    label: '关键词',
    first: true,
    innerAttrs: {
      placeholder: '请输入姓名',
      clearable: true,
    },
  },
  {
    prop: 'status',
    label: '状态',
    custom: true,
  },
  {
    prop: 'department',
    label: '部门',
    custom: true,
  },
  {
    prop: 'createTime',
    label: '创建时间',
    comp: markRaw(ElDatePicker),
    valueFormat: (value: string[] | null) => ({
      startTime: value?.[0] ?? '',
      endTime: value?.[1] ?? '',
    }),
    innerAttrs: () => ({
      type: 'datetimerange',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
    }),
  },
])

const formatStatus = (value: UserRow['status']) => (value === 'active' ? '启用' : '禁用')

function filterData(params: Record<string, any>) {
  return filter(sourceData, (row) => {
    if (params.keyword && !row.name.includes(params.keyword)) {
      return false
    }
    if (params.status && row.status !== params.status) {
      return false
    }
    if (params.department && row.department !== params.department) {
      return false
    }
    if (params.startTime && row.createTime < params.startTime) {
      return false
    }
    if (params.endTime && row.createTime > params.endTime) {
      return false
    }
    return true
  })
}

function onSearch(formData: Record<string, any>) {
  lastSearchParams.value = { ...formData }
  filteredData.value = filterData(formData)
}

function onReset() {
  lastSearchParams.value = {}
  filteredData.value = [...sourceData]
}
</script>

<style scoped>
.table-search-example {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-search-example__table {
  margin-top: 4px;
}

.table-search-example__result {
  color: var(--ep-text-color-regular);
  font-size: 13px;
  word-break: break-all;
}
</style>
