<script setup lang="ts">
import type { UsersPanelAdminDtos } from '@/dto/AdminPanel';
import { store_admin_get_all_users } from '@/store/stores_admin_panel/getAllUsers.admin.store';
import { computed, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import paginadeComponent from '@/common/paginade.component.vue';
import excelIcon from "@/assets/imageIcons/admin_icons/excel-icon.webp"
import axios from 'axios';

const adminUsersStore = store_admin_get_all_users()

async function updateUserRole(user: UsersPanelAdminDtos, checked: boolean) {
  if (user.role === "DELETED_USER") {
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
      await adminUsersStore.setState_users(user.id, "USER");
      user.role = "USER";
      await adminUsersStore.get_all_users(); // Refresh the list
    }
    return;
  }

  if (user.role === "USER" && !checked) {
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
      await adminUsersStore.setState_users(user.id, "DELETED_USER");
      user.role = "DELETED_USER";
      await adminUsersStore.get_all_users(); // Refresh the list
    }
    return;
  }
}

async function downloadExcel() {
  try {
    const response = await axios.post('/auth/excel-users', {}, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'usuarios.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
  }
}

onMounted(() => {
  adminUsersStore.get_all_users();
});

onUnmounted(() => {
  adminUsersStore.reset();
});

const all_users = computed(() => adminUsersStore.users || null);
const meta = computed(() => adminUsersStore.meta || null);
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
        <h2 class="text-xl font-medium text-gray-700">Pacientes Registrados</h2>
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
                  Acción
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
                      :checked="user.role === 'USER'"
                      @click.prevent="updateUserRole(user, !(user.role === 'USER'))" 
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                    </div>
                  </label>
                </td>
                
                <!-- Acciones -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button class="text-blue-600 hover:text-blue-800 mr-3" title="Ver detalles">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay usuarios registrados</h3>
        <p class="text-gray-500">Los usuarios registrados aparecerán aquí.</p>
      </div>

      <!-- Pagination -->
      <div v-if="meta && all_users && all_users.length > 0" class="flex justify-center mt-6">
        <paginadeComponent :meta="meta" @change-page="adminUsersStore.goToPage" />
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