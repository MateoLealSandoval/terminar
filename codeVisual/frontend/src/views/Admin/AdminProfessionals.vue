<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer from '@/Modules/Home/Footer.vue';

interface Professional {
  id: string;
  name: string;
  lastname: string;
  email: string;
  document: string;
  phone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rating: number;
  planType: string;
  createdAt: string;
  specialties: string[];
  profileComplete: boolean;
  payment_status: string;
  profile_approved: boolean;
}

const professionals = ref<Professional[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const filterStatus = ref<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
const selectedProfessional = ref<Professional | null>(null);
const showDetailModal = ref(false);

// Filtrar profesionales
const filteredProfessionals = computed(() => {
  return professionals.value.filter(prof => {
    const matchesSearch = 
      prof.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      prof.lastname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      prof.document.includes(searchQuery.value);
    
    const matchesStatus = filterStatus.value === 'ALL' || 
      (filterStatus.value === 'PENDING' && !prof.profile_approved) ||
      (filterStatus.value === 'APPROVED' && prof.profile_approved) ||
      (filterStatus.value === 'REJECTED' && prof.status === 'REJECTED');
    
    return matchesSearch && matchesStatus;
  });
});

// Cargar profesionales
async function loadProfessionals() {
  try {
    loading.value = true;
    const response = await axios.get('/users/professionals');
    professionals.value = response.data.data || [];
  } catch (error) {
    console.error('Error cargando profesionales:', error);
    Swal.fire('Error', 'No se pudieron cargar los profesionales', 'error');
  } finally {
    loading.value = false;
  }
}

// Aprobar perfil
async function approveProfessional(prof: Professional) {
  const result = await Swal.fire({
    title: '¿Aprobar este especialista?',
    text: `Se aprobará el perfil de ${prof.name} ${prof.lastname}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: 'var(--blue-1)'
  });

  if (result.isConfirmed) {
    try {
      await axios.post(`/users/approve-professional/${prof.id}`);
      
      // Enviar correo de aprobación
      await axios.post('/emails/professional-approved', {
        email: prof.email,
        name: prof.name
      });
      
      prof.profile_approved = true;
      
      Swal.fire('¡Aprobado!', 'El especialista ha sido aprobado y notificado', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo aprobar el especialista', 'error');
    }
  }
}

// Rechazar perfil
async function rejectProfessional(prof: Professional) {
  const result = await Swal.fire({
    title: '¿Rechazar este especialista?',
    input: 'textarea',
    inputLabel: 'Motivo del rechazo',
    inputPlaceholder: 'Ingrese el motivo...',
    showCancelButton: true,
    confirmButtonText: 'Rechazar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    inputValidator: (value) => {
      if (!value) {
        return 'Debe ingresar un motivo';
      }
    }
  });

  if (result.isConfirmed) {
    try {
      await axios.post(`/users/reject-professional/${prof.id}`, {
        reason: result.value
      });
      
      prof.status = 'REJECTED';
      prof.profile_approved = false;
      
      Swal.fire('Rechazado', 'El especialista ha sido rechazado', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo rechazar el especialista', 'error');
    }
  }
}

// Ver detalles
function viewDetails(prof: Professional) {
  selectedProfessional.value = prof;
  showDetailModal.value = true;
}

// Activar/Desactivar
async function toggleStatus(prof: Professional) {
  const isActive = prof.profile_approved;
  const action = isActive ? 'desactivar' : 'activar';
  
  const result = await Swal.fire({
    title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} especialista?`,
    text: `Se ${action}á el perfil de ${prof.name} ${prof.lastname}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: `Sí, ${action}`,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: isActive ? '#ef4444' : 'var(--blue-1)'
  });

  if (result.isConfirmed) {
    try {
      await axios.post(`/users/toggle-professional-status/${prof.id}`);
      prof.profile_approved = !isActive;
      Swal.fire('¡Actualizado!', `El especialista ha sido ${action}do`, 'success');
    } catch (error) {
      Swal.fire('Error', `No se pudo ${action} el especialista`, 'error');
    }
  }
}

// Descargar base de datos
async function downloadDatabase() {
  try {
    const response = await axios.get('/users/export-professionals', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `profesionales_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    Swal.fire('Error', 'No se pudo descargar la base de datos', 'error');
  }
}

onMounted(() => {
  loadProfessionals();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    
    <div class="p-6">
      <div class="max-w-7xl mx-auto">
        
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 class="text-2xl font-bold text-gray-800 mb-4">Gestión de Especialistas</h1>
          
          <!-- Filtros -->
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex-1 min-w-[300px]">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Buscar por nombre, apellido, email o documento..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--blue-1)]"
              >
            </div>
            
            <select 
              v-model="filterStatus"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--blue-1)]"
            >
              <option value="ALL">Todos</option>
              <option value="PENDING">Por aprobar</option>
              <option value="APPROVED">Aprobados</option>
              <option value="REJECTED">Rechazados</option>
            </select>
            
            <button 
              @click="downloadDatabase"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Descargar BD
            </button>
          </div>
        </div>

        <!-- Tabla -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Celular
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loading">
                  <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--blue-1)]"></div>
                    <p class="mt-2">Cargando...</p>
                  </td>
                </tr>
                <tr v-else-if="filteredProfessionals.length === 0">
                  <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                    No se encontraron especialistas
                  </td>
                </tr>
                <tr v-else v-for="prof in filteredProfessionals" :key="prof.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ prof.name }} {{ prof.lastname }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ prof.document }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ prof.phone }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ prof.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          :class="{
                            'bg-blue-100 text-blue-800': prof.planType === 'BASIC',
                            'bg-amber-100 text-amber-800': prof.planType === 'STANDARD',
                            'bg-green-100 text-green-800': prof.planType === 'PREMIUM'
                          }">
                      {{ prof.planType || 'Sin plan' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        :checked="prof.profile_approved"
                        @change="toggleStatus(prof)"
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                                  peer-checked:after:translate-x-full peer-checked:after:border-white 
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                  after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                                  peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <template v-for="i in 5" :key="i">
                        <svg 
                          class="w-4 h-4" 
                          :class="i <= (prof.rating || 0) ? 'text-yellow-400' : 'text-gray-300'"
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </template>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex gap-2">
                      <button 
                        v-if="!prof.profile_approved"
                        @click="approveProfessional(prof)"
                        class="text-green-600 hover:text-green-900"
                        title="Aprobar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </button>
                      <button 
                        v-if="!prof.profile_approved"
                        @click="rejectProfessional(prof)"
                        class="text-red-600 hover:text-red-900"
                        title="Rechazar"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                      <button 
                        @click="viewDetails(prof)"
                        class="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div v-if="showDetailModal" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Detalles del Especialista</h2>
          <button @click="showDetailModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedProfessional" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Nombre completo</label>
              <p class="text-gray-900">{{ selectedProfessional.name }} {{ selectedProfessional.lastname }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Email</label>
              <p class="text-gray-900">{{ selectedProfessional.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Documento</label>
              <p class="text-gray-900">{{ selectedProfessional.document }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Teléfono</label>
              <p class="text-gray-900">{{ selectedProfessional.phone }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Plan</label>
              <p class="text-gray-900">{{ selectedProfessional.planType || 'Sin plan' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Estado de pago</label>
              <p class="text-gray-900">{{ selectedProfessional.payment_status || 'PENDING' }}</p>
            </div>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-500">Especialidades</label>
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="specialty in selectedProfessional.specialties" :key="specialty"
                    class="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {{ specialty }}
              </span>
            </div>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-500">Perfil aprobado</label>
            <p class="text-gray-900">
              <span v-if="selectedProfessional.profile_approved" class="text-green-600">✓ Aprobado</span>
              <span v-else class="text-red-600">✗ Por aprobar</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>