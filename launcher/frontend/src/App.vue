<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './store'
import { onMounted, ref } from 'vue' // 🔹 Faltaba importar onMounted


const authStore = useAuthStore();
const showCookiesBanner = ref(false);
onMounted(async () => {
  if (localStorage.getItem("token")) {
    await authStore.refreshToken();
  }
  if (!localStorage.getItem("cookiesAccepted")) {
    showCookiesBanner.value = true;
  }
});
const acceptCookies = () => {
  localStorage.setItem("cookiesAccepted", "true");
  showCookiesBanner.value = false;
};
</script>

<template>
  <RouterView />
  <div v-if="showCookiesBanner"
    class="  fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-100 text-gray-600 p-4 rounded-lg w-[95%]  md:w-[50%] text-[8px] md:text-[10px]     lg:flex items-center space-x-4 shadow-lg z-50 ">
    <p class="text-sm mb-3">Este sitio web utiliza cookies propias y de terceros para recopilar información que nos ayuda a
      optimizar su visita a la página web y que son imprescindibles para el correo funcionamiento del método de
      aprendizaje en ningún caso se utilizaran para recoger información de carácter personal Más información</p>
    <div class="font-poppins">
      <button @click="acceptCookies"
        class="  border border-gray-300 text-gray-600  px-4 py-2 rounded-md font-semibold mb-4   text-xs cursor-pointer">
        Aceptar todas
      </button>
      <button @click="acceptCookies"
        class="inline-flex items-center px-4 rounded-md font-semibold underline underline-offset-2 whitespace-nowrap text-xs cursor-pointer">
        Solo necesarias.
      </button>
    </div>
  </div>
</template>

<style scoped></style>
