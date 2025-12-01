<template>
  <div class="y-cron-picker__group">
    <div class="y-cron-picker__row">
      <el-radio
        v-model="cronForm.radio"
        value="start"
        style="margin-right: 0"
        @change="emitChange">
        <span />
      </el-radio>
      <span style="margin-right: 4px;">{{ t('cronPicker.from') }}</span>
      <el-time-picker
        v-model="cronForm.startTime"
        style="width: 90px"
        value-format="HH:mm"
        format="HH:mm"
        :clearable="false"
        :placeholder="t('cronPicker.startTime')"
        :disabled="startDisabled"
        :teleported="false"
        @change="emitChange" />
      <span style="margin:0 4px;">{{ t('cronPicker.to') }}</span>
      <el-time-picker
        v-model="cronForm.endTime"
        style="width: 90px"
        value-format="HH:mm"
        format="HH:mm"
        :picker-options="{
          selectableRange: `${cronForm.startTime}:00 - 23:59:00`,
        }"
        :disabled="startDisabled"
        :placeholder="t('cronPicker.endTime')"
        :clearable="false"
        :teleported="false"
        @change="endTimeChange" />
      <span style="margin-left: 4px;">{{ t('cronPicker.at') }}</span>
    </div>

    <div class="y-cron-picker__row y-cron-picker__row-interval">
      <span>{{ t('cronPicker.interval') }}</span>
      <el-select
        v-model="cronForm.perHour"
        style="width: 120px;margin:0 4px;"
        :disabled="startDisabled"
        :teleported="false"
        @change="emitChange">
        <el-option
          v-for="item in perHourOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      <span>{{ t('cronPicker.runOnce') }}</span>
    </div>

    <div class="y-cron-picker__row">
      <el-radio
        v-model="cronForm.radio"
        value="assign"
        style="margin-right: 0"
        @change="emitChange">
        <span />
      </el-radio>
      <span style="margin-right: 8px;" :style="{ width: labelWidth }">{{ t('cronPicker.assignHours') }}</span>
      <el-select
        v-model="cronForm.assignHours"
        multiple
        collapse-tags
        :disabled="assignDisabled"
        style="width:180px"
        :teleported="false"
        @change="selectMultipleChange($event, 'assignHours')">
        <el-option
          v-for="item in hourOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </div>

    <div class="y-cron-picker__row y-cron-picker__row-interval">
      <span style="margin-right: 8px;" :style="{ width: labelWidth }">{{ t('cronPicker.assignMinutes') }}</span>
      <el-select
        v-model="cronForm.assignMinute"
        :disabled="assignDisabled"
        style="width:180px"
        :teleported="false"
        @change="emitChange">
        <el-option
          v-for="item in minuteOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { ElMessage, ElRadio, ElSelect, ElOption, ElTimePicker } from 'element-plus'
import { useLocale } from '../../../../hooks/use-locale'

interface Props {
  period: string
  newDefaultValue: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [value: string]
}>()

const { t, localeCode } = useLocale()

const cronForm = reactive({
  startTime: '00:00',
  endTime: '23:59',
  perHour: '1',
  assignHours: ['0'],
  assignMinute: '0',
  radio: 'start',
})

const labelWidth = computed(() => {
  return localeCode === 'zh-cn' ? '60px' : '50px'
})

// 计算属性
const hourOptions = computed(() => {
  return Array.from(Array(24), (_, i) => {
    return {
      value: i + '',
      label: i + t('cronPicker.hour'),
    }
  })
})

const perHourOptions = computed(() => {
  return Array.from(Array(23), (_, i) => {
    return {
      value: i + 1 + '',
      label: i + 1 + t('cronPicker.hour'),
    }
  })
})

const minuteOptions = computed(() => {
  return Array.from(Array(60), (_, i) => {
    return {
      value: i + '',
      label: i + t('cronPicker.minute'),
    }
  })
})

const startDisabled = computed(() => {
  return cronForm.radio !== 'start'
})

const assignDisabled = computed(() => {
  return cronForm.radio !== 'assign'
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

  let cronStr = ''
  if (cronForm.radio === 'start') {
    cronStr = `0 ${hourBegin.minute} ${hourBegin.hour}-${hourEnd.hour}/${cronForm.perHour} * * ?`
  } else {
    cronStr = `0 ${cronForm.assignMinute} ${cronForm.assignHours.join(',')} * * ?`
  }
  return cronStr
})

// 方法
const emitChange = () => {
  emit('change', cronExp.value)
}

const endTimeChange = () => {
  const hour = cronForm.endTime.split(':')[0]
  cronForm.endTime = hour + ':59'
  emitChange()
}

const selectMultipleChange = (val: any, name: string) => {
  if (val.length === 0) {
    cronForm[name as keyof typeof cronForm] = props.newDefaultValue[props.period][name]
    ElMessage.error(t('cronPicker.selectAtLeastOne'))
  }
  emitChange()
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
