<template>
  <div class="y-cron-picker__group">
    <div class="y-cron-picker__row">
      <el-time-picker
        v-model="cronForm.timePicker"
        style="width: 260px"
        value-format="HH:mm"
        format="HH:mm"
        :placeholder="t('cronPicker.time')"
        :clearable="false"
        :teleported="false"
        @change="emitChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElTimePicker } from 'element-plus'
import { computed, onMounted, reactive } from 'vue'
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
  timePicker: '00:00',
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
  return `0 ${minute} ${hour} * * ?`
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
