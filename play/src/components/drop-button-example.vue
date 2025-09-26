<template>
  <y-desc :data="object" :config="config" :column="columnFun">
    <template #age-content="{ item, value }">
      {{ value }}123
    </template>
  </y-desc>

  <y-button content="">测试tooltip</y-button>
</template>

<script setup>
const object = {
  name: '张三',
  age: 18,
  gender: '男',
  address: [
    {
      address: '北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区北京市海淀区',
      phone: '12345678901',
      email: 'zhangsan@example.com',
    }
  ],
  other: {
    name: '李四',
    age: 20,
    gender: '女',
  }
}
const config = [
  {
    label: '姓名',
    path: 'name',
  },
  {
    label: '年龄',
    path: 'age',
    prop: 'age',
  },
  {
    label: '性别',
    path: 'gender',
  },
  {
    label: '地址1',
    path: 'address[0].address',
  },
  {
    label: '地址2',
    path: 'address[0].address',
    noTooltip: true
  },
]

const columnFun = (width) => {
  console.log(width)
  if (width < 500) {
    return 1
  } else if (width < 700
