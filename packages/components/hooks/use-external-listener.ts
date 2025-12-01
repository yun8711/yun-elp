import { getCurrentInstance } from 'vue'

/**
 * 检测是否有外部事件监听器的Hook
 * @returns 包含检测方法的对象
 */
export function useExternalListener() {
  const instance = getCurrentInstance()

  /**
   * 检查是否有外部事件监听器
   * @param eventName 事件名称（如：'confirm', 'cancel', 'close'）
   * @returns 是否有外部监听器
   */
  const hasExternalListener = (eventName: string): boolean => {
    if (!instance) return false

    // 检查vnode的props中是否有对应的事件监听器
    const props = instance.vnode.props || {}
    const listenerKey = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`

    return props[listenerKey] !== undefined
  }

  /**
   * 检查多个事件是否有外部监听器
   * @param eventNames 事件名称数组
   * @returns 包含每个事件监听器状态的对象
   */
  const hasMultipleExternalListeners = (eventNames: string[]): Record<string, boolean> => {
    const result: Record<string, boolean> = {}

    eventNames.forEach(eventName => {
      result[eventName] = hasExternalListener(eventName)
    })

    return result
  }

  /**
   * 获取所有外部事件监听器
   * @returns 所有外部事件监听器的键名数组
   */
  const getAllExternalListeners = (): string[] => {
    if (!instance) return []

    const props = instance.vnode.props || {}
    const listeners: string[] = []

    Object.keys(props).forEach(key => {
      if (key.startsWith('on') && key !== 'onUpdate:modelValue') {
        // 将 'onConfirm' 转换为 'confirm'
        const eventName = key.charAt(2).toLowerCase() + key.slice(3)
        listeners.push(eventName)
      }
    })

    return listeners
  }

  return {
    hasExternalListener,
    hasMultipleExternalListeners,
    getAllExternalListeners
  }
}

