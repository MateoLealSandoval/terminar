<script setup lang="ts">
import { ref } from "vue";
import Swal from "sweetalert2";
import Navbar_panel from '@/common/Navbar_panel.vue';
import Panel_user_client_reviews from "@/Modules/Panel_User_Professional/Panel_user_client_reviews.vue";
import Panel_user_diarie from "@/Modules/Panel_User_Professional/Panel_user_diarie.vue";
import Panel_user_perfil from "@/Modules/Panel_User_Professional/Panel_user_perfil.vue";
import Panel_user_notifications from "@/Modules/Panel_User_Professional/notification/Panel_user_notifications.vue";
import { useAuthStore } from '@/store/auth.store';

// Enum para los paneles
enum PanelType {
  CLIENT_REVIEW = "client_review",
  DIARIE = "diarie",
  PERFIL = "perfil",
  NOTIFICATIONS = "notifications"
}

// Store
const store = useAuthStore();

// Estado
const isOpen = ref(true);
const panelselect = ref<PanelType>(PanelType.PERFIL);

// Funciones
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const showAlert = () => {
  Swal.fire({
    title: "¡Alerta!",
    text: "¿Estás seguro de cerrar sesión?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "var(--blue-1)",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      store.close_session();
    }
  });
};
</script>

<template>
    <Navbar_panel :onAction="toggleSidebar" :isactive="isOpen" />
    <div class="flex  min-h-[90ddvh]  font-poppins text-base">
        <!-- Sidebar -->
        <aside :class="{
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
        }"
            class="bg-white w-[80%] md:w-[20%]    min-h-[90dvh] flex flex-col transition-transform duration-300 absolute left-0 bottom-0 z-50">
            <div class="p-4 flex justify-end items-center  bg-[var(--blue-1)]">

                <button @click="toggleSidebar"
                    class="text-white hover:text-cyan-400     focus:outline-none cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <nav class="flex-1 overflow-y-auto p-4 bg-[var(--blue-1)]">
                <ul class="space-y-2">
                    <li class="animate-fade-in" style="animation-delay: 0.1s;">
                        <a @click="panelselect = PanelType.PERFIL"
                            :style="{ fontWeight: panelselect === PanelType.PERFIL ? 'bold' : 'normal' }"
                            class="flex items-center p-3 text-white   rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg> -->
                            Perfil
                        </a>
                    </li>
                    <li class="animate-fade-in" style="animation-delay: 0.1s;">
                        <a @click="panelselect = PanelType.NOTIFICATIONS"
                            :style="{ fontWeight: panelselect === PanelType.NOTIFICATIONS ? 'bold' : 'normal' }"
                            class="flex items-center p-3 text-white  rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                            Notificaciones
                        </a>
                    </li>
                    <li class="animate-fade-in" style="animation-delay: 0.1s;">
                        <a @click="panelselect = PanelType.CLIENT_REVIEW"
                            :style="{ fontWeight: panelselect === PanelType.CLIENT_REVIEW ? 'bold' : 'normal' }"
                            class="flex items-center p-3 text-white   rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                            Valoraciones
                        </a>
                    </li>
                    <li class="animate-fade-in" style="animation-delay: 0.1s; ">
                        <a @click="panelselect = PanelType.DIARIE"
                            :style="{ fontWeight: panelselect === PanelType.DIARIE ? 'bold' : 'normal' }"
                            class="flex items-center p-3 text-white   rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                            Agenda
                        </a>
                    </li>
                    <li class="animate-fade-in cursor-pointer" style="animation-delay: 0.1s; " @click="showAlert">
                        <a  
                            
                            class="flex items-center p-3 text-white   rounded-lg hover:bg-indigo-100    transition-colors duration-300 menu-item-hover">
                            Cerrar sesión
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1  max-h-dvh    ">

            <div class=" w-full  flex justify-end transition-all duration-500  ">
                <div :style="{ width: isOpen ? '80%' : '100%' }" class="h-20 transition-all duration-500 ">

                    <Panel_user_perfil v-if="panelselect === PanelType.PERFIL" 
                        class="max-h-[90dvh] min-h-[90dvh] overflow-y-auto bg-gradient-to-r from-gray-50 to-gray-100" />
                    <Panel_user_diarie v-if="panelselect === PanelType.DIARIE"
                        class="max-h-[90dvh] min-h-[90dvh]   overflow-y-auto bg-gradient-to-r from-gray-50 to-gray-100" />
                    <Panel_user_notifications v-if="panelselect === PanelType.NOTIFICATIONS"
                        class="max-h-[90dvh] min-h-[90dvh] overflow-y-auto bg-gradient-to-r from-gray-50 to-gray-100" />
                    <Panel_user_client_reviews v-if="panelselect === PanelType.CLIENT_REVIEW"
                        class="max-h-[90dvh] min-h-[90dvh] overflow-y-auto bg-gradient-to-r from-gray-50 to-gray-100" />
                </div>
            </div>
        </main>

    </div>
</template>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

.menu-item-hover {
    position: relative;
    overflow: hidden;
}

.menu-item-hover::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-out;
}

.menu-item-hover:hover::after {
    transform: scaleX(1);
    transform-origin: left;
}
</style>
