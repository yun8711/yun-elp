<template>
  <div class="y-cron-picker__group">
    <div class="y-cron-picker__row">
      <el-select
        v-model="cronForm.weeks"
        multiple
        collapse-tags
        style="width: 260px"
        :teleported="false"
        @change="selectMultipleChange($event, 'weeks')">
        <el-option
          v-for="item in weekOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </div>
    <div class="y-cron-picker__row">
      <el-time-picker
        v-model="cronForm.timePicker"
        style="width: 260px"
        value-format="HH:mm"
        :clearable="false"
        format="HH:mm"
        :placeholder="t('cronPicker.time')"
        :teleported="false"
        @change="emitChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { ElMessage, ElSelect, ElOption, ElTimePicker } from 'element-plus'
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
  weeks: ['1'],
  timePicker: '00:00',
})

// 计算属性
const weekOptions = computed(() => {
  const weekDaysStr = t('cronPicker.weekDays')
  // 根据字符串是否包含逗号来决定分割方式
  const separator = weekDaysStr.includes(',') ? ',' : ''
  const weekDays = weekDaysStr.split(separator)
  return Array.from(Array(7), (_, i) => {
    return {
      value: i + 1 + '',
      label: weekDays[i],
    }
  })
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
  const hour = cancelZero(cronForm.timePicker?.split(':')[0])
  const minute = cancelZero(cronForm.timePicker?.split(':')[1])
  let cronStr = ''
  if (cronForm.weeks.length === 0) {
    cronStr = `0 ${minute} ${hour} ? * *`
  }
  cronStr = `0 ${minute} ${hour} ? * ${cronForm.weeks.join(',')}`
  return cronStr
})

// 方法
const emitChange = () => {
  emit('change', cronExp.value)
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
