### 基础用法

通过 `steps` 可以定义每步的名称；如果不需要名称，则使用 `stepNumber` 定义步骤数量即可

```vue
<template>
  <y-step :steps="steps" :active-index="1" />

  <el-divider />

  <y-step :step-number="3" :active-index="2" />
</template>

<script setup>
import { ref } from 'vue'
const steps = ref(['步骤1', '步骤2', '步骤3'])
</script>

```

### 自定义样式

通过css变量可以自定义组件中部分样式

```vue
<template>
  <y-step
    :style="{ '--step-height': '100px', '--line-width': '3px', '--active-color': 'red', '--active-text-color': 'blue' }"
    :steps="steps" :active-index="1" />
</template>

<script setup>
import { ref } from 'vue'
const steps = ref(['步骤1', '步骤2', '步骤3'])
</script>

```

### 插槽

通过插槽可以自定义步骤条节点样式，不包含连接线

```vue
<template>
  <y-step :steps="steps" :active-index="1">
    <template #default="{ step, index, active }">
      <div :style="{ color: active ? 'red' : '' }">
        <span>{{ step }}</span>
      </div>
    </template>
  </y-step>
</template>

<script setup>
import { ref } from 'vue'
const steps = ref(['步骤1', '步骤2', '步骤3'])
</script>

```
