import './assets/main.css'
import axios from "axios"
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vue3-toastify/dist/index.css';
import { createPinia } from 'pinia'; 
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

// Configuración mejorada de Axios
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? '/api'  // En desarrollo, usa el proxy configurado en Vite
  : (import.meta.env.VITE_SERVER || 'https://server.docvisual.co');

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para manejar errores de red
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.status, error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de red: No se recibió respuesta del servidor');
    } else {
      // Algo más causó el error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Configuración para manejar archivos
axios.interceptors.request.use(config => {
  // Si es una petición de archivo, configurar el responseType apropiado
  if (config.url?.includes('/files-privates/view-private/') || 
      config.url?.includes('/uploads/')) {
    config.responseType = 'blob';
  }
  return config;
});

const app = createApp(App)
app.use(FloatingVue)
app.use(createPinia());
app.use(router)
app.mount('#app')