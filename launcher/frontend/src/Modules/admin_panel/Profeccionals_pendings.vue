<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { store_admin_pendings } from '@/store/stores_admin_panel/pendings.store';
import paginadeComponent from '@/common/paginade.component.vue';
import modal_Float from '@/components/modal_Float.vue';
import Documents_panel from './components/documents_panel.vue';

import type { userPendingsDto } from '@/models/admin_panel/users_pendings';
type StatusType = 'PENDING' | 'ACCEPTED' | 'REJECTED';

const adminProfessioanlStore = store_admin_pendings()
const type = ref<StatusType>('PENDING')
const searchTerm = ref('')
const selectedProfessional = ref<userPendingsDto | null>(null)
const showProfileModal = ref(false)
const showDocumentsModal = ref(false)

const statusOptions: { value: StatusType; label: string }[] = [
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'ACCEPTED', label: 'Aceptado' },
    { value: 'REJECTED', label: 'Rechazado' },
];

onMounted(() => {
    adminProfessioanlStore.get_all_users(type.value);
});

onUnmounted(() => {
    adminProfessioanlStore.reset();
});

const all_professionals = computed(() => adminProfessioanlStore.users || []);
const meta = computed(() => adminProfessioanlStore.meta || null);

const filteredProfessionals = computed(() => {
    if (!searchTerm.value) return all_professionals.value;
    
    return all_professionals.value.filter(prof => {
        const searchLower = searchTerm.value.toLowerCase();
        return (
            String(prof.names).toLowerCase().includes(searchLower) ||
            String(prof.lastnames).toLowerCase().includes(searchLower) ||
            String(prof.email).toLowerCase().includes(searchLower)
        );
    });
});

watch(type, (newValue) => {
    if (newValue) {
        adminProfessioanlStore.reset();
        adminProfessioanlStore.get_all_users(newValue);
    }
});

