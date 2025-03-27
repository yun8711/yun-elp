import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'normalize.css'
import 'element-plus/dist/index.css'
import KdElp from '@kd-elp/components'
import '@kd-elp/components/styles/index.scss'
import './styles/index.scss'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(KdElp)
app.mount('#app')
