<script setup lang="ts">
import { ref, computed } from 'vue';
import type { UsersProfessionalsPanelAdminDto } from '@/dto/AdminPanel';

const props = defineProps<{
  professional: UsersProfessionalsPanelAdminDto;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Estados
const selectedDocument = ref<any>(null);

// Documentos mock (en producción vendrían del backend)
const documents = ref([
  {
    id: 1,
    name: 'Diploma de Grado',
    type: 'PDF',
    size: '2.3 MB',
    uploadDate: '2024-01-15',
    status: 'verified',
    url: '/documents/diploma.pdf'
  },
  {
    id: 2,
    name: 'Tarjeta Profesional',
    type: 'PDF',
    size: '1.2 MB',
    uploadDate: '2024-01-16',
    status: 'verified',
    url: '/documents/tarjeta.pdf'
  },
  {
    id: 3,
    name: 'Certificado de Especialización',
    type: 'PDF',
    size: '3.1 MB',
    uploadDate: '2024-01-17',
    status: 'pending',
    url: '/documents/especializacion.pdf'
  },
  {
    id: 4,
    name: 'Registro RETHUS',
    type: 'PDF',
    size: '890 KB',
    uploadDate: '2024-01-18',
    status: 'verified',
    url: '/documents/rethus.pdf'
  },
  {
    id: 5,
    name: 'Póliza de Responsabilidad Civil',
    type: 'PDF',
    size: '1.5 MB',
    uploadDate: '2024-01-19',
    status: 'verified',
    url: '/documents/poliza.pdf'
  }
]);

// Métodos
function viewDocument(doc: any) {
  selectedDocument.value = doc;
  // Abrir documento en nueva pestaña
  window.open(doc.url, '_blank');
}

function downloadDocument(doc: any) {
  // Crear link temporal para descarga
  const link = document.createElement('a');
  link.href = doc.url;
  link.download = doc.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function verifyDocument(doc: any) {
  doc.status = 'verified';
  // Aquí iría la llamada al backend para verificar el documento
}

function rejectDocument(doc: any) {
  doc.status = 'rejected';
  // Aquí iría la llamada al backend para rechazar el documento
}

function getStatusColor(status: string) {
  switch(status) {
    case 'verified': return 'text-green-600 bg-green-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

function getStatusText(status: string) {
  switch(status) {
    case 'verified': return 'Verificado';
    case 'pending': return 'Pendiente';
    case 'rejected': return 'Rechazado';
    default: return 'Desconocido';
  }
}

function close() {
  emit('close');
}
</script>

<template>
  <div class="bg-white rounded-lg h-full flex flex-col">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Documentos del Profesional</h2>
        <p class="text-sm text-gray-600 mt-1">
          {{ professional.names }} {{ professional.lastnames }}
        </p>
      </div>
      <button 
        @click="close"
        class="text-gray-500 hover:text-gray-700"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <!-- Body - Lista de documentos -->
    <div class="flex-1 overflow-y-auto px-6 py-4">
      <div class="space-y-3">
        <div 
          v-for="doc in documents" 
          :key="doc.id"
          class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- Icono del documento -->
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              
              <!-- Información del documento -->
              <div>
                <h3 class="font-medium text-gray-900">{{ doc.name }}</h3>
                <div class="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>{{ doc.type }}</span>
                  <span>•</span>
                  <span>{{ doc.size }}</span>
                  <span>•</span>
                  <span>{{ doc.uploadDate }}</span>
                </div>
              </div>
            </div>
            
            <!-- Estado y acciones -->
            <div class="flex items-center gap-3">
              <!-- Estado -->
              <span 
                :class="getStatusColor(doc.status)"
                class="px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ getStatusText(doc.status) }}
              </span>
              
              <!-- Acciones -->
              <div class="flex gap-1">
                <!-- Ver documento -->
                <button 
                  @click="viewDocument(doc)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ver documento"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                
                <!-- Descargar -->
                <button 
                  @click="downloadDocument(doc)"
                  class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Descargar documento"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                </button>
                
                <!-- Verificar (solo si está pendiente) -->
                <button 
                  v-if="doc.status === 'pending'"
                  @click="verifyDocument(doc)"
                  class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Verificar documento"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </button>
                
                <!-- Rechazar (solo si está pendiente) -->
                <button 
                  v-if="doc.status === 'pending'"
                  @click="rejectDocument(doc)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Rechazar documento"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mensaje si no hay documentos -->
        <div v-if="documents.length === 0" class="text-center py-8 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p>No se han cargado documentos</p>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
      <p class="text-sm text-gray-600">
        Total: {{ documents.length }} documento(s)
      </p>
      <button 
        @click="close"
        class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>