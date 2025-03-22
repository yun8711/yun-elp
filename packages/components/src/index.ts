import type { App } from 'vue'
import './styles/index.scss'

// 导入所有组件
import * as components from './components'

// 导出所有组件
export * from './components'

// 插件安装方法
export const install = (app: App) => {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component)
  })
  
  return app
}

// 创建默认导出
export default {
  install
} 