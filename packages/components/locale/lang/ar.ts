import type { YunElpLanguage } from '../type';
/**
 * حزمة اللغة العربية
 * تتضمن النصوص المخصصة لمكتبة المكونات
 */

export default {
  common: {
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    notice: 'تنبيه',
    reset: 'إعادة تعيين'
  },
  empty: {
    description: 'لا توجد بيانات'
  },
  pop: {
    popContent: 'هل أنت متأكد أنك تريد تنفيذ هذه العملية؟'
  },
  cronPicker: {
    period: 'الفترة',
    cron: 'Cron',
    preview: 'معاينة',
    noExecutionTime: 'لا يوجد وقت تنفيذ',
    minute: 'دقيقة',
    hour: 'ساعة',
    day: 'يوم',
    week: 'أسبوع',
    month: 'شهر',
    year: 'سنة',
    from: 'من',
    to: 'إلى',
    at: 'حتى',
    interval: 'الفاصل الزمني',
    runOnce: 'تشغيل مرة واحدة',
    startTime: 'وقت البدء',
    endTime: 'وقت الانتهاء',
    assignHours: 'تحديد الساعات',
    assignMinutes: 'تحديد الدقائق',
    time: 'الوقت',
    weekDays: 'الأحد,الاثنين,الثلاثاء,الأربعاء,الخميس,الجمعة,السبت',
    days: 'أيام',
    months: 'أشهر',
    selectAtLeastOne: 'يرجى تحديد عنصر واحد على الأقل، تمت استعادة القيمة الافتراضية',
    selectAtLeastTwoHours: 'يرجى تحديد ساعتين على الأقل عند تحديد الساعات',
    placeholder: 'يرجى اختيار تعبير Cron'
  },
  table: {
    total: 'الإجمالي',
    items: 'عناصر من البيانات'
  }
} as YunElpLanguage;
