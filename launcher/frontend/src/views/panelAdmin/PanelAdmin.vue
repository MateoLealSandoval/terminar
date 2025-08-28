<script setup lang="ts">
import Navbar_panel from '@/common/Navbar_panel.vue';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/store';

/**
 * TODO components
 */
import Information_adminPanel from '@/Modules/admin_panel/Information_adminPanel.vue';
import { AdminPanelOptionEnum } from '@/Modules/admin_panel';
import Professionals_registers from '@/Modules/admin_panel/Professionals_registers.vue';
import users_registers from '@/Modules/admin_panel/users_registers.vue';
import Bulleting from '@/Modules/admin_panel/Bulleting.vue';
import Profeccionals_pendings from '@/Modules/admin_panel/Profeccionals_pendings.vue';

const isOpen = ref(true);
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
        <!-- Header Global con Logo -->
        <div class="bg-white h-16 border-b border-gray-200 flex items-center px-6 z-50">
            <img class="w-auto h-[10vh] p-4 cursor-pointer" src="@/assets/images/LogoPng.webp" alt="Logo" />
        </div>

        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <aside :class="{
                'translate-x-0': isOpen,
                '-translate-x-full': !isOpen,
            }"
                class="bg-[var(--blue-1)] w-[250px] flex flex-col transition-transform duration-300">
                
                <!-- Botón cerrar sidebar -->
                <div class="p-4 flex justify-end">
                    <button @click="toggleSidebar"
                        class="text-white hover:text-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Menú de navegación -->
                <nav class="flex-1 overflow-y-auto px-2">
                    <ul class="space-y-1">
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.ADMIN"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.ADMIN }">
                                <!-- Barra azul lateral para ítem activo -->
                                <div v-if="panelselect === AdminPanelOptionEnum.ADMIN" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.ADMIN, 'ml-2': panelselect !== AdminPanelOptionEnum.ADMIN }">
                                    Admin
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONAL_REGISTER"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER }">
                                <div v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER, 'ml-2': panelselect !== AdminPanelOptionEnum.PROFESSIONAL_REGISTER }">
                                    Profesionales Registrados
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONALS_PENDINGS"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.PROFESSIONALS_PENDINGS }">
                                <div v-if="panelselect === AdminPanelOptionEnum.PROFESSIONALS_PENDINGS" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.PROFESSIONALS_PENDINGS, 'ml-2': panelselect !== AdminPanelOptionEnum.PROFESSIONALS_PENDINGS }">
                                    Profesionales Pendientes
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.QUOTES"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.QUOTES }">
                                <div v-if="panelselect === AdminPanelOptionEnum.QUOTES" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.QUOTES, 'ml-2': panelselect !== AdminPanelOptionEnum.QUOTES }">
                                    Citas programadas
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.USER_REGISTER"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.USER_REGISTER }">
                                <div v-if="panelselect === AdminPanelOptionEnum.USER_REGISTER" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.USER_REGISTER, 'ml-2': panelselect !== AdminPanelOptionEnum.USER_REGISTER }">
                                    Pacientes Registrados
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.SUBSCRIPTIONS"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS }">
                                <div v-if="panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS, 'ml-2': panelselect !== AdminPanelOptionEnum.SUBSCRIPTIONS }">
                                    Suscripciones
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.PROFESSIONAL_RATING"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING }">
                                <div v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING, 'ml-2': panelselect !== AdminPanelOptionEnum.PROFESSIONAL_RATING }">
                                    Rating Profesionales
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.DELETION_REQUESTS"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.DELETION_REQUESTS }">
                                <div v-if="panelselect === AdminPanelOptionEnum.DELETION_REQUESTS" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.DELETION_REQUESTS, 'ml-2': panelselect !== AdminPanelOptionEnum.DELETION_REQUESTS }">
                                    Solicitudes Eliminación
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.NEWSLETTER"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.NEWSLETTER }">
                                <div v-if="panelselect === AdminPanelOptionEnum.NEWSLETTER" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.NEWSLETTER, 'ml-2': panelselect !== AdminPanelOptionEnum.NEWSLETTER }">
                                    Boletín
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.WEB_BANNERS"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.WEB_BANNERS }">
                                <div v-if="panelselect === AdminPanelOptionEnum.WEB_BANNERS" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.WEB_BANNERS, 'ml-2': panelselect !== AdminPanelOptionEnum.WEB_BANNERS }">
                                    Banners Web
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.MESSAGES"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.MESSAGES }">
                                <div v-if="panelselect === AdminPanelOptionEnum.MESSAGES" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.MESSAGES, 'ml-2': panelselect !== AdminPanelOptionEnum.MESSAGES }">
                                    Mensajes
                                </span>
                            </a>
                        </li>
                        <li>
                            <a @click="panelselect = AdminPanelOptionEnum.BLOG"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors relative"
                                :class="{ 'bg-white/10': panelselect === AdminPanelOptionEnum.BLOG }">
                                <div v-if="panelselect === AdminPanelOptionEnum.BLOG" 
                                     class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                                <span :class="{ 'font-bold ml-2': panelselect === AdminPanelOptionEnum.BLOG, 'ml-2': panelselect !== AdminPanelOptionEnum.BLOG }">
                                    Blog
                                </span>
                            </a>
                        </li>
                        <li class="pt-4 mt-4 border-t border-white/20">
                            <a @click="showAlert"
                                class="flex items-center px-4 py-2 text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                                <span class="ml-2">Cerrar sesión</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <!-- Contenido Principal -->
            <main class="flex-1 overflow-auto bg-gray-50 flex flex-col">
                <div class="flex-1">
                    <Information_adminPanel v-if="panelselect === AdminPanelOptionEnum.ADMIN" 
                        :changePanel="changePanel" />
                    <Professionals_registers v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_REGISTER" />
                    <users_registers v-if="panelselect === AdminPanelOptionEnum.USER_REGISTER" />
                    <Profeccionals_pendings v-if="panelselect === AdminPanelOptionEnum.PROFESSIONALS_PENDINGS" />
                    <h1 v-if="panelselect === AdminPanelOptionEnum.QUOTES">quotes</h1>
                    <Bulleting v-if="panelselect === AdminPanelOptionEnum.SUBSCRIPTIONS" />
                    <h1 v-if="panelselect === AdminPanelOptionEnum.PROFESSIONAL_RATING">professional rating</h1>
                    <h1 v-if="panelselect === AdminPanelOptionEnum.DELETION_REQUESTS">deletion requests</h1>
                    <h1 v-if="panelselect === AdminPanelOptionEnum.NEWSLETTER">newsletter</h1>
                    <h1 v-if="panelselect === AdminPanelOptionEnum.WEB_BANNERS">web banners</h1>
                    <h1 v-if="panelselect === AdminPanelOptionEnum.MESSAGES">messages</h1>
                    <h1 v-if="panelselect === AdminPanelOptionEnum.BLOG">blog</h1>
                </div>
                
                <!-- Footer con barra de colores -->
                <div class="bg-white border-t border-gray-200">
                    <div class="text-center py-3 text-xs text-gray-500">
                        <p>2025 DocVisual® Todos los derechos reservados</p>
                    </div>
                    <!-- Barra de colores -->
                    <div class="flex h-2">
                        <div class="flex-1 bg-yellow-400"></div>
                        <div class="flex-1 bg-green-500"></div>
                        <div class="flex-1 bg-teal-500"></div>
                        <div class="flex-1 bg-blue-500"></div>
                        <div class="flex-1 bg-purple-500"></div>
                        <div class="flex-1 bg-pink-500"></div>
                        <div class="flex-1 bg-red-500"></div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>