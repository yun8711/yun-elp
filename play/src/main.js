import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@kd-elp/components/styles/index.scss'
import './styles/index.scss'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
