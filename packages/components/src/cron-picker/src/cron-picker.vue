<template>
  <div class="y-cron-picker">
    <el-popover
      :visible="popoverVisible"
      :width="372"
      placement="bottom"
      popper-style="padding: 0">
      <template #reference>
        <el-input
          v-model="editCronValueTrunk"
          :placeholder="t('cronPicker.placeholder')"
          clearable
          readonly
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
          @click="openPopover">
          <template #suffix>
            <el-icon v-if="isDeleteIcon" class="y-cron-picker__clearable-icon" @click.stop="deleteClick">
              <CircleClose />
            </el-icon>
          </template>
        </el-input>
      </template>

      <div ref="popoverRef" class="y-cron-picker__content">
        <!--调度周期-->
        <div class="y-cron-picker__content-item">
          <div class="y-cron-picker__form-label">
            {{ t('cronPicker.period') }}
          </div>
          <div class="y-cron-picker__form-item">
            <el-select v-model="period" style="width: 260px" :teleported="false">
              <el-option
                v-for="item in periodOptions"
                :key="item.value"
                :label="item.label"
                :disabled="disabledPeriod?.includes(item.value)"
                :value="item.value" />
            </el-select>
            <component
              :is="currentComponent"
              ref="picker"
              :period="period"
              :new-default-value="newDefaultValue"
              @change="onChange" />
          </div>
        </div>
        <!--Cron表达式-->
        <div class="y-cron-picker__content-item">
          <div class="y-cron-picker__form-label">
            {{ t('cronPicker.cron') }}
          </div>
          <div class="y-cron-picker__form-item">
            <el-input :model-value="cron" style="width: 260px" disabled />
          </div>
        </div>
        <!-- 预览-->
        <div class="y-cron-picker__content-item y-cron-picker__content-preview">
          <div class="y-cron-picker__form-label">
            {{ t('cronPicker.preview') }}
          </div>
          <el-input
            type="textarea"
            style="width: 260px; height: 100%"
            :model-value="preTimeList"
            resize="none"
            readonly />
        </div>

        <div class="y-cron-picker__content-actions">
          <el-button
            type="default"
            size="small"
            text
            @click="reset">
            {{ t('common.reset') }}
          </el-button>
          <el-button plain size="small" @click="confirm">{{ t('common.confirm') }}</el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, useTemplateRef } from 'vue'
import { ElMessage, ElButton, ElInput, ElSelect, ElOption, ElPopover, ElIcon } from 'element-plus'
import CronMinute from './components/CronMinute.vue'
import CronHour from './components/CronHour.vue'
import CronDay from './components/CronDay.vue'
import CronWeek from './components/CronWeek.vue'
import CronMonth from './components/CronMonth.vue'
import CronYear from './components/CronYear.vue'
import type { CronPickerProps, CronPickerEmits } from './cron-picker'
import { CronExpressionParser } from 'cron-parser';
import { CircleClose } from '@element-plus/icons-vue'
import { useDateFormat, onClickOutside } from '@vueuse/core'
import { useLocale } from '../../../hooks/use-locale'

defineOptions({
  name: 'YCronPicker',
  inheritAttrs: true
})

const popoverRef = useTemplateRef<HTMLElement>('popoverRef')
onClickOutside(popoverRef, () => {
  popoverVisible.value = false
})
const { t } = useLocale()

const props = defineProps<CronPickerProps>()
const emit = defineEmits<CronPickerEmits>()

// 响应式数据
const popoverVisible = ref(false)
const period = ref('MINUTE')
const cron = ref('')
const preTimeList = ref('')
const isDeleteIcon = ref(false)
const picker = ref()

const periodOptions = [
  {
    value: 'MINUTE',
    label: t('cronPicker.minute')
  },
  {
    value: 'HOUR',
    label: t('cronPicker.hour')
  },
  {
    value: 'DAY',
    label: t('cronPicker.day')
  },
  {
    value: 'WEEK',
    label: t('cronPicker.week')
  },
  {
    value: 'MONTH',
    label: t('cronPicker.month')
  },
  {
    value: 'YEAR',
    label: t('cronPicker.year')
  }
]

const defaultValue = {
  MINUTE: {
    startTime: '00:00',
    endTime: '23:59',
    perMinute: '5'
  },
  HOUR: {
    startTime: '00:00',
    endTime: '23:59',
    perHour: '1',
    assignHours: ['0'],
    assignMinute: '0',
    radio: 'start'
  },
  DAY: {
    timePicker: '00:00'
  },
  WEEK: {
    weeks: ['1'],
    timePicker: '00:00'
  },
  MONTH: {
    days: ['1'],
    timePicker: '00:00'
  },
  YEAR: {
    days: ['1'],
    months: ['1'],
    timePicker: '00:00'
  }
}

// 创建组件映射
const componentMap = {
  MINUTE: CronMinute,
  HOUR: CronHour,
  DAY: CronDay,
  WEEK: CronWeek,
  MONTH: CronMonth,
  YEAR: CronYear
}

// 动态组件
const currentComponent = computed(() => {
  return componentMap[period.value as keyof typeof componentMap]
})

const editCronValueTrunk = computed({
  get() {
    return props.modelValue || ''
  },
  set(v: string) {
    emit('update:modelValue', v)
    emit('change', v)
  }
})

