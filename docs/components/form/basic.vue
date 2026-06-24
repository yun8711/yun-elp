<template>
  <y-form
    :model="form"
    :rules="rules"
    label-width="120px"
    :span="12"
    :gutter="24">
    <y-form-item
      label="姓名"
      prop="name">
      <el-input
        v-model="form.name"
        placeholder="请输入姓名" />
    </y-form-item>
    <y-form-item
      label="年龄"
      prop="age">
      <el-input-number
        v-model="form.age"
        :min="0"
        placeholder="请输入年龄"
        style="width: 100%" />
    </y-form-item>
    <y-form-item
      label="备注"
      prop="remark"
      :span="24">
      <el-input
        v-model="form.remark"
        type="textarea"
        placeholder="请输入备注" />
    </y-form-item>
  </y-form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  age: null,
  remark: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
}
</script>
