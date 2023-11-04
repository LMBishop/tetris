import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import TetrisBoard from './components/Board/TetrisBoard.vue'

const app = createApp(App)

app.use(router)
app.component('TetrisBoard', TetrisBoard)

app.mount('#app')
