<template>
  <div class="y-cron-picker__group">
    <div class="y-cron-picker__row">
      <span style="margin-right: 4px">{{ t('cronPicker.from') }}</span>
      <el-time-picker
        v-model="cronForm.startTime"
        style="width: 98px"
        value-format="HH:mm"
        format="HH:mm"
        :clearable="false"
        :placeholder="t('cronPicker.startTime')"
        :teleported="false"
        @change="emitChange" />
      <span style="margin:0 4px">{{ t('cronPicker.to') }}</span>
      <el-time-picker
        v-model="cronForm.endTime"
        style="width: 98px"
        value-format="HH:mm"
        format="HH:mm"
        :clearable="false"
        :picker-options="{
          selectableRange: `${cronForm.startTime}:00 - 23:59:00`,
        }"
        :placeholder="t('cronPicker.endTime')"
        :teleported="false"
        @change="emitChange" />
      <span style="margin-left: 4px">{{ t('cronPicker.at') }}</span>
    </div>
    <div class="y-cron-picker__row">
      <span>{{ t('cronPicker.interval') }}</span>
      <el-select
        v-model="cronForm.perMinute"
        style="width: 120px;margin:0 4px;"
        :teleported="false"
        @change="emitChange">
        <el-option
          v-for="item in minuteOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      <span>{{ t('cronPicker.runOnce') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from '@vue/runtime-core'
import { useLocale } from '../../../../hooks/use-locale'

interface Props {
  period: string
  newDefaultValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [value: string]
}>()

const { t } = useLocale()

const cronForm = reactive({
  startTime: '00:00',
  endTime: '23:59',
  perMinute: '5',
})

// 计算属性
const minuteOptions = computed(() => {
  const arr = ['5', '10', '15', '20', '30']
  const list = arr.map((item) => {
    return {
      value: item,
      label: item + t('cronPicker.minute'),
    }
  })
  return list
})

const cancelZero = (val: string) => {
  if (val && val.length > 1 && String(val[0]) === '0') {
    const newLength = val.length - 1
    return val.slice(-newLength)
  } else {
    return val
  }
}

const cronExp = computed(() => {
  const hourBegin = {
    hour: cancelZero(cronForm.startTime?.split(':')[0]),
    minute: cancelZero(cronForm.startTime?.split(':')[1]),
  }
  const hourEnd = {
    hour: cancelZero(cronForm.endTime?.split(':')[0]),
    minute: cancelZero(cronForm.endTime?.split(':')[1]),
  }

  return `0 ${hourBegin.minute}/${cronForm.perMinute} ${hourBegin.hour}-${hourEnd.hour} * * ?`
})

// 方法
const emitChange = () => {
  emit('change', cronExp.value)
}

const reset = () => {
  Object.assign(cronForm, props.newDefaultValue[props.period])
  emitChange()
}

const echoHandel = (params: any) => {
  Object.assign(cronForm, params)
  emitChange()
}

// 生命周期
onMounted(() => {
  reset()
})

// 暴露方法
defineExpose({
  reset,
  echoHandel,
  cronForm
})
</script>
