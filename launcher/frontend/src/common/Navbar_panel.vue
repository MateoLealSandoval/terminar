<script setup lang="ts">
import { defineProps } from "vue";
import { useRouter } from "vue-router";
// Definir props con TypeScript
defineProps<{
  onAction: () => void;
  isactive: boolean;
}>();
const router = useRouter(); // Obtiene la instancia del enrutador

const goToHome = () => {
  router.push("/"); // Redirige a la ruta raíz
};
</script>
<template>
  <nav class="w-screen relative bg-white shadow h-[10dvh] ">
    <div class="w-[90%] md:w-full container flex mx-auto justify-between  ">
      <div class="flex items-center justify-between h-full  ">
        <img class="w-auto h-[10vh]   p-4 cursor-pointer" src="@/assets/images/LogoPng.webp" alt="Logo"  @click="goToHome">
      </div>
      <button @click="onAction" v-if="!isactive"
        class="p-8 text-[var(--blue-1)] hover:text-cyan-700 focus:outline-none   cursor-pointer  ">
        <svg xmlns="http://www.w3.org/2000/svg" class=" h-10 w-10 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
  </nav>
</template>