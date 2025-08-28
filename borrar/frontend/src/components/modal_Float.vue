<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
 
  widthPercent?: number;
  heightPercent?: number;
}>();

const emit = defineEmits(['clickOutside']);

const modalStyle = computed(() => ({
  width: props.widthPercent ? `${props.widthPercent}%` : '60%',
  height: props.heightPercent ? `${props.heightPercent}%` : '60%',
}));
</script>

<template>
  <div
   
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 "
    @click.self="emit('clickOutside')"
  >
    <div
      class="bg-white rounded-2xl p-6 shadow-lg transition-all overflow-y-auto"
      :style="modalStyle"
    >
      <slot />
    </div>
  </div>
</template>
