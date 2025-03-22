import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import KdElp from '@kd-elp/components'
// 暂时注释掉组件库样式导入，稍后解决
// import '@kd-elp/components/src/styles/index.scss'
import App from './App.vue'

import './styles/index.scss'

const app = createApp(App)

app.use(ElementPlus)
app.use(KdElp)

app.mount('#app')
