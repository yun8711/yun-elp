import DefaultTheme from 'vitepress/theme'
import KdElp from '@kd-elp/components'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/index.scss'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus)
    app.use(KdElp)
  }
} 