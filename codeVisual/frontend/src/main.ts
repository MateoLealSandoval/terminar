import './assets/main.css'
import './style.css' // NUEVO: Importar los estilos del CAMBIO 17
import axios from "axios"
axios.defaults.baseURL = import.meta.env.VITE_SERVER || 'https://server.docvisual.co'; 
 
axios.defaults.headers.common['Content-Type'] = 'application/json';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vue3-toastify/dist/index.css';
import { createPinia } from 'pinia'; 
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

const app = createApp(App)
app.use(FloatingVue)
app.use(createPinia());
app.use(router)
app.mount('#app')