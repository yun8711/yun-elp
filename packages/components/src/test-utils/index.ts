import { render } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { Component } from 'vue'

// 扩展render方法，添加常用测试工具
export function renderComponent(component: Component, options = {}) {
  // 创建userEvent实例用于测试用户交互
  const user = userEvent.setup()

  // 渲染组件
  const result = render(component, {
    ...options
  })

  return {
    ...result,
    user
  }
}

// 等待DOM更新
export function waitForDomUpdate() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// 导出所有testing-library的测试工具
export * from '@testing-library/vue'
