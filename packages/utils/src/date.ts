/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式化模板，默认：'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | number | string,
  format = 'YYYY-MM-DD HH:mm:ss'
): string {
  const d = new Date(date)
  
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()
  
  const padZero = (num: number): string => (num < 10 ? `0${num}` : String(num))
  
  return format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, padZero(month))
    .replace(/DD/g, padZero(day))
    .replace(/HH/g, padZero(hour))
    .replace(/mm/g, padZero(minute))
    .replace(/ss/g, padZero(second))
}