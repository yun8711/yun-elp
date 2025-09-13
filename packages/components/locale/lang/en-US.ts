import type { YunElpLanguage } from '../type';
/**
 * 英文语言包
 * 包含组件库自定义的文本内容
 */

export default {
  // Common
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    notice: 'Notice',
    reset: 'Reset',

    // submit: 'Submit',
    // clear: 'Clear',
    // close: 'Close',
    // loading: 'Loading',
    // search: 'Search',
    // more: 'More',
    // all: 'All'
  },
  empty: {
    description: 'No data'
  },
  pop: {
    popContent: 'Are you sure you want to perform this operation?'
  },
  // CronPicker Timer Selector
  cronPicker: {
    period: 'Period',
    cron: 'Cron',
    preview: 'Preview',
    noExecutionTime: 'No execution time',
    minute: 'Minute',
    hour: 'Hour',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    from: 'From',
    to: 'To',
    at: 'At',
    interval: 'Time Interval',
    runOnce: 'Run Once',
    startTime: 'Start Time',
    endTime: 'End Time',
    assignHours: 'Assign Hours',
    assignMinutes: 'Assign Minutes',
    time: 'Time',
    weekDays: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
    days: 'Days',
    months: 'Months',
    selectAtLeastOne: 'Select at least one item, default value restored',
    selectAtLeastTwoHours: 'Select at least two hours for assign hours',
    placeholder: 'Please select Cron expression'
  },
  table: {
    total: 'Total',
    items: 'items of data'
  }

  // Button component

  // Add more components translations as needed
  // ...other components
} as YunElpLanguage;
