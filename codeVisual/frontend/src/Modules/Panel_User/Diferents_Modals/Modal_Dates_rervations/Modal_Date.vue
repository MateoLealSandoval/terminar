<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { use_reservations_store } from '@/store';
import type { datas_List_reservation_user_model } from '@/models/user_reservations';
import Card_date_reservation from './Card_date_reservation.vue';
import Calification from './Calification.vue';

// Props
const props = defineProps<{
  opensearch: () => void
}>();

// Store
const store_reservation = use_reservations_store();

// Data
const selectedReservationCalification = ref<datas_List_reservation_user_model | null>(null);

// Lifecycle
onMounted(() => {
  store_reservation.get_my_reviews();
});

// Computed
const list_reservations = computed(() => store_reservation.list_reservations || []);

// Methods
const handleSelect = (reservation: datas_List_reservation_user_model) => {
  selectedReservationCalification.value = reservation;
};

const cancelCalification = () => {
  selectedReservationCalification.value = null;
};
</script>
<template>
    <div class="w-full  overflow-y-auto   " v-if="selectedReservationCalification === null">
        <div class="w-full">
            <h1 class="text-2xl  p-2 font-semibold w-full  md:w-[90%]  m-auto  ">Mis citas</h1>
            <hr class="text-gray-300" />
        </div>
        <div class="w-full h-full flex flex-col justify-center items-center mt-10"
            v-if="list_reservations.length === 0">
            <div class="flex flex-col items-center gap-4">
                <svg class="w-[30%] h-auto text-[var(--blue-1)]" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960" fill="currentColor">
                    <path
                        d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                </svg>

                <h1 class="text-2xl font-semibold text-gray-600 text-center">
                    No tienes citas agendadas
                </h1>

                <button class=" cursor-pointer   bg-[var(--blue-1)] p-3 px-20 text-white font-semibold rounded-2xl" @click="opensearch">
                    Agenda tu primera cita
                </button>
            </div>
        </div>
        <div v-else class="w-full flex flex-col items-center">
            <Card_date_reservation v-for="(item, index) in list_reservations" :data_card="item" :key="index"
                class="my-10 w-lg" @select-reservation="handleSelect" />
        </div>
    </div>
    <!-- calification -->
    <div class="w-full  overflow-y-auto  h-[80vh]" v-else>
        <div class="w-full flex justify-between">
            <h1 class="text-xl md:text-2xl  p-2 font-semibold  pl-10 md:pl-20   my-6">Calificar cita</h1>
            <div class="text-xl md:text-2xl  p-2 font-semibold  pr-15  md:pr-20   my-6  text-[var(--blue-1)] cursor-pointer"
                @click="cancelCalification">
                <h1>Volver</h1>
            </div>
        </div>
        <hr class="text-gray-300 w-full" />
        <div class="w-full  ">
            <Calification :data_card="selectedReservationCalification" :onCancel="cancelCalification" />
        </div>
    </div>



</template>