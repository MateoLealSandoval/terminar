<script lang="ts">
import type { Shedule_item } from '@/dto/professional/shedules';
import { ref, watch, computed } from 'vue';
export default {
    props: {
        selectedDay: String
    },
    emits: ["update-schedule"],
    name: 'add_servicess',
    setup(props, { emit }) {
        const dayOfWeek = ref(props.selectedDay || '');
        const esdayOfWeek = ref('');
        const selectedStartTime = ref('');
        const selectedEndTime = ref('');
        const active = ref(true)
        // Mapeo de los días en inglés a su descripción en español
        const daysMap: Record<string, string> = {
            MONDAY: 'LUNES',
            TUESDAY: 'MARTES',
            WEDNESDAY: 'MIÉRCOLES',
            THURSDAY: 'JUEVES',
            FRIDAY: 'VIERNES',
            SATURDAY: 'SÁBADO',
            SUNDAY: 'DOMINGO'
        };
        const notActive = () => {
            active.value = false
        }
        const Active = () => {
            active.value = true
        }
        // Generar los intervalos de tiempo cada 30 minutos
        const timeSlots = Array.from({ length: 48 }, (_, i) => {
            const hours = String(Math.floor(i / 2)).padStart(2, '0');
            const minutes = i % 2 === 0 ? '00' : '30';
            return `${hours}:${minutes}`;
        });
        watch([selectedStartTime, selectedEndTime, active], () => {
            if (selectedStartTime.value && selectedEndTime.value) {
                // Convertir a minutos totales
                const startMinutes = parseInt(selectedStartTime.value.split(":")[0]) * 60 + parseInt(selectedStartTime.value.split(":")[1]);
                const endMinutes = parseInt(selectedEndTime.value.split(":")[0]) * 60 + parseInt(selectedEndTime.value.split(":")[1]);

                if (endMinutes > startMinutes) {
                    const newSchedule: Shedule_item = {
                        closeTime: selectedEndTime.value,
                        day: dayOfWeek.value as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY",
                        openTime: selectedStartTime.value,

                    };

                    // Emitir solo si closeTime es mayor que openTime
                    emit("update-schedule", newSchedule, active.value);
                }
            }
            if (!active) {
                const newSchedule: Shedule_item = {
                    closeTime: selectedEndTime.value,
                    day: dayOfWeek.value as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY",
                    openTime: selectedStartTime.value,

                };
                emit("update-schedule", newSchedule, active);
            }
        });

        // Filtrar las opciones de la hora final para que sean mayores que la inicial
        const availableEndTimes = computed(() => {
            if (!selectedStartTime.value) return timeSlots; // Si no hay inicio, mostrar todos
            return timeSlots.filter(time => time > selectedStartTime.value);
        });

        watch(() => props.selectedDay, (newVal) => {
            if (newVal) {
                dayOfWeek.value = newVal;
                esdayOfWeek.value = daysMap[newVal] || '';
            }
        }, { immediate: true });

        return {
            active,
            notActive,
            Active,
            timeSlots,
            availableEndTimes,
            dayOfWeek,
            esdayOfWeek,
            selectedStartTime,
            selectedEndTime
        };
    }
};
</script>

<template>
    <div class="modal font-poppins flex flex-col gap-4 mb-2">


        <div class="  gap-3   items-center">
            <h1 class="text-lg font-normal">{{ esdayOfWeek }}</h1>
            <!-- Select para la hora de inicio -->
            <div class="sm:flex  " v-if="active">
                <select v-model="selectedStartTime" class="border border-gray-200 p-2 rounded-xl bg-white mb-5 sm:mb-0">
                    <option value="" disabled>Selecciona hora de inicio</option>
                    <option v-for="time in timeSlots" :key="time" :value="time">
                        {{ time }}
                    </option>
                </select>

                <!-- Select para la hora de fin -->
                <select v-model="selectedEndTime" class="border border-gray-200 p-2 rounded-xl bg-white">
                    <option value="" disabled>Selecciona hora de fin</option>
                    <option v-for="time in availableEndTimes" :key="time" :value="time">
                        {{ time }}
                    </option>
                </select>
            </div>
            <h1 v-else>
                Sin horario. 
            </h1>
            <!-- icons  -->
            <div class="flex">
                <svg xmlns="http://www.w3.org/2000/svg" @click="notActive" viewBox="0 -960 960 960"
                    class="w-5 h-auto text-gray-400 cursor-pointer" fill="currentColor">
                    <path
                        d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" @click="Active" viewBox="0 -960 960 960"
                    class="w-5 h-auto text-gray-400 cursor-pointer" fill="currentColor">
                    <path
                        d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
            </div>
        </div>
    </div>
</template>
