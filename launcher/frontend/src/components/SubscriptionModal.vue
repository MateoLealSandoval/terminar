<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
      <button 
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
      >
        &times;
      </button>
      
      <div class="text-center">
        <div class="mb-6">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.186-.833-2.956 0L3.857 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ title }}
        </h3>
        
        <p class="text-sm text-gray-500 mb-6">
          {{ message }}
        </p>
        
        <div class="space-y-3">
          <button
            @click="goToPlans"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {{ buttonText }}
          </button>
          
          <button
            @click="closeModal"
            class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  show: boolean;
  title: string;
  message: string;
  buttonText: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();

const closeModal = () => {
  emit('close');
};

const goToPlans = () => {
  router.push('/planes');
  closeModal();
};
</script>