<template>

  <div>
    <y-button @click="onClick" @dblclick="onDblclick" type="primary">
      基础单双击测试：单击计数: {{ clickCount }}，双击计数: {{ dblclickCount }}
    </y-button>
    <div class="result">
      日志：{{ log }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const clickCount = ref(0);
const dblclickCount = ref(0);

const log = ref("");

const addLog = (type: 'click' | 'dblclick') => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  log.value = `${time} - ${type}`;
};

const onClick = () => {
  clickCount.value++;
  addLog('click');
};

const onDblclick = () => {
  dblclickCount.value++;
  addLog('dblclick');
};
</script>

<style scoped>
.result {
  margin-top: 15px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.result p {
  margin: 0 0 10px 0;
  font-weight: 500;
  color: #303133;
}
</style>
