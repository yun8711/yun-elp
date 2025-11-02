import { createApp } from 'vue'
import 'normalize.css'
import 'virtual:uno.css'
import YunElp from '../../packages/components/index'
import '@yun-elp/theme-chalk/src/index.scss'
import './styles/index.scss'
import './styles/menu.scss'
import App from './App.vue'

const app = createApp(App)

app.use(YunElp)
app.mount('#app')
