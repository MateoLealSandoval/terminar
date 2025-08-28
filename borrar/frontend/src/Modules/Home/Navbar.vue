<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Ruta actual reactiva
const currentRoute = ref('');
onMounted(() => {
  currentRoute.value = route.path;
});
watch(() => route.path, (newPath) => {
  currentRoute.value = newPath;
}, { immediate: true });

// Estados de los dropdowns
const open_tipe_auth = ref(false);
const open_tipe_auth_movile = ref(false);
const open_specialist = ref(false);
const open_specialistMovile = ref(false);

// Referencias a los dropdowns
const patientRef = ref<HTMLElement | null>(null);
const specialistRef = ref<HTMLElement | null>(null);

// Toggle de dropdowns
const toggleauth = () => {
  open_tipe_auth.value = !open_tipe_auth.value;
  if (open_specialist.value === true) {
    open_specialist.value = false;
  }
};

const toggleAuthMovile = () => {
  open_specialistMovile.value = false;
  open_tipe_auth_movile.value = !open_tipe_auth_movile.value;
}

const toggle_specialistMovile = () => {
  open_tipe_auth_movile.value = false;
  open_specialistMovile.value = !open_specialistMovile.value;
}

const toggle_specialist = () => {
  open_specialist.value = !open_specialist.value;
  if (open_tipe_auth.value === true) {
    open_tipe_auth.value = false;
  }
};

// Navegación
const goToAbout = (rute: string) => {
  if (route.path !== rute) {
    router.push(rute);
  }
  // Cierra todo después de navegar
  isOpen.value = false;
  open_tipe_auth.value = false;
  open_specialist.value = false;
};

// Menú lateral
const isOpen = ref(false);
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

// Función para cerrar dropdowns si se hace clic fuera
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;

  if (
    open_tipe_auth.value &&
    patientRef.value &&
    !patientRef.value.contains(target)
  ) {
    open_tipe_auth.value = false;
  }

  if (
    open_specialist.value &&
    specialistRef.value &&
    !specialistRef.value.contains(target)
  ) {
    open_specialist.value = false;
  }
}

