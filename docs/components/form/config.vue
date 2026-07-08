<template>
  <y-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :config="handleFormChange"
    :static-fields="['remark']"
    label-width="120px"
    :span="12"
    :gutter="24"
  >
    <y-form-item label="采购类型" prop="type">
      <el-select v-model="form.type" placeholder="请选择采购类型" clearable style="width: 100%">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </y-form-item>
    <y-form-item label="大类" prop="category">
      <el-select v-model="form.category" placeholder="请选择大类" clearable style="width: 100%">
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </y-form-item>
    <y-form-item label="小类" prop="subCategory">
      <el-select v-model="form.subCategory" placeholder="请选择小类" clearable style="width: 100%">
        <el-option
          v-for="item in subCategoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </y-form-item>
    <y-form-item label="备注" prop="remark" :span="24">
      <el-input v-model="form.remark" type="textarea" placeholder="不参与联动" />
    </y-form-item>
    <y-form-item :span="24">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">重置</el-button>
    </y-form-item>
  </y-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref()

const form = reactive({
  type: '',
  category: '',
  subCategory: '',
  remark: ''
})

const rules = {
  type: [{ required: true, message: '请选择采购类型', trigger: 'change' }]
}

const typeOptions = [
  { label: '耗材', value: 'consumable' },
  { label: '设备', value: 'equipment' }
]

const categoryOptions = ref([])
const subCategoryOptions = ref([])

const categoryMap = {
  consumable: [
    { label: '办公用品', value: 'office' },
    { label: '清洁用品', value: 'cleaning' }
  ],
  equipment: [
    { label: '电脑', value: 'computer' },
    { label: '手机', value: 'phone' }
  ]
}

const subCategoryMap = {
  'consumable-office': [
    { label: '文具', value: 'stationery' },
    { label: '纸张', value: 'paper' }
  ],
  'consumable-cleaning': [
    { label: '清洁剂', value: 'detergent' },
    { label: '纸巾', value: 'tissue' }
  ],
  'equipment-computer': [
    { label: '台式机', value: 'desktop' },
    { label: '笔记本', value: 'laptop' }
  ],
  'equipment-phone': [
    { label: '手机', value: 'mobile' },
    { label: '配件', value: 'accessory' }
  ]
}

const handleFormChange = (model, { field, newValue }) => {
  if (field === 'type') {
    model.category = ''
    model.subCategory = ''
    categoryOptions.value = newValue ? categoryMap[newValue] || [] : []
    subCategoryOptions.value = []
  }
  if (field === 'category') {
    model.subCategory = ''
    subCategoryOptions.value = newValue
      ? subCategoryMap[`${model.type}-${newValue}`] || []
      : []
  }
}

const handleSubmit = async () => {
  try {
    const data = await formRef.value.validateSync()
    ElMessage.success(`校验通过：${JSON.stringify(data)}`)
  } catch {
    ElMessage.error('校验失败')
  }
}

const handleReset = () => {
  formRef.value.resetFields()
  categoryOptions.value = []
  subCategoryOptions.value = []
}
</script>
