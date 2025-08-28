<script setup lang="ts">
import { useNotificationsStore } from '@/store';
import { computed, onMounted } from 'vue';

const store = useNotificationsStore();

onMounted(() => {
  store.getNotifications(); // cargar al montar
});

const pages = computed(() => {
  const totalPages = store.meta?.lastPage ?? 1;
  return Array.from({ length: totalPages }, (_, i) => i + 1);
});

function goToPage(page: number) {
  const totalPages = store.meta?.lastPage ?? 1;
  if (page >= 1 && page <= totalPages) {
    store.goToPage(page);
  }
}
</script>


<template>
  <div class="flex  overflow-x-auto space-x-2 py-6">
    <!-- Botón Anterior -->
    <button :disabled="store.page === 1" @click="goToPage(store.page - 1)"
      class="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
      «
    </button>

    <!-- Botones numerados -->
    <button v-for="pageNum in pages" :key="pageNum" @click="goToPage(pageNum)" :class="[
      'px-3 py-1 border rounded cursor-pointer',
      pageNum === store.page ? 'bg-[var(--blue-1)] text-white' : 'hover:bg-gray-200'
    ]">
      {{ pageNum }}
    </button>

    <!-- Botón Siguiente -->
    <button :disabled="store.page === store.total" @click="goToPage(store.page + 1)"
      class="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
      »
    </button>
  </div>
</template>