// Registrar / eliminar evento global
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav class="w-full sticky top-0 bg-white shadow z-50 md:static">
    <div class="w-[85%] md:w-[90%] py-2 mx-auto md:flex">

      <div class="flex items-center justify-between">
        <a @click="goToAbout('/')">
          <img class="w-auto h-8 md:h-10 cursor-pointer" src="@/assets/images/LogoPng.webp" alt="Logo">
        </a>

        <!-- Mobile menu button -->
        <div class="flex lg:hidden">
          <button @click="toggleMenu" type="button" class="text-gray-500 hover:text-gray-600 focus:outline-none"
            aria-label="toggle menu">
            <!-- Icono de abrir -->
            <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
            </svg>
            <!-- Icono de cerrar -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menú móvil -->
      <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/30" @click.self="isOpen = false">
        <div
          class="fixed top-0 left-0 z-50 w-64 max-w-[80%] h-full bg-white shadow-xl transform transition-all duration-300 ease-in-out"
          :class="{
            'translate-x-0 opacity-100 pointer-events-auto': isOpen,
            '-translate-x-full opacity-0 pointer-events-none': !isOpen
          }">
          <div class="flex flex-col items-start px-4 pt-6 pb-10 space-y-4">
            
            <!-- Home -->
            <div class="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6"
                :style="{ color: currentRoute === '/' ? 'var(--blue-1)' : 'black' }">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <a class="cursor-pointer font-poppins font-semibold text-md text-black hover:text-[var(--blue-1)]"
                @click="goToAbout('/'); toggleMenu()"
                :style="{ color: currentRoute === '/' ? 'var(--blue-1)' : 'black' }">
                Home
              </a>
            </div>

            <!-- Agenda tu cita -->
            <div class="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6"
                :style="{ color: currentRoute === '/specialists' ? 'var(--blue-1)' : 'black' }">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
              </svg>
              <a class="cursor-pointer font-poppins font-semibold text-md text-black hover:text-[var(--blue-1)]"
                @click="goToAbout('/specialists'); toggleMenu()"
                :style="{ color: currentRoute === '/specialists' ? 'var(--blue-1)' : 'black' }">
                Agenda tu cita
              </a>
            </div>

            <!-- Acceso a Pacientes PRIMERO -->
            <div class="flex gap-3" @click="toggleAuthMovile">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6"
                :style="{ color: open_tipe_auth_movile ? 'var(--blue-1)' : 'black' }">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <a class="cursor-pointer font-poppins font-semibold text-md text-black hover:text-[var(--blue-1)]"
                :style="{ color: open_tipe_auth_movile ? 'var(--blue-1)' : 'black' }">
                Acceso a pacientes
              </a>
            </div>

            <!-- Submenu Pacientes -->
            <div v-if="open_tipe_auth_movile" class="ml-5 bg-white rounded-lg z-10">
              <ul>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  :style="{ color: currentRoute === '/auth' ? 'var(--blue-1)' : 'black' }"
                  @click="goToAbout('/auth')">Iniciar sesión</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Productos</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Recursos</li>
              </ul>
            </div>

            <!-- Acceso a Especialistas SEGUNDO -->
            <div class="flex gap-3" @click="toggle_specialistMovile">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6"
                :style="{ color: open_specialistMovile ? 'var(--blue-1)' : 'black' }">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <a class="cursor-pointer font-poppins font-semibold text-md text-black hover:text-[var(--blue-1)]"
                :style="{ color: open_specialistMovile ? 'var(--blue-1)' : 'black' }">
                Acceso a especialistas
              </a>
            </div>

            <!-- Submenu Especialistas -->
            <div v-if="open_specialistMovile" class="ml-5">
              <ul>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="goToAbout('/auth-professional')">
                  Iniciar sesión</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="goToAbout('/planes')"
                  :style="{ color: currentRoute === '/planes' ? 'var(--blue-1)' : 'black' }">
                  Planes</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Recursos</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Proveedores</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Academia</li>
              </ul>
            </div>

            <!-- Servicios -->
            <div class="flex gap-3" @click="goToAbout('/services'); toggleMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="size-6"
                fill="currentColor" :style="{ color: currentRoute === '/services' ? 'var(--blue-1)' : 'black' }">
                <path
                  d="M841-518v318q0 33-23.5 56.5T761-120H201q-33 0-56.5-23.5T121-200v-318q-23-21-35.5-54t-.5-72l42-136q8-26 28.5-43t47.5-17h556q27 0 47 16.5t29 43.5l42 136q12 39-.5 71T841-518Zm-272-42q27 0 41-18.5t11-41.5l-22-140h-78v148q0 21 14 36.5t34 15.5Zm-180 0q23 0 37.5-15.5T441-612v-148h-78l-22 140q-4 24 10.5 42t37.5 18Zm-178 0q18 0 31.5-13t16.5-33l22-154h-78l-40 134q-6 20 6.5 43t41.5 23Zm540 0q29 0 42-23t6-43l-42-134h-76l22 154q3 20 16.5 33t31.5 13ZM201-200h560v-282q-5 2-6.5 2H751q-27 0-47.5-9T663-518q-18 18-41 28t-49 10q-27 0-50.5-10T481-518q-17 18-39.5 28T393-480q-29 0-52.5-10T299-518q-21 21-41.5 29.5T211-480h-4.5q-2.5 0-5.5-2v282Zm560 0H201h560Z" />
              </svg>
              <a class="cursor-pointer font-poppins font-semibold text-md text-black hover:text-[var(--blue-1)]"
                :style="{ color: currentRoute === '/services' ? 'var(--blue-1)' : 'black' }">
                Servicios
              </a>
            </div>

            <!-- Blog -->
            <div class="flex gap-3" @click="goToAbout('/blogs'); toggleMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="currentColor" :style="{ color: currentRoute === '/blogs' ? 'var(--blue-1)' : 'black' }">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
              </svg>
              <a class="cursor-pointer font-poppins font-semibold text-md text-black hover:text-[var(--blue-1)]"
                :style="{ color: currentRoute === '/blogs' ? 'var(--blue-1)' : 'black' }">
                Blog
              </a>
            </div>

          </div>
        </div>
      </div>

      <!-- Menú de escritorio -->
      <div class="hidden lg:flex items-center justify-between w-full py-4 bg-white pl-50">
        <div class="flex w-full max-w-screen-xl mx-auto justify-between px-4 items-center">
          
          <!-- Botón principal -->
          <a class="bg-[var(--blue-1)] text-white rounded-2xl py-2 text-sm cursor-pointer px-3 font-poppins font-semibold md:text-md transition-colors duration-300 transform hover:text-gray-100"
            @click="goToAbout('/specialists')">
            Agenda tu cita
          </a>

          <!-- Enlaces de navegación -->
          <a class="text-sm cursor-pointer px-2 py-1 font-poppins font-semibold md:text-md text-black transition-colors duration-300 transform rounded-lg hover:!text-[#5f9fd5]"
            @click="goToAbout('/')" 
            :style="{ color: currentRoute === '/' ? 'var(--blue-1)' : 'black' }">
            Home
          </a>

          <!-- Acceso a Pacientes PRIMERO en desktop -->
          <div class="relative inline-block" ref="patientRef">
            <a class="text-black text-sm cursor-pointer px-2 py-2 font-poppins font-semibold md:text-md transition-colors duration-300 transform rounded-lg hover:!text-[#8dd5ff]"
              @click="toggleauth">
              Acceso a pacientes
            </a>
            <div v-if="open_tipe_auth"
              class="absolute left-0 min-w-[150px] max-w-[200px] mt-2 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
              <ul class="py-2">
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  :style="{ color: currentRoute === '/auth' ? 'var(--blue-1)' : 'black' }"
                  @click="goToAbout('/auth')">Iniciar sesión</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Productos</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Recursos</li>
              </ul>
            </div>
          </div>

          <!-- Acceso a Especialistas SEGUNDO en desktop -->
          <div class="relative inline-block" ref="specialistRef">
            <a class="text-black text-sm cursor-pointer px-2 py-2 font-poppins font-semibold md:text-md transition-colors duration-300 transform rounded-lg hover:!text-[#8dd5ff]"
              @click="toggle_specialist">
              Acceso a especialistas
            </a>
            <div v-if="open_specialist"
              class="absolute left-0 min-w-[150px] max-w-[200px] mt-2 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
              <ul class="py-2">
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="goToAbout('/auth-professional')">
                  Iniciar sesión</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" @click="goToAbout('/planes')"
                  :style="{ color: currentRoute === '/planes' ? 'var(--blue-1)' : 'black' }">
                  Planes</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Recursos</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Proveedores</li>
                <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Academia</li>
              </ul>
            </div>
          </div>

          <!-- Servicios -->
          <a class="text-sm cursor-pointer px-2 py-1 font-poppins font-semibold md:text-md text-black transition-colors duration-300 transform rounded-lg hover:!text-[#5f9fd5]"
            @click="goToAbout('/services')"
            :style="{ color: currentRoute === '/services' ? 'var(--blue-1)' : 'black' }">
            Servicios
          </a>

          <!-- Blog -->
          <a class="text-sm cursor-pointer px-2 py-1 font-poppins font-semibold md:text-md text-black transition-colors duration-300 transform rounded-lg hover:!text-[#5f9fd5]"
            @click="goToAbout('/blogs')"
            :style="{ color: currentRoute === '/blogs' ? 'var(--blue-1)' : 'black' }">
            Blog
          </a>

          <!-- Preguntas frecuentes -->
          <a class="text-sm cursor-pointer px-2 py-1 font-poppins font-semibold md:text-md text-black transition-colors duration-300 transform rounded-lg hover:!text-[#5f9fd5]"
            @click="goToAbout('/questions')"
            :style="{ color: currentRoute === '/questions' ? 'var(--blue-1)' : 'black' }">
            Preguntas frecuentes
          </a>

        </div>
      </div>
    </div>
  </nav>
</template>