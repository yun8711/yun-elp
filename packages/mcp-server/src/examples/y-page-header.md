### 基础用法

```vue
<template>
  <y-page-header title="用户管理" border>
    <template #extra>
      <el-button type="primary" size="small">extrt插槽</el-button>
    </template>

    <template #right>
      <el-button size="small">刷新</el-button>
      <el-button size="small">导出</el-button>
    </template>
  </y-page-header>
</template>

```
