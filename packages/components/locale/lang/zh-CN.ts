import type { YunElpLanguage } from '../type';
/**
 * 简体中文语言包
 * 包含组件库自定义的文本内容
 */

export default {
  // 通用
  common: {
    confirm: '确认',
    cancel: '取消',
    notice: '提示',
    reset: '重置'

    // submit: '提交',
    // clear: '清空',
    // close: '关闭',
    // loading: '加载中',
    // search: '搜索',
    // more: '更多',
    // all: '全部'
  },
  empty: {
    description: '暂无数据'
  },
  pop: {
    popContent: '是否执行该操作？'
  },
  // CronPicker 定时选择器
  cronPicker: {
    period: '周期',
    cron: 'Cron',
    preview: '预览',
    noExecutionTime: '无执行时间',
    minute: '分钟',
    hour: '小时',
    day: '日',
    week: '周',
    month: '月',
    year: '年',
    from: '从',
    to: '到',
    at: '为止',
    interval: '时间间隔',
    runOnce: '运行一次',
    startTime: '开始时间',
    endTime: '结束时间',
    assignHours: '指定小时',
    assignMinutes: '指定分钟',
    time: '时间',
    weekDays: '周日,周一,周二,周三,周四,周五,周六',
    days: '日',
    months: '月',
    selectAtLeastOne: '至少选择一项,已恢复默认值',
    selectAtLeastTwoHours: '指定小时最少选择两个',
    placeholder: '请选择Cron表达式'
  }

  // 按钮组件

  // 可以添加更多组件的国际化内容
  // ...其他组件
} as YunElpLanguage;
