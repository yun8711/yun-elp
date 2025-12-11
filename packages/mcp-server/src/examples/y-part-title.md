### 基础用法

通过 title 属性设置标题文本

```vue
<template>
  <y-part-title title="基础用法" />
</template>
```

### 插槽

```vue
<template>
  <y-part-title title="插槽">
    <template #extra>
      额外内容
    </template>
    <template #right>
      <el-button size="small" type="primary">右侧</el-button>
      <el-button size="small" style="margin-left: 8px;">插槽</el-button>
    </template>
  </y-part-title>
</template>
```
