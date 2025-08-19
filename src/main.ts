import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VueTheMask from 'vue-the-mask'
import './assets/styles/main.css'
import { i18n } from './plugins/i18n'





createApp(App)
    .use(VueTheMask)
    .use(createPinia())
    .use(router)
    .use(i18n)
    .mount('#app')
