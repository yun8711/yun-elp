<template>
  <div class="demo-container">
    <!-- 配置面板 -->
    <el-form :model="config" label-width="120px" size="small">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="连续滚动">
            <el-switch v-model="config.continuous" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="滚轮滚动">
            <el-switch v-model="config.wheelScroll" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="滚动步长">
            <el-input-number
              v-model="config.step"
              :min="10"
              :max="200"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="config.continuous">
        <el-col :span="8">
          <el-form-item label="连续滚动速度(px/s)">
            <el-input-number
              v-model="config.continuousStep"
              :min="50"
              :max="2000"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="连续滚动触发时间(ms)">
            <el-input-number
              v-model="config.continuousTime"
              :min="100"
              :max="1000"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 滚动容器 -->
    <YScrollBox
      :height="120"
      :width="'100%'"
      arrow-model="always"
      :step="config.step"
              :continuous-step="config.continuousStep"
        :continuous-time="config.continuousTime"
        :continuous="config.continuous"
      :wheel-scroll="config.wheelScroll"
      @scroll="handleScroll"
    >
      <div class="content-wrapper">
        <div
          v-for="i in 15"
          :key="i"
          class="content-item"
        >
          <div>{{ i }}</div>
        </div>
      </div>
    </YScrollBox>

    <!-- 滚动信息 -->
    <div class="scroll-info">
      <span>当前滚动位置：{{ scrollLeft }}px</span>
      <span>滚动事件次数：{{ scrollCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const config = ref({
  continuous: true,
  wheelScroll: true,
  step: 50,
  continuousStep: 600, // 每秒移动600px，即每50ms移动30px
  continuousTime: 300 // 300ms后开始连续滚动
});

const scrollLeft = ref(0);
const scrollCount = ref(0);

const handleScroll = (left: number) => {
  console.log('handleScroll', left);
  scrollLeft.value = left;
  scrollCount.value++;
};
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.content-wrapper {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.content-item {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.content-item.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  transform: scale(1.05);
}

.scroll-info {
  margin-top: 16px;
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
</style>
