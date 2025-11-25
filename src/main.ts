import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUmoEditor } from '@umoteam/editor'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(useUmoEditor, { locale: 'en-US' })

app.mount('#app')
