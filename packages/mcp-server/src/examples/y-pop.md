### 基础用法

```vue
<template>
  <y-pop tip-content="tooltip提示内容">
    <el-button type="primary">基本用法</el-button>
  </y-pop>


  <y-pop tip-content="tooltip提示内容" no-pop>
    <el-button type="primary">只显示tooltip</el-button>
  </y-pop>

  <y-pop>
    <el-button type="primary">只显示popover</el-button>
  </y-pop>
</template>

<script setup lang="ts">

</script>

```

### tooltip 用法

默认情况下，只有配置了 `tipContent` 才会启用内部的 el-tooltip；`tipProps` 支持完整的 el-tooltip 配置

```vue
<template>
  <y-pop tip-content="tooltip提示内容" no-pop>
    <el-button type="primary">测试tooltip</el-button>
  </y-pop>


  <y-pop tip-placement="right" no-pop>
    <el-button type="primary">自定义tooltip</el-button>
    <template #tip-content>
      <div>自定义tooltip内容</div>
      <div>自定义tooltip内容</div>
    </template>
  </y-pop>
</template>

<script setup lang="ts">

</script>

```

### popover 用法

组件内的el-popover主要是为了满足二次确认的场景，但是也支持完全自定义；设置 `no-pop` 则会隐藏内部的 el-popover；`popProps` 支持完整的 el-popover 配置；popover中的操作按钮使用了 y-button，也就是默认支持防抖

```vue
<template>
  <y-pop tip-content="点击触发popover" @confirm="confirm" @cancel="cancel">
    <el-button type="primary">默认popover</el-button>
  </y-pop>

  <y-pop tip-content="点击触发popover" @confirm="confirm" @cancel="cancel" pop-title="自定义popover标题"
    pop-content="自定义popover内容">
    <el-button type="primary">自定义popover文本</el-button>
  </y-pop>

  <y-pop tip-content="点击触发popover">
    <el-button type="primary">自定义popover内容</el-button>
    <template #pop-content>
      <div>自定义popover内容</div>
      <div>自定义popover内容</div>
    </template>
  </y-pop>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
const confirm = () => {
  ElMessage.success('确认');
}
const cancel = () => {
  ElMessage.error('取消');
}
</script>

```
