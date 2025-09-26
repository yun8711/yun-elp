<template>
  <el-form ref="formRef" :model="form">
    <el-form-item label="字段列表" prop="params" hide-required-asterisk>
      <y-table :data="form.tableData" :show-footer="false">
        <y-column-forms label="字段名称" :options="nameFormOptions" :inline="false">
          <template #name="{ row, prop }">
            <el-input v-model.trim.number="row[prop]" placeholder="请输入英文名称"></el-input>
          </template>
          <template #nameCn="{ row, prop }">
            <el-input v-model.trim.number="row[prop]" placeholder="请输入中文名称"></el-input>
          </template>
        </y-column-forms>

        <y-column-forms label="字段配置（inline布局）" :options="formArr" width="400px">
          <template #type="{ row, prop }">
            <y-select v-model="row[prop]" placeholder="字段类型" :options="fieldTypeOptions"></y-select>
          </template>
          <template #length="{ row, prop }">
            <el-input v-model.trim.number="row[prop]" placeholder="长度"></el-input>
          </template>
          <template #precision="{ row, prop }">
            <el-input v-model.trim.number="row[prop]" placeholder="精度"></el-input>
          </template>
        </y-column-forms>

        <y-column-forms label="字段配置（flex布局）" :options="formArr1" :inline="false">
          <template #type="{ row, prop }">
            <y-select v-model="row[prop]" placeholder="字段类型" :options="fieldTypeOptions" type="simple"></y-select>
          </template>
          <template #length="{ row, prop }">
            <el-input v-model="row[prop]" placeholder="长度"></el-input>
          </template>
          <template #precision="{ row, prop }">
            <el-input v-model="row[prop]" placeholder="精度"></el-input>
          </template>
        </y-column-forms>
      </y-table>
    </el-form-item>
  </el-form>

  <div style="text-align:center">
    <el-button @click="submit">验证表单</el-button>
    <el-button @click="reset">重置表单</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnCtx, FormInstance, FormValidateCallback } from 'element-plus'

type TableItemScope = { row: any, column: TableColumnCtx<Record<PropertyKey, any>>, $index: number }

const formRef = ref<FormInstance>()
// 表单配置
const form = ref({
  // 表单数据内绑定表格的数据
  tableData: [
    {
      name: '',
      nameCn: '',
      type: '',
      length: null,
      precision: null,
    },
    {
      name: '',
      nameCn: '',
      type: '',
      length: null,
      precision: null,
    },
  ]
})

const fieldTypeOptions = ['TINYINT', 'SMALLINT', 'INT', 'BIGINT', 'DECIMAL', 'VARCHAR', 'CHAR'];

const nameFormOptions = [
  {
    prop: 'name',
    label: '英文名称',
    labelWidth: '80px',
    rules: [{ required: true, message: '请输入字段名称', trigger: ['blur'] }],
  },
  {
    prop: 'nameCn',
    label: '中文名称',
    labelWidth: '80px',
  },
]

const formArr = [
  {
    prop: 'type',
    width: '160px',
    rules: [{ required: true, message: '请选择字段类型', trigger: ['blur', 'change'] }],
  },
  {
    prop: 'length',
    rules: (scope: TableItemScope, prop: string) => validateLength(scope.row),
    show: (scope: TableItemScope, prop: string) => ['DECIMAL', 'VARCHAR', 'CHAR'].includes(scope.row.type),
    width: '100px',
  },
  {
    prop: 'precision',
    rules: (scope: TableItemScope, prop: string) => validatePrecision(scope.row),
    show: (scope: TableItemScope, prop: string) => 'DECIMAL' === scope.row.type,
    width: '100px',
  },
]

const formArr1 = [
  {
    prop: 'type',
    rules: [{ required: true, message: '请选择字段类型', trigger: ['blur', 'change'] }],
    style: 'width:100%;',
  },
  {
    prop: 'length',
    rules: (scope: TableItemScope, prop: string) => validateLength(scope.row),
    show: (scope: TableItemScope, prop: string) => ['DECIMAL', 'VARCHAR', 'CHAR'].includes(scope.row.type),
    style: 'width:100px;',
  },
  {
    prop: 'precision',
    rules: (scope: TableItemScope, prop: string) => validatePrecision(scope.row),
    show: (scope: TableItemScope, prop: string) => 'DECIMAL' === scope.row.type,
    style: 'width:100px;',
  },
]

const validateLength = (row: any) => {
  const rules = [];
  if (row.type === 'DECIMAL') {
    rules.push({ required: true, message: '请输入长度', trigger: ['blur', 'change'] });
    rules.push({
      validator: (rule: any, value: any, callback: any) => {
        if (value < row.precision) {
          callback(new Error('长度必须大于等于精度'));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    });
    rules.push({
      validator: (rule: any, value: any, callback: any) => {
        if (value < 0) {
          callback(new Error('长度必须大于等于0'));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    });
  }
  return rules;
}

const validatePrecision = (row: any) => {
  const rules = [];
  if (row.type === 'DECIMAL') {
    rules.push({ required: true, message: '请输入精度', trigger: ['blur', 'change'] });
    rules.push({
      validator: (rule: any, value: any, callback: any) => {
        if (value > row.length) {
          callback(new Error('精度必须小于等于长度'));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    });
    rules.push({
      validator: (rule: any, value: any, callback: any) => {
        if (value < 0) {
          callback(new Error('精度必须大于等于0'));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change'],
    });
  }
  return rules;
}

const submit = () => {
  formRef.value?.validate((valid: boolean | undefined) => {
    if (valid) {
      alert('submit!');
    } else {
      return Promise.reject(false);
    }
  });
}

const reset = () => {
  formRef.value?.resetFields();
}

</script>
