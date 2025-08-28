<script setup lang="ts">
import type { UsersProfessionalsPanelAdminDto } from '@/dto/AdminPanel';
import { store_admin_professionals } from '@/store/stores_admin_panel';
import { computed, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import paginadeComponent from '@/common/paginade.component.vue';
import excelIcon from "@/assets/imageIcons/admin_icons/excel-icon.webp"
import iconActions from "@/assets/imageIcons/admin_icons/icons8-editar.webp"
import axios from 'axios';

const adminProfessionalStore = store_admin_professionals()

async function updateUserRole(user: UsersProfessionalsPanelAdminDto, checked: boolean) {
  if (user.role === 'DELETED_USER_PARTNER') {
    const result = await Swal.fire({
      title: "¡Alerta!",
      text: `¿Quieres habilitar al usuario ${user.names} ${user.lastnames}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--blue-1)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, habilitar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await adminProfessionalStore.setState_professionals(user.id, 'USER_PARTNER');
      user.role = 'USER_PARTNER';
      await adminProfessionalStore.get_all_users(); // Refresh the list
    }
    return;
  }

  if (user.role === 'USER_PARTNER' && !checked) {
    const result = await Swal.fire({
      title: "¡Alerta!",
      text: `¿Quieres bloquear al usuario ${user.names} ${user.lastnames}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--blue-1)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bloquear",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await adminProfessionalStore.setState_professionals(user.id, 'DELETED_USER_PARTNER');
      user.role = 'DELETED_USER_PARTNER';
      await adminProfessionalStore.get_all_users(); // Refresh the list
    }
    return;
  }
}

async function downloadExcel() {
  try {
    const response = await axios.post('/auth/excel-professionals', {}, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'profesionales.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
  }
}

onMounted(() => {
  adminProfessionalStore.get_all_users();
});

onUnmounted(() => {
  adminProfessionalStore.reset();
});

const all_users = computed(() => adminProfessionalStore.users || null);
const meta = computed(() => adminProfessionalStore.meta || null);
</script>

<template>
  <div class="w-full bg-gray-100 min-h-full">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="w-[90%] mx-auto py-6">
        <h1 class="text-2xl font-semibold text-gray-800">Bienvenido a Doc Visual Administrador</h1>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-[90%] mx-auto py-6">
      <!-- Header with download button -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-medium text-gray-700">Profesionales Registrados</h2>
        <button @click="downloadExcel" 
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
          <img :src="excelIcon" alt="Excel" class="w-4 h-4 mr-2">
          Descargar BD
        </button>
      </div>

      <!-- Table Container -->
      <div v-if="all_users && all_users.length > 0" 
        class="bg-white rounded-2xl shadow-lg overflow-hidden">
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Celular
                </th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(user, index) in all_users" 
                :key="user.id" 
                class="hover:bg-gray-50 transition-colors duration-150">
                
                <!-- Nombre -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ user.names + " " + user.lastnames }}
                </td>
                
                <!-- Documento -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ user.document || 'N/A' }}
                </td>
                
                <!-- Celular -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ user.phone || 'N/A' }}
                </td>
                
                <!-- Email -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ user.email }}
                </td>
                
                <!-- Status Toggle -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      class="sr-only peer" 
                      :checked="user.role === 'USER_PARTNER'"
                      @click.prevent="updateUserRole(user, !(user.role === 'USER_PARTNER'))" 
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                    </div>
                  </label>
                </td>
                
                <!-- Rating -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-1">
                    <svg v-for="i in 5" :key="i" 
                      class="w-4 h-4" 
                      :class="i <= (user.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'" 
                      viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay profesionales registrados</h3>
        <p class="text-gray-500">Los profesionales registrados aparecerán aquí.</p>
      </div>

      <!-- Pagination -->
      <div v-if="meta && all_users && all_users.length > 0" class="flex justify-center mt-6">
        <paginadeComponent :meta="meta" @change-page="adminProfessionalStore.goToPage" />
      </div>

      <!-- Note -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-700">
          <strong>Nota:</strong> Se debe poder editar, eliminar, activar y desactivar
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Toggle Switch Styling */
.peer:checked + div {
  background-color: #3b82f6;
}

.peer:checked + div:after {
  transform: translateX(100%);
  border-color: white;
}

/* Table row hover effect */
tbody tr:hover {
  background-color: #f9fafb;
}

/* Responsive table */
@media (max-width: 768px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
  
  th, td {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}
</style>