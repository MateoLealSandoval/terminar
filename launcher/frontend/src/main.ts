import './assets/main.css'
import axios from "axios"
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vue3-toastify/dist/index.css';
import { createPinia } from 'pinia'; 
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

// Configuración de Axios
// IMPORTANTE: No usar /api como prefijo, usar directamente el puerto del gateway
const baseURL = 'http://localhost:3000';

console.log('Configuración Axios:', {
  baseURL,
  currentURL: window.location.href
});

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = false; // Importante para CORS
axios.defaults.timeout = 30000; // 30 segundos

// Interceptor para debugging
axios.interceptors.request.use(
  config => {
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    console.log('   BaseURL:', config.baseURL);
    console.log('   Full URL:', config.baseURL + (config.url || ''));
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error - El servidor no está respondiendo');
      console.error('   Verifica que el gateway esté corriendo en http://localhost:3000');
    } else if (error.code === 'ERR_CANCELED') {
      console.error('❌ Request Canceled');
    } else if (error.response) {
      console.error('❌ Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ No Response - Request made but no response received');
      console.error('   URL:', error.config?.url);
      console.error('   BaseURL:', error.config?.baseURL);
    } else {
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const app = createApp(App)
app.use(FloatingVue)
app.use(createPinia());
app.use(router)
app.mount('#app')