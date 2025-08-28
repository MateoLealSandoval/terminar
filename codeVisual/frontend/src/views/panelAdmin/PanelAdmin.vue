<script setup lang="ts">
import Navbar_panel from '@/common/Navbar_panel.vue';
import { ref } from 'vue';

import Swal from 'sweetalert2';
import { useAuthStore } from '@/store';

/**
 * TODO components
 * 
 */
import Information_adminPanel from '@/Modules/admin_panel/Information_adminPanel.vue';
import { AdminPanelOptionEnum } from '@/Modules/admin_panel';
import Professionals_registers from '@/Modules/admin_panel/Professionals_registers.vue';
import users_registers from '@/Modules/admin_panel/users_registers.vue';
import Bulleting from '@/Modules/admin_panel/Bulleting.vue';
import Profeccionals_pendings from '@/Modules/admin_panel/Profeccionals_pendings.vue';

// Panel activo inicial — Dashboard por defecto
const isOpen = ref(false);

const panelselect = ref<AdminPanelOptionEnum>(AdminPanelOptionEnum.ADMIN);
const toggleSidebar = () => {
    isOpen.value = !isOpen.value;
};
const store = useAuthStore();
const showAlert = () => {
    Swal.fire({
        title: "¡Alerta!",
        text: "¿Estás seguro de cerrar sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--blue-1)",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "Cancelar"

    }).then((result) => {
        if (result.isConfirmed) {
            store.close_session();

        }
    });
};
function changePanel(option: AdminPanelOptionEnum) {
    panelselect.value = option;
}
</script>

