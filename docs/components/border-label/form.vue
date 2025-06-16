<template>
  <el-space wrap>
    <y-border-label label="el-input">
      <el-input v-model="state1" />
    </y-border-label>
    <y-border-label label="el-input-number">
      <el-input-number v-model="state2" :min="1" :max="10" />
    </y-border-label>
    <y-border-label label="el-autocomplete">
      <el-autocomplete v-model="state3" :fetch-suggestions="querySearch" />
    </y-border-label>
    <y-border-label label="el-select">
      <el-select v-model="state4" style="width:200px">
        <el-option v-for="item in list" :key="item.value" :label="item.value" :value="item.value" />
      </el-select>
    </y-border-label>
    <y-border-label label="el-select-v2" width="300px">
      <el-select-v2 v-model="state12" :options="selectV2options" />
    </y-border-label>

    <y-border-label label="el-date-picker:date">
      <el-date-picker v-model="state5" type="date" />
    </y-border-label>
    <y-border-label label="el-date-picker:daterange">
      <el-date-picker v-model="state6" type="daterange" start-placeholder="Start date" end-placeholder="End date" />
    </y-border-label>
    <y-border-label label="el-date-picker:datetime">
      <el-date-picker v-model="state7" type="datetime" />
    </y-border-label>
    <y-border-label label="el-time-picker">
      <el-time-picker v-model="state8" />
    </y-border-label>
    <y-border-label label="el-time-select">
      <el-time-select v-model="state9" />
    </y-border-label>
    <y-border-label label="el-tree-select" width="300px">
      <el-tree-select v-model="state11" :data="treeData" />
    </y-border-label>
    <y-border-label label="el-cascader" width="300px">
      <el-cascader v-model="state13" :options="cascaderOptions" />
    </y-border-label>

    <y-border-label label="el-mention" width="300px">
      <el-mention v-model="state10" :options="mentionOptions" />
    </y-border-label>
  </el-space>
</template>

<script setup>
import { ref } from 'vue'

const state1 = ref('')
const state2 = ref(1)
const state3 = ref('')
const state4 = ref('')
const state5 = ref('')
const state6 = ref('')
const state7 = ref('')
const state8 = ref('')
const state9 = ref('')
const state10 = ref('@')
const state11 = ref()
const state12 = ref()
const state13 = ref()
const list = [
  { value: 'vue', link: 'https://github.com/vuejs/vue' },
  { value: 'element-plus', link: 'https://github.com/element-plus/element-plus' },
  { value: 'cli', link: 'https://github.com/vuejs/vue-cli' },
  { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
  { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' }
]
const querySearch = (queryString, cb) => {
  const results = queryString ? list.filter(createFilter(queryString)) : list
  cb(results)
}

const cascaderOptions = ref([
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'shejiyuanze',
        label: '设计原则',
        children: [
          {
            value: 'yizhi',
            label: '一致'
          },
          {
            value: 'fankui',
            label: '反馈'
          }
        ]
      },
      {
        value: 'daohang',
        label: '导航',
        children: [
          {
            value: 'cexiangdaohang',
            label: '侧向导航'
          }
        ]
      }
    ]
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      {
        value: 'zujian1',
        label: '组件1',
        children: [
          {
            value: 'zujian11',
            label: '组件11'
          },
          {
            value: 'zujian12',
            label: '组件12'
          }
        ]
      },
      {
        value: 'zujian2',
        label: '组件2',
        children: [
          {
            value: 'zujian21',
            label: '组件21'
          }
        ]
      }
    ]
  }
])

const mentionOptions = ref([
  {
    label: 'Fuphoenixes',
    value: 'Fuphoenixes',
  },
  {
    label: 'kooriookami',
    value: 'kooriookami',
  },
  {
    label: 'Jeremy',
    value: 'Jeremy',
  },
  {
    label: 'btea',
    value: 'btea',
  },
])

const treeData = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const selectV2options = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
}))
</script>