function formatDate(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// Descargar base de datos
async function downloadDatabase() {
    try {
        const response = await axios.post('/auth-pending/excel', { status: type.value }, {
            responseType: 'blob',
        });
        const blob = new Blob([response.data], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `profesionales_pendientes_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        Swal.fire('¡Descargado!', 'La base de datos ha sido descargada exitosamente.', 'success');
    } catch (error) {
        console.error('Error al descargar el archivo:', error);
        Swal.fire('Error', 'No se pudo descargar la base de datos.', 'error');
    }
}

// Ver perfil
function viewProfile(professional: userPendingsDto) {
    selectedProfessional.value = professional;
    showProfileModal.value = true;
}

// Ver documentos
function viewDocuments(professional: userPendingsDto) {
    selectedProfessional.value = professional;
    showDocumentsModal.value = true;
}

// Cerrar modales
function closeProfileModal() {
    showProfileModal.value = false;
    selectedProfessional.value = null;
}

function closeDocumentsModal() {
    showDocumentsModal.value = false;
    selectedProfessional.value = null;
}

// Guardar cambios del perfil
async function saveProfileChanges(updatedData: any) {
    try {
        await axios.put(`/auth-pending/${updatedData.id}`, updatedData);
        
        Swal.fire('¡Guardado!', 'Los cambios han sido guardados exitosamente.', 'success');
        closeProfileModal();
        adminProfessioanlStore.get_all_users(type.value);
    } catch (error) {
        Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error');
    }
}

// Aprobar perfil
async function approveProfessional(professional: userPendingsDto) {
    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Quieres aprobar a ${professional.names} ${professional.lastnames}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, aprobar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "var(--blue-1)",
        cancelButtonColor: "#d33"
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`/auth-pending/approve/${professional.id}`);
            
            Swal.fire({
                title: "Aprobado",
                text: "El profesional fue aprobado correctamente.",
                icon: "success",
                confirmButtonColor: "var(--blue-1)"
            });

            adminProfessioanlStore.get_all_users(type.value);
        } catch (error) {
            console.error("Error al aprobar:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo aprobar al profesional.",
                icon: "error",
                confirmButtonColor: "var(--blue-1)"
            });
        }
    }
}

// Paginación
function changePage(page: number) {
    adminProfessioanlStore.goToPage(page);
}
</script>

<template>
    <div class="w-full bg-gray-50 min-h-screen">
        <!-- Header con título y acciones -->
        <div class="px-6 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-lg text-gray-700">Bienvenido a Doc Visual Administrador</h1>
                <div class="flex gap-4 items-center">
                    <!-- Selector de estado -->
                    <select v-model="type"
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                    
                    <!-- Buscador -->
                    <div class="relative">
                        <input 
                            v-model="searchTerm"
                            type="text" 
                            placeholder="Buscar profesional..."
                            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                        <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                    
                    <!-- Botón descargar BD -->
                    <button 
                        @click="downloadDatabase"
                        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        Descargar BD
                    </button>
                </div>
            </div>
        </div>

        <!-- Tabla -->
        <div class="p-6">
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <table class="min-w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Correo
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha inscripción
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="professional in filteredProfessionals" :key="professional.id" 
                            class="hover:bg-gray-50"
                            :class="{ 'bg-green-50': professional.status === 'ACCEPTED' }">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ professional.names }} {{ professional.lastnames }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ professional.email }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {{ formatDate(professional.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <div class="flex gap-2">
                                    <!-- Botón Ver Documentos -->
                                    <button 
                                        @click="viewDocuments(professional)"
                                        class="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors group"
                                        title="Ver Documentos"
                                    >
                                        <svg class="w-5 h-5 text-green-600 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                    </button>
                                    
                                    <!-- Botón Ver/Editar Perfil -->
                                    <button 
                                        @click="viewProfile(professional)"
                                        class="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors group"
                                        title="Ver/Editar Perfil"
                                    >
                                        <svg class="w-5 h-5 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    
                                    <!-- Botón Aprobar Perfil -->
                                    <button 
                                        v-if="professional.status !== 'ACCEPTED'"
                                        @click="approveProfessional(professional)"
                                        class="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors group"
                                        title="Aprobar Perfil"
                                    >
                                        <svg class="w-5 h-5 text-yellow-600 group-hover:text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- Mensaje si no hay datos -->
                <div v-if="filteredProfessionals.length === 0" class="text-center py-8 text-gray-500">
                    No se encontraron profesionales pendientes
                </div>
            </div>
            
            <!-- Paginación -->
            <div v-if="meta" class="mt-4 flex justify-center">
                <paginadeComponent 
                    :meta="meta"
                    @change-page="changePage"
                />
            </div>
        </div>

        <!-- Modal de Perfil -->
        <modal_Float 
            v-if="showProfileModal && selectedProfessional" 
            :model-value="showProfileModal"
            :width-percent="80"
            :height-percent="90"
            @click-outside="closeProfileModal"
        >
            <div class="bg-white rounded-lg p-6 h-full overflow-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Perfil del Profesional</h2>
                    <button @click="closeProfileModal" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                        <input v-model="selectedProfessional.names" type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                        <input v-model="selectedProfessional.lastnames" type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <input v-model="selectedProfessional.email" type="email"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                        <input v-model="selectedProfessional.document" type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input v-model="selectedProfessional.phone" type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <input :value="selectedProfessional.status" type="text" disabled
                            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end gap-3">
                    <button @click="closeProfileModal"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button @click="saveProfileChanges(selectedProfessional)"
                        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Guardar cambios
                    </button>
                </div>
            </div>
        </modal_Float>

        <!-- Modal de Documentos -->
        <modal_Float 
            v-if="showDocumentsModal && selectedProfessional" 
            :model-value="showDocumentsModal"
            :width-percent="70"
            :height-percent="80"
            @click-outside="closeDocumentsModal"
        >
            <div class="bg-white rounded-lg p-6 h-full">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">Documentos del Profesional</h2>
                    <button @click="closeDocumentsModal" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <Documents_panel :data="selectedProfessional" />
            </div>
        </modal_Float>
    </div>
</template>