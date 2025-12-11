### 基础用法

```vue
<template>
  <el-space direction="vertical">
    <y-label label="用户名">admin</y-label>
    <y-label label="密码" colon=":">123456 </y-label>
  </el-space>
</template>

<script setup>
import { ref } from 'vue'


const input1 = ref('')
</script>

```

### 组件尺寸

label组件内部使用flex布局方式

```vue
<template>
  <y-label label="用户名" colon=":" height="100px" :label-style="labelStyle" :content-style="contentStyle">
    Yingdu Building, Zhichun Road, BeijingYingdu Building, Zhichun Road, BeijingYingdu Building, Zhichun Road,
    BeijingYingdu Building, Zhichun Road
  </y-label>
</template>

<script setup>
const labelStyle = {
  color: 'red',
  backgroundColor: '#eee',
  justifyContent: 'flex-start',
  alignItems: 'flex-start'
}

const contentStyle = {
  color: 'blue',
  backgroundColor: '#eee',
  justifyContent: 'flex-end',
  alignItems: 'flex-end'
}
</script>

```

### 插槽

提供了前后置插槽

```vue
<template>
  <y-label label="用户名">
    <template #prefix>
      <el-tooltip class="box-item" effect="dark" content="前置插槽" placement="top">
        <el-icon>
          <WarningFilled />
        </el-icon>
      </el-tooltip>
    </template>
    admin
    <template #suffix>
      <el-tooltip class="box-item" effect="dark" content="后置插槽" placement="right">
        <el-icon>
          <WarningFilled />
        </el-icon>
      </el-tooltip>
    </template>
  </y-label>
</template>

<script setup>
import {WarningFilled} from "@element-plus/icons-vue"
</script>

```
