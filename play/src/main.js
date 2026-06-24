import { createApp } from 'vue';
import 'normalize.css';
import YunElp from '@yun-elp/components';
import '@yun-elp/theme-chalk/index.scss';
import '@yun-elp/theme-chalk/themes/switchable.scss';
import './styles/index.scss';
import App from './App.vue';

const app = createApp(App);

app.use(YunElp);
app.mount('#app');
