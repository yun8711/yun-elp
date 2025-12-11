### 基础用法

默认3列，各列是等宽的，支持 border 属性

```vue
<template>
  <y-desc :data="data" :config="config" />

  <el-divider />

  <y-desc :data="data" :config="config" border />
</template>

<script setup>
import { ref } from 'vue'

const data = ref({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  phone: '13800138000',
  department: '技术部',
  position: '前端工程师',
  salary: '15000',
  addresses: [
    {
      address: '北京市朝阳区某某街道某某小区北京市朝阳区某某街道某某小区北京市朝阳区某某街道某某小区',
      phone: '13800138000',
      email: 'zhangsan@example.com'
    },
    {
      address: '北京市海淀区某某街道某某小区',
      phone: '13800138001',
    }
  ],
})

const config = ref([
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email' },
  { label: '电话', path: 'phone' },
  { label: '部门', path: 'department' },
  { label: '职位', path: 'position' },
  { label: '薪资', path: 'salary' },
  { label: '地址1', path: 'addresses[0].address' },
  { label: '地址2', path: 'addresses[1].address' }
])
</script>

```

### 响应式列数

column 属性支持使用函数来根据组件宽度动态调整，可以手动调整页面宽度来查看效果

```vue
<template>
  <div :style="{ width: width + '%' }">
    <y-desc :data="data" :config="config" :column="column" />

    <el-divider>宽度：{{ innerWidth + 'px' }}</el-divider>

    <y-desc :data="data" :config="config" :column="column" border />
  </div>
  <el-slider v-model="width" :min="10" :max="100" />
</template>

<script setup>
import { ref } from 'vue'

const width = ref(50)
const innerWidth = ref(0)
const column = (width) => {
  innerWidth.value = width
  if (width < 500) {
    return 1
  } else if (width < 800) {
    return 2
  } else if (width < 1200) {
    return 3
  } else {
    return 4
  }
}

const data = ref({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  phone: '13800138000',
  department: '技术部',
  position: '前端工程师',
  salary: '15000',
  addresses: [
    {
      address: '北京市朝阳区某某街道某某小区北京市朝阳区某某街道某某小区北京市朝阳区某某街道某某小区',
      phone: '13800138000',
      email: 'zhangsan@example.com'
    },
    {
      address: '北京市海淀区某某街道某某小区',
      phone: '13800138001',
    }
  ],
})

const config = ref([
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email' },
  { label: '电话', path: 'phone' },
  { label: '部门', path: 'department',span:'column' },
  { label: '职位', path: 'position' },
  { label: '薪资', path: 'salary' },
  { label: '地址1', path: 'addresses[0].address' },
  { label: '地址2', path: 'addresses[1].address' }
])
</script>

```

### 默认插槽用法

当不指定具体的 prop 插槽时，可以使用默认的 `label` 和 `content` 插槽来统一自定义所有项的显示；

```vue
<template>
  <y-desc :data="data" :config="config" :column="2">
    <template #label="{ item }">
      <el-icon><Warning /></el-icon>
      {{ item.label }}
    </template>
    <template #content="{ item, index }">
      <el-tag type="success" v-if="index % 2 === 0">{{ item.content || '默认内容' }}</el-tag>
      <span v-else>{{ item.content || '默认内容' }}</span>
    </template>
  </y-desc>
</template>

<script setup>
import { ref } from 'vue'
import { Warning } from '@element-plus/icons-vue'

const data = ref({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  phone: '13800138000',
  department: '技术部',
  position: '前端工程师'
})

const config = ref([
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email' },
  { label: '电话', path: 'phone' },
  { label: '部门', path: 'department' },
  { label: '职位', path: 'position' }
])
</script>

```

### 具名插槽用法

对于需要使用插槽的配置项，需要提供 prop 属性，`<prop>-label` 是每列中 label 的插槽名，`<prop>-content` 是每列中 content 的插槽名；

```vue
<template>
  <y-desc :data="data" :config="config" :column="2">
    <template #department-label>
      这是department的label插槽
    </template>
  </y-desc>

  <el-divider />

  <y-desc :data="data" :config="config" border :column="2">
    <template #department-content>
      <el-input v-model="data.department" />
    </template>
  </y-desc>
</template>

<script setup>
import { ref } from 'vue'

const data = ref({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  phone: '13800138000',
  department: '技术部',
  position: '前端工程师',
  salary: '15000',
  addresses: [
    {
      address: '北京市朝阳区某某街道某某小区北京市朝阳区某某街道某某小区北京市朝阳区某某街道某某小区',
      phone: '13800138000',
      email: 'zhangsan@example.com'
    },
    {
      address: '北京市海淀区某某街道某某小区',
      phone: '13800138001',
    }
  ],
})

const config = ref([
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email', prop: 'email' },
  { label: '电话', path: 'phone' },
  { label: '部门', path: 'department', prop: 'department' },
  { label: '职位', path: 'position' },
  { label: '薪资', path: 'salary' },
  { label: '地址1', path: 'addresses[0].address' },
  { label: '地址2', path: 'addresses[1].address' }
])
</script>

```
