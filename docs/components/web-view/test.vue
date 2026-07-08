<template>
  <div>
    <div class="web-view-demo-container">
      <y-web-view
        :src="targetOrigin"
        ref="webViewRef"
        width="100%"
        height="400px"
        border="1px solid red"
        @load="handleLoad"
        @message="handleMessage"
      />
    </div>

    <div style="display: flex;gap: 10px;align-items: center;margin-top: 10px;">
      <span>选择目标源：</span>
      <el-select
        v-model="targetOrigin"
        placeholder="选择目标源"
        :options="targetOriginOptions"
        style="width:200px"
      ></el-select>
      <span>发送消息：</span>
      <el-input v-model="message" placeholder="发送消息" style="width:200px"></el-input>
      <y-button @click="postMessage">发送消息</y-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'

const webViewRef = ref();
const targetOriginOptions = [
  { label: 'YUN-ELP', value: 'http://localhost:5173/yun-elp/' },
  { label: 'caniuse', value: 'https://caniuse.com/' },
  { label: 'example.org', value: 'https://example.org/' },
  {label:"百度",value:'https://www.baidu.com/'},
]
const targetOrigin = ref('')
const message = ref('')

const handleLoad = (event) => {
  console.log('web-view handleLoad', event);
  ElMessage.info('web-view加载事件：'+JSON.stringify(event))
}

// 接收消息
const handleMessage = (event) => {
  ElMessage.info('web-view消息事件：'+JSON.stringify(event))
}

// 发送消息
const postMessage = () => {
  webViewRef.value?.postMessage(message.value)
}
</script>

<style scoped></style>
