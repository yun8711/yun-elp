### 多选模式

默认情况下为多选模式

```vue
<template>
  <y-row-select v-model="value" :options="options" @change="changeHandle"></y-row-select>

  <div style="margin-top: 20px;">选中值：{{ value }}</div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

const options = ref([])

for (let i = 0; i < 30; i++){
  options.value.push({
    label: "选项" + i,
    value:i
  })
}


const changeHandle = (val) => {
  console.log(val)
}

</script>

```

### 单选模式

```vue
<template>
  <y-row-select v-model="value" :options="options" @change="changeHandle" label-text="单选" single all-text="不限"></y-row-select>

  <div style="margin-top: 20px;">选中值：{{ value }}</div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

const options = ref([])

for (let i = 0; i < 30; i++){
  options.value.push({
    label: "选项" + i,
    value:i
  })
}


const changeHandle = (val) => {
  console.log(val)
}

</script>

```

### 高级用法

可以将多个 RowSelect 组合成为高级筛选组件

```vue
<template>
  <div class="advance-wrap">
    <div class="advance-title">
      <span>高级筛选</span>
      <el-button type="primary" size="small" @click="reset">重置</el-button>
    </div>
    <div class="advance-content">
      <y-row-select :key="item.prop" ref="rowSelectRefs" v-for="item in options" v-model="form[item.prop]" :options="item.options"
        :label-text="item.label" />
    </div>
  </div>

  <div>
    <pre>{{ form }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({})

const rowSelectRefs = ref([])

// 基础用法
const options = ref([
  {
    prop: 't1',
    label: 't1',
    options: []
  },
  {
    prop: 't2',
    label: 't2',
    options: []
  },
  {
    prop: 't3',
    label: 't3',
    options: []
  }
])

options.value.forEach(item => {
  for (let i = 0; i < 30; i++) {
    item.options.push({
      label: item.label + '-' + i,
      value: item.prop + '-' + i,
      disabled: i % 2 === 0
    })
  }
})

const reset = () => {
  rowSelectRefs.value.forEach(item => {
    item.reset()
  })
}
</script>

<style scoped>
.advance-wrap {
  width: 100%;
  border: 1px solid #e5e5e5;

  .advance-title {
    font-size: 14px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 16px;
    height: 40px;
    box-sizing: border-box;
  }

  .advance-content {
    padding: 8px 16px;
  }
}
</style>

```