<template>
    <div class="w-screen h-screen flex flex-col">
        <!-- Navbar fijo arriba -->
        <Navbar_panel :onAction="toggleSidebar" :isactive="isOpen" />
        
        <!-- Container principal debajo del navbar -->
        <div class="flex flex-1 overflow-hidden font-poppins text-base relative">
            <!-- Sidebar -->
            <aside :class="{
                'translate-x-0': isOpen,
                '-translate-x-full': !isOpen,
            }" class="bg-[var(--blue-1)] w-[80%] md:w-[20%] h-full flex flex-col transition-transform duration-300 absolute left-0 top-0 z-50 md:relative md:translate-x-0">
                
                <!-- Header del sidebar con botón cerrar -->
                <div class="p-4 flex justify-end items-center bg-[var(--blue-1)] md:hidden">
                    <button @click="toggleSidebar"
                        class="text-white hover:text-cyan-400 focus:outline-none cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <!-- Navegación del sidebar -->
                <nav class="flex-1 overflow-y-auto p-4 bg-[var(--blue-1)]">
                    <ul class="space-y-2">
                        <li class="animate-fade-in" style="animation-delay: 0.1s;">
                            <a @click="panelselect = AdminPanelOptionEnum.ADMIN"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.ADMIN 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Admin</span>
                            </a>
                        </li>
                        
                        <li class="animate-fade-in" style="animation-delay: 0.2s;">
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONAL_REGISTER"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Profesionales Registrados</span>
                            </a>
                        </li>
                        
                        <li class="animate-fade-in" style="animation-delay: 0.3s;">
                            <a @click="panelselect = AdminPanelOptionEnum.USER_REGISTER"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.USER_REGISTER 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Usuarios Registrados</span>
                            </a>
                        </li>
                        
                        <li class="animate-fade-in" style="animation-delay: 0.4s;">
                            <a @click="panelselect = AdminPanelOptionEnum.QUOTES"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.QUOTES 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Citas programadas</span>
                            </a>
                        </li>
                        
                        <li class="animate-fade-in" style="animation-delay: 0.5s;">
                            <a @click="panelselect = AdminPanelOptionEnum.SUBSCRIPTIONS"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Suscripciones</span>
                            </a>
                        </li>
                        
                        <li class="animate-fade-in" style="animation-delay: 0.6s;">
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONAL_RATING"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Rating Profesionales</span>
                            </a>
                        </li>
                        
                        <li class="animate-fade-in" style="animation-delay: 0.7s;">
                            <a @click="panelselect = AdminPanelOptionEnum.DELETION_REQUESTS"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.DELETION_REQUESTS 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Solicitudes Eliminación</span>
                            </a>
                        </li>
                        
                        <li class="animate-fade-in" style="animation-delay: 0.8s;">
                            <a @click="panelselect = AdminPanelOptionEnum.NEWSLETTER"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.NEWSLETTER 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Boletín</span>
                            </a>
                        </li>
                        
                        <li class="animate-fade-in" style="animation-delay: 0.9s;">
                            <a @click="panelselect = AdminPanelOptionEnum.MESSAGES"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.MESSAGES 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Mensajes</span>
                            </a>
                        </li>
                        
                        <li class="animate-fade-in" style="animation-delay: 1.0s;">
                            <a @click="panelselect = AdminPanelOptionEnum.BLOG"
                                :class="[
                                    'flex items-center p-3 text-white rounded-lg transition-all duration-300 cursor-pointer relative',
                                    panelselect === AdminPanelOptionEnum.BLOG 
                                        ? 'bg-white/20 font-bold border-l-4 border-white' 
                                        : 'hover:bg-white/10'
                                ]">
                                <span class="text-sm">Blog</span>
                            </a>
                        </li>

                        <li class="animate-fade-in cursor-pointer mt-8" style="animation-delay: 1.1s;" @click="showAlert">
                            <a class="flex items-center p-3 text-white rounded-lg hover:bg-red-500/20 transition-colors duration-300">
                                <span class="text-sm">Cerrar sesión</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- Overlay para móvil -->
            <div v-if="isOpen" 
                 @click="toggleSidebar"
                 class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            </div>

            <!-- Contenido principal -->
            <main class="flex-1 overflow-auto bg-gray-50">
                <Information_adminPanel v-if="panelselect === AdminPanelOptionEnum.ADMIN" 
                    :changePanel="changePanel" />
                <Professionals_registers v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER" />
                <users_registers v-if="panelselect === AdminPanelOptionEnum.USER_REGISTER" />
                <Profeccionals_pendings v-if="panelselect === AdminPanelOptionEnum.PROFESSIONALS_PENDINGS" />
                <div v-if="panelselect === AdminPanelOptionEnum.QUOTES" class="p-8">
                    <h1 class="text-2xl font-bold text-gray-800">Citas Programadas</h1>
                    <p class="text-gray-600 mt-2">Sección en desarrollo...</p>
                </div>
                <Bulleting v-if="panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS" />
                <div v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING" class="p-8">
                    <h1 class="text-2xl font-bold text-gray-800">Rating Profesionales</h1>
                    <p class="text-gray-600 mt-2">Sección en desarrollo...</p>
                </div>
                <div v-if="panelselect === AdminPanelOptionEnum.DELETION_REQUESTS" class="p-8">
                    <h1 class="text-2xl font-bold text-gray-800">Solicitudes de Eliminación</h1>
                    <p class="text-gray-600 mt-2">Sección en desarrollo...</p>
                </div>
                <div v-if="panelselect === AdminPanelOptionEnum.NEWSLETTER" class="p-8">
                    <h1 class="text-2xl font-bold text-gray-800">Boletín</h1>
                    <p class="text-gray-600 mt-2">Sección en desarrollo...</p>
                </div>
                <div v-if="panelselect === AdminPanelOptionEnum.MESSAGES" class="p-8">
                    <h1 class="text-2xl font-bold text-gray-800">Mensajes</h1>
                    <p class="text-gray-600 mt-2">Sección en desarrollo...</p>
                </div>
                <div v-if="panelselect === AdminPanelOptionEnum.BLOG" class="p-8">
                    <h1 class="text-2xl font-bold text-gray-800">Blog</h1>
                    <p class="text-gray-600 mt-2">Sección en desarrollo...</p>
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

/* Sidebar responsive adjustments */
@media (max-width: 768px) {
    aside {
        width: 80%;
    }
}

@media (min-width: 769px) {
    aside {
        position: relative !important;
        transform: translateX(0) !important;
    }
}
</style>