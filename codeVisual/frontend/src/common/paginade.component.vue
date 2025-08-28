<script setup lang="ts">
import type { meta_model } from '@/models/model_commont/meta.model';

 
const props = defineProps<{
  meta: meta_model;
}>();
const emit = defineEmits<{
  (e: 'change-page', page: number): void;
}>();

const nextPage = () => {
  if (props.meta.page < props.meta.lastPage) {
    emit('change-page', props.meta.page + 1);
  }
};

const prevPage = () => {
  if (props.meta.page > 1) {
    emit('change-page', props.meta.page - 1);
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.meta.lastPage) {
    emit('change-page', page);
  }
};
</script>

<template>
  <div class="flex justify-center items-center flex-wrap gap-2 mt-4">
    <button
      @click="prevPage"
      :disabled="meta.page === 1"
      class="px-3 py-1 border rounded disabled:opacity-50"
    >
      Anterior
    </button>

    <button
      v-for="page in meta.lastPage"
      :key="page"
      @click="goToPage(page)"
      :class="[
        'px-3 py-1 border rounded transition-all duration-200',
        page === meta.page
          ? 'bg-[var(--blue-1)] text-white font-semibold'
          : 'hover:bg-gray-100'
      ]"
    >
      {{ page }}
    </button>

    <button
      @click="nextPage"
      :disabled="meta.page === meta.lastPage"
      class="px-3 py-1 border rounded disabled:opacity-50"
    >
      Siguiente
    </button>
  </div>
</template>
