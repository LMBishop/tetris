import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import TetrisBoard from './components/TetrisBoard.vue'
import Home from './components/Home.vue'
import QrcodeVue from 'qrcode.vue'

const app = createApp(App)

app.use(router)
app.component('TetrisBoard', TetrisBoard)
app.component('Home', Home)
app.component('QRCode', QrcodeVue)

app.mount('#app')
