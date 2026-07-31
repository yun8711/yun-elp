<template>
  <y-desc :data="data" :config="config" empty-text="暂无数据" border />
</template>

<script setup>
import { ref } from 'vue'

const data = ref({
  name: null,
  nickname: undefined,
  bio: '',
  note: '   ',
  count: 0,
  enabled: false,
  tags: []
})

const config = ref([
  { label: '姓名(null)', path: 'name' },
  { label: '昵称(undefined)', path: 'nickname' },
  { label: '简介("")', path: 'bio' },
  { label: '备注(空白)', path: 'note' },
  { label: '数量(0)', path: 'count' },
  { label: '启用(false)', path: 'enabled' },
  {
    label: '标签([])',
    path: 'tags',
    emptyRule: value => Array.isArray(value) && value.length === 0,
    emptyText: '无标签'
  },
  { label: '缺失字段', path: 'missing', emptyText: '字段不存在' }
])
</script>
