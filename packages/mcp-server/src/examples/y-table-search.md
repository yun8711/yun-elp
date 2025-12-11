### 多行模式

通常用于首行为模糊搜索，例如关键词，更多精准的搜索条件需要通过展开操作才展示。需要展示在首行的配置项设置 first:true 即可

```vue
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

```

### 单行模式

当options配置项中没有配置项为 first:true 时，即为单行模式，所有表单项平铺展示，且没有展开/收起操作

```vue
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

```

### 动态属性和值格式化

支持根据表单状态和组件状态动态调整字段的显示、禁用等属性。同时支持值格式化，可以在值更新时对值进行处理

```vue
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

```
