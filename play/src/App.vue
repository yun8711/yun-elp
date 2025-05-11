<template>
  <Layout #default="{ locale, backgroundColor }">
    <y-app-wrap :locale="locale" :key="locale">
      <y-label label="测试">
        <el-input v-model="input" />
      </y-label>
    </y-app-wrap>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import Layout from './components/Layout.vue'


const input = ref('')
</script>

<style lang="scss" scoped></style>
