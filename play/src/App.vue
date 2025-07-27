<template>
  <Layout #default="{ locale }">
    <y-app-wrap :key="locale" :elp-config="{ locale: locale === 'zh-CN' ? zhCn : en }" :locale="locale"
      v-bind="appWrapConfig">

    </y-app-wrap>
  </Layout>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import Layout from './components/Layout.vue'
import { User, InfoFilled } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
// import { ElAutocomplete, ElCascader, ElRadioGroup, ElRadio } from 'element-plus'
import { treeData } from './test-data'

const appWrapConfig = {
  'border-label': {
    width: '316px',
    height: '32px'
  }
}


const querySearch = (queryString, cb) => {
  console.log(queryString)
  cb([{ value: '123' }, { value: '456' }, { value: '789' }])
}

const options1 = ref([])

// 生成选项
for (let i = 0; i < 3; i++){
  options1.value.push({
    label: "选项选项选项" + i,
    value: i,
    // disabled: i % 2 === 0
  })
}

const options2 = ref([
  {
    label: '关键词',
    prop: 'f1',
    first: true
  },
  {
    label: '下拉单选',
    prop: 'f2',
    custom: true,
  },
  {
    label: '自动补全输入',
    prop: 'f3',
    comp: markRaw(ElAutocomplete),
    initValue: '',
    innerAttrs: {
      fetchSuggestions: querySearch,
      // placeholder: '请输入内容'
    }
  },
  {
    label: '级联选择',
    prop: 'f4',
    comp: markRaw(ElCascader),
    innerAttrs: (params) => {
      // console.log('级联选择参数:', params)
      return {
        options: treeData,
        clearable: true,
        disabled: !params.isFold
      }
    }
  },
  {
    label: '日期选择',
    prop: 'f5',
    comp: markRaw(ElDatePicker),
    valueFormat: (value, prop, form) => {
      console.log('日期选择值格式化:', value, form)
      return {
        startTime: value[0] ?? '',
        endTime: value[1] ?? ''
      }
    },
    innerAttrs: (params) => {
      // console.log('日期选择参数:', params)
      return {
        type: 'date',
        placeholder: params.form.f2 === '1' ? '请选择日期1' : '请选择日期2',
        type: "datetimerange",
        valueFormat: "YYYY-MM-DD HH:mm:ss"
      }
    }
  }
])



const form = ref({
  f1: '',
  f2:'',
})
const changeHandle = (e) => {
  console.log(e)
}
</script>

<style lang="scss" scoped>
.demo-block {
  margin-bottom: 32px;

  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}
</style>
