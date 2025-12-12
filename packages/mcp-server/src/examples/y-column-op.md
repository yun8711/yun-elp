### 基础用法

```vue
<template>
  <y-table :data="tableData">
    <y-column-text prop="name" label="姓名" />
    <y-column-op label="label函数" :options="options1" />
    <y-column-op label="显示/隐藏" :options="options2" />
    <y-column-op label="按钮组" :options="options3" />
  </y-table>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const tableData = ref([
  {
    id: '1',
    name: '老刘',
    age: '80',
    gender: '男',
    status: 'START'
  },
  {
    id: '2',
    name: '小刘',
    age: '8',
    gender: '女',
    status: 'STOP'
  }
]);

const options1 = ref([
  {
    prop: 'view',
    label: scope => {
      return scope.row.name + '详情';
    },
    confirm: scope => {
      ElMessage.success('This is a message.');
    }
  }
]);

const options2 = ref([
  {
    prop: 'button1',
    label: '按钮1',
    show: (scope, item) => {
      return scope.row.status === 'START';
    }
  },
  {
    prop: 'button2',
    label: '按钮2',
    show: (scope, item) => {
      return scope.row.status === 'STOP';
    }
  },
  {
    prop: 'view',
    label: '切换状态',
    confirm: (scope, item) => {
      scope.row.status = scope.row.status === 'START' ? 'STOP' : 'START';
    }
  }
]);

const options3 = ref([
  {
    prop: 'button1',
    label: '按钮1'
  },
  {
    prop: 'button2',
    label: '按钮2',
    dropdown: true
  },
  {
    prop: 'button3',
    label: '按钮3',
    dropdown: true
  }
]);
</script>

```

### 按钮禁用及tooltip提示

内部使用 `y-pop` 组件展示 `tooltip`

```vue
<template>
  <y-table :data="tableData">
    <y-column-text prop="name" label="姓名" />
    <!-- 禁用但不显示提示文案 -->
    <y-column-op label="无tooltip" :options="options4" />
    <!-- 禁用并显示默认提示文案 -->
    <y-column-op label="默认tooltip" :options="options4" disabledDefaultTip="无权限" />
    <!-- 禁用并自定义提示文案 -->
    <y-column-op label="动态tooltip" :options="options5" />
  </y-table>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const tableData = ref([
  {
    id: '1',
    name: '老刘',
    age: '80',
    gender: '男',
    status: 'START'
  },
  {
    id: '2',
    name: '小刘',
    age: '8',
    gender: '女',
    status: 'STOP'
  }
]);

const options4 = ref([
  {
    prop: 'edit',
    label: '编辑',
    disabled: true
  }
]);

const options5 = ref([
  {
    prop: 'edit',
    label: '编辑',
    disabled: [true, '自定义提示']
  },
  {
    prop: 'edit2',
    label: '编辑2',
    disabled: (scope, item) => {
      if (scope.row.status === 'STOP') {
        return [true, '停止状态不可编辑'];
      } else {
        return false;
      }
    }
  }
]);
</script>

```

### 按钮popover

内部使用 `y-pop` 组件显示 `popover`

```vue
<template>
  <y-table :data="tableData">
    <y-column-text prop="name" label="姓名" />
    <y-column-op label="popover" :options="options6" />
  </y-table>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const tableData = ref([
  {
    id: '1',
    name: '老刘',
    age: '80',
    gender: '男',
    status: 'START'
  },
  {
    id: '2',
    name: '小刘',
    age: '8',
    gender: '女',
    status: 'STOP'
  }
]);

const options6 = ref([
  {
    prop: 'delete',
    label: '删除',
    // 默认不显示popover，只有confirm方法生效，表示按钮本身的点击事件
    // noPop: true,
    confirm: (scope, item) => {
      ElMessage.success('确认删除');
    }
  },
  {
    prop: 'delete2',
    label: '删除2',
    dropdown: true,
    // 显示popover时，confirm和cancel方法都生效，表示弹出框的确认和取消事件
    noPop: false,
    popProps: {
      popContent: '是否确认删除该数据？'
    },
    confirm: (scope, item) => {
      ElMessage.success('确认删除');
    },
    cancel: (scope, item) => {
      ElMessage.info('取消删除');
    }
  }
]);
</script>

```