const newDefaultValue = computed(() => {
  if (JSON.stringify(props.editDefaultValue) === '{}') {
    return defaultValue
  } else {
    return Object.assign({}, defaultValue, props.editDefaultValue)
  }
})

// 生命周期
onMounted(() => {
  period.value = props.defaultPeriod || 'MINUTE'
  onFocusHandel()
})

// 方法
const handleMouseLeave = () => {
  isDeleteIcon.value = false
}

const handleMouseEnter = () => {
  isDeleteIcon.value = editCronValueTrunk.value !== ''
}

const deleteClick = () => {
  editCronValueTrunk.value = ''
  isDeleteIcon.value = false
}

const openPopover = () => {
  popoverVisible.value = true
}

const onFocusHandel = () => {
  // 解析现有的cron表达式
  if (editCronValueTrunk.value) {
    const crons = editCronValueTrunk.value.split(' ')
    if (crons.length < 6) return // 确保cron表达式格式正确

    const minutes = crons[1]?.split('/') || []
    const days = crons[2]?.split('-') || []
    let params: any
    if (crons[5] !== '?' && crons[5] !== '*') {
      // 周
      period.value = 'WEEK'
      params = {
        weeks: crons[5]?.split(',') || [],
        timePicker: `${crons[2] || '00'}:${crons[1] || '00'}`
      }
    } else if (crons[4] !== '*') {
      // 年
      period.value = 'YEAR'
      params = {
        days: crons[3]?.split(',') || [],
        months: crons[4]?.split(',') || [],
        timePicker: `${crons[2] || '00'}:${crons[1] || '00'}`
      }
    } else if (crons[3] !== '*') {
      // 月
      period.value = 'MONTH'
      params = {
        days: crons[3]?.split(',') || [],
        timePicker: `${crons[2] || '00'}:${crons[1] || '00'}`
      }
    } else if (days.length === 1) {
      if (crons[2]?.split(',').length === 1) {
        // 日
        period.value = 'DAY'
        params = {
          timePicker: (crons[2] || '00') + ':' + (crons[1] || '00')
        }
      } else {
        // 小时，指定小时
        period.value = 'HOUR'
        params = {
          radio: 'assign',
          assignHours: crons[2]?.split(',') || [],
          assignMinute: crons[1] || '0'
        }
      }
    } else if (minutes.length === 2) {
      period.value = 'MINUTE'
      // 分钟
      params = {
        startTime: (crons[2]?.split('-')[0] || '00') + ':' + (crons[1]?.split('/')[0] || '00'),
        endTime: (crons[2]?.split('-')[1] || '23') + ':59',
        perMinute: crons[1]?.split('/')[1] || '5'
      }
    } else if (minutes.length === 1) {
      period.value = 'HOUR'
      // 小时，开始结束时间
      const endTime = crons[2]?.split('-')[1]?.split('/')[0] || '23'
      params = {
        startTime: (crons[2]?.split('-')[0] || '00') + ':' + (crons[1]?.split('/')[0] || '00'),
        endTime: endTime + ':59',
        perHour: crons[2]?.split('/')[1] || '1',
        minute: crons[1]?.split('/')[1] || '0',
        radio: 'start'
      }
    }
    nextTick(() => {
      if (picker.value?.echoHandel) {
        picker.value.echoHandel(params)
      }
    })
  }
}

const onChange = (cronValue: string) => {
  const format = 'YYYY-MM-DD HH:mm:ss'
  const result: string[] = []
  let newCron = cronValue
  if (cronValue) {
    // if (period.value === 'WEEK') {
    //   // 后端解析是1-7，前端插件是0-6，无奈跟后端妥协，根据周需要自定义判断；
    //   let weeksStr = cronValue.split('*')[1]
    //   const weeks = weeksStr.split(',')
    //   const newWeeks = weeks.map((item: string) => {
    //     return (parseInt(item) - 1).toString()
    //   })
    //   newCron = cronValue.split('*')[0] + '* ' + newWeeks.join(',')
    // }
    // 解析cron，执行预览
    try {
      const interval = CronExpressionParser.parse(newCron)
      for (let i = 0; i < 10; i++) {
        result.push(useDateFormat(interval.next().toString(), format).value)
      }
    } catch (error) {
      console.error('Cron expression parse error:', error)
    }
  }

  preTimeList.value = result.length > 0 ? result.join('\n') : t('cronPicker.noExecutionTime')
  cron.value = cronValue
}

const reset = () => {
  if (picker.value?.reset) {
    picker.value.reset()
  }
}

const close = () => {
  popoverVisible.value = false
}

const confirm = () => {
  const isTyppeHoure = period.value === 'HOUR'
  const isHourRadio = picker.value?.cronForm?.radio === 'assign'
  const assignHoursLength = isTyppeHoure ? picker.value?.cronForm?.assignHours?.length : 0
  // 确定时 调度类型选择小时并且是指定小时 需要判断指定小时最少是两个或两个以上
  if (isTyppeHoure && isHourRadio && assignHoursLength < 2) {
    ElMessage.error(t('cronPicker.selectAtLeastTwoHours'))
  } else {
    editCronValueTrunk.value = cron.value
    // emit('confirm', period.value)
    close()
  }
}

// 暴露方法
defineExpose({
  focus: openPopover,
  blur: close
})
</script>
