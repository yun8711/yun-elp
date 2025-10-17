<template>
  <y-table :data="tableData">
    <y-column-text prop="name" label="姓名" />

    <!-- <y-column-operation label="label函数" :options="options1" />
    <y-column-operation label="显示/隐藏" :options="options2" width="140" />
    <y-column-operation label="按钮组" :options="options3" /> -->

    <!-- 禁用但不显示提示文案 -->
    <!-- <y-column-operation label="无tooltip" :options="options4" /> -->
    <!-- 禁用并显示默认提示文案 -->
    <!-- <y-column-operation label="默认tooltip" :options="options4" disabledDefaultTip="无权限" /> -->
    <!-- 禁用并自定义提示文案 -->
    <!-- <y-column-operation label="动态tooltip" :options="options5" /> -->

    <!-- 自定义popover -->
    <y-column-operation label="自定义popover" :options="options6" />
  </y-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const loading = ref(false);

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
    prop: 'edit',
    label: '编辑',
    confirm: (scope, item) => {
      console.log('编辑 confirm', scope, item);
    }
  },
  {
    prop: 'delete',
    label: '删除',
    dropdown: true,
    // disabled: [[true,'无权限']],
    popProps: {
      tipContent: '123',
      popContent: '测试',
      noPop: false
    },
    confirm: (scope, item) => {
      console.log('删除 confirm', scope, item);
    }
  }
  // {
  //   prop: 'delete2',
  //   label: '删除2',
  //   dropdown: true,
  //   disabled: [[true, '无权限']],
  //   popProps: {
  //     tipContent: '123',
  //     popContent: "测试",
  //     noPop: false
  //   }
  // }
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

const options6 = ref([
  {
    prop: 'delete',
    label: '删除',
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
