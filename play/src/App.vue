<template>
  <Layout #default="{ locale, backgroundColor }">
    <y-app-wrap :locale="locale" :key="locale">
      <y-label label="测试">
        <el-input v-model="input" />
      </y-label>

      <div style="width: 50px;">
        <el-text>中性色又称为无彩色系，能在产品界面中调和色彩搭配，衬托主色及其他色彩，同时有利于拉开内容层次，使用户更专注于内容。常用于文字、背景、图标、边框和分割线等元素。arco根据过往业务经验，提供了适合线条、填充和文字的中性色参考色。</el-text>
      </div>

    </y-app-wrap>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import Layout from './components/Layout.vue'


const input = ref('')
</script>

<style lang="scss" scoped></style>
