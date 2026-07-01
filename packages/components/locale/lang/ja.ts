import type { YunElpLanguage } from '../type';
/**
 * 日本語言語パック
 * コンポーネントライブラリのカスタムテキスト
 */

export default {
  common: {
    confirm: '確認',
    cancel: 'キャンセル',
    notice: '通知',
    reset: 'リセット'
  },
  empty: {
    description: 'データがありません'
  },
  pop: {
    popContent: 'この操作を実行してもよろしいですか？'
  },
  cronPicker: {
    period: '周期',
    cron: 'Cron',
    preview: 'プレビュー',
    noExecutionTime: '実行時間なし',
    minute: '分',
    hour: '時',
    day: '日',
    week: '週',
    month: '月',
    year: '年',
    from: '開始',
    to: '終了',
    at: 'まで',
    interval: '時間間隔',
    runOnce: '1回実行',
    startTime: '開始時間',
    endTime: '終了時間',
    assignHours: '時間を指定',
    assignMinutes: '分を指定',
    time: '時間',
    weekDays: '日,月,火,水,木,金,土',
    days: '日',
    months: '月',
    selectAtLeastOne: '少なくとも1つ選択してください。デフォルト値に戻しました',
    selectAtLeastTwoHours: '時間指定では2つ以上選択してください',
    placeholder: 'Cron式を選択してください'
  },
  table: {
    totalText: '合計 {total} 件のデータ'
  }
} as YunElpLanguage;
