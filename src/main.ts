import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from './assets/i18n/i18'

const app = createApp(App)

app.use(ElementPlus)
app.use(i18n)
app.use(router)
app.mount('#app')
