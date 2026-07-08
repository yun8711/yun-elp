<template>
  <div>
    <h3>工作时间内执行（9:00-18:00，每15分钟）</h3>
    <y-cron-picker
      v-model="workTimeCron"
      :edit-default-value="workTimeDefaults"
      @change="handleChange"
    />
    <p>当前Cron表达式: {{ workTimeCron }}</p>

    <h3>指定时间执行</h3>
    <y-cron-picker
      v-model="specificTimeCron"
      :edit-default-value="specificTimeDefaults"
      @change="handleChange"
    />
    <p>当前Cron表达式: {{ specificTimeCron }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const workTimeCron = ref('')
const specificTimeCron = ref('')

// 工作时间内执行的默认配置
const workTimeDefaults = ref({
  MINUTE: {
    startTime: '09:00',
    endTime: '18:00',
    perMinute: '15'
  },
  HOUR: {
    startTime: '09:00',
    endTime: '18:00',
    perHour: '1'
  },
  DAY: {
    timePicker: '09:00'
  },
  WEEK: {
    weeks: ['2', '3', '4', '5', '6'], // 周一到周五
    timePicker: '09:00'
  },
  MONTH: {
    days: ['1', '15'], // 每月1号和15号
    timePicker: '09:00'
  },
  YEAR: {
    days: ['1'],
    months: ['1', '7'], // 1月和7月
    timePicker: '09:00'
  }
})

// 指定时间执行的默认配置
const specificTimeDefaults = ref({
  DAY: {
    timePicker: '12:30'
  },
  WEEK: {
    weeks: ['1'], // 每周日
    timePicker: '10:00'
  },
  MONTH: {
    days: ['1'], // 每月1号
    timePicker: '08:00'
  },
  YEAR: {
    days: ['1'],
    months: ['1'], // 每年1月1日
    timePicker: '00:00'
  }
})

const handleChange = (value: string) => {
  console.log('Cron changed:', value)
}
</script>
