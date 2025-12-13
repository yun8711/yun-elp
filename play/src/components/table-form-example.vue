<template>
  <el-form ref="formRef" :model="form">
    <el-form-item label="字段列表" prop="params" hide-required-asterisk>
      <y-table :data="form.tableData" :show-footer="false">

        <y-column-form prop="name" label="接口名称" :rules="rules.name">
          <template #default="{ row, prop }">
            <el-input v-model="row[prop]"></el-input>
          </template>
        </y-column-form>

        <y-column-form prop="url" label="地址" :rules="rules.url">
          <template #default="{ row, prop }">
            <el-input v-model="row[prop]" placeholder="请输入接口地址"></el-input>
          </template>
        </y-column-form>


        <y-column-form prop="method" label="请求类型" :rules="rules.method">
          <template #default="{ row }">
            <el-select v-model="row.method" placeholder="请选择请求类型" :options="methodList"></el-select>
          </template>
        </y-column-form>

        <y-column-form prop="columnType" label="参数类型" :rules="rules.columnType">
          <template #default="{ row, prop }">
            <el-select v-model="row[prop]" placeholder="参数类型" :options="columnTypeOptions"></el-select>
          </template>
        </y-column-form>

        <!--函数形式 rules -->
        <y-column-form prop="value" label="参数值" :rules="handleValueRules">
          <template #default="{ row, prop }">
            <el-input v-model="row[prop]" placeholder="请输入参数值"></el-input>
          </template>
        </y-column-form>

        <!--no-form 普通表单项，不参与校验-->
        <y-column-form prop="description" label="备注" no-form>
          <template #default="{ row, prop }">
            <el-input v-model="row[prop]" placeholder="请输入备注"></el-input>
          </template>
        </y-column-form>
      </y-table>
    </el-form-item>
  </el-form>

  <div style="text-align:center">
    <el-button @click="add">新增</el-button>
    <el-button @click="submit" type="primary">验证表单</el-button>
    <el-button @click="reset" type="warning">重置表单</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()

const form = ref({
  tableData: [
    {
      name: '查询用户列表',
      url: '',
      method: '',
      value: '',
      columnType: '',
    },
    {
      name: '编辑用户信息',
      url: '',
      method: '',
      value: '',
      columnType: 'NUMBER',
    },
  ]
})

const rules = {
  name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入接口地址', trigger: 'blur' }],
  method: [{ required: true, message: '请选择请求类型', trigger: ['blur', 'change'] }],
  columnType: [{ required: true, message: '请选择参数类型', trigger: ['blur', 'change'] }],
}

const methodList = [{ label: 'GET', value: 'GET' }, { label: 'POST', value: 'POST' }, { label: 'PUT', value: 'PUT' }, { label: 'DELETE', value: 'DELETE' }];
const columnTypeOptions = [{ label: 'STRING', value: 'STRING' }, { label: 'NUMBER', value: 'NUMBER' }];

const handleValueRules = (scope: any) => {
  const { row }: any = scope;
  if (row.columnType === 'STRING') {
    return [{ required: true, message: '请输入参数值', trigger: 'blur' }];
  }
  if (row.columnType === 'NUMBER') {
    return [{ validator: validateNumber, trigger: 'blur' }];
  }
  return [];
}
const validateNumber = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入参数值'));
  } else {
    if (!Number.isNaN(Number(value))) {
      callback();
    } else {
      callback(new Error('请输入合法数字'));
    }
  }
}


const add = () => {
  form.value.tableData.push({
    name: '',
    url: '',
    method: '',
    value: '',
    columnType: '',
  });
}

const submit = () => {
  formRef.value?.validate((valid: boolean | undefined) => {
    if (valid) {
      console.log(form.value.tableData);
    } else {
      return Promise.reject(false);
    }
  });
}

const reset = () => {
  formRef.value?.resetFields();
}
</script>
