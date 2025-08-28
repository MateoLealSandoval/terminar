<script lang="ts">



import type { Shedule, Shedule_item } from '@/dto/professional/shedules';
import Item_add_shedule from './Item_add_shedule.vue';
import { ref } from 'vue';
import axios from 'axios';

export default {
    name: 'add_servicess',
    components: {
        Item_add_shedule
    },
    props: {
        idOfficine: String,
        fetchSchedules: Function,
        office_day:String
    },
    setup(props, { emit }) {
        const closeModal = () => {
            emit("close");
        };
        const intervalOptions = [
            { label: "30 minutos", value: 30 },
            { label: "1 hora", value: 60 },
            { label: "1 hora y 30 minutos", value: 90 },
            { label: "2 horas", value: 120 }
        ];
        const selectedInterval = ref(30);
        const shedules_items = ref<Shedule_item | null>(null);

        const updateSchedule = (schedule: Shedule_item, active: boolean) => {

            shedules_items.value = schedule
      
            
        };
        const create_shedules = async () => {
            if (props.idOfficine && shedules_items.value) {
                const body_shedule_create: Shedule = {
                    intervalMinutes: selectedInterval.value,
                    officeId: props.idOfficine,
                    schedules: shedules_items.value
                }
                const response = await axios.post('/reservations', body_shedule_create)
             
                if(response.status==201 && props.fetchSchedules){
                    await props.fetchSchedules()
                    closeModal()
                }
            } 
        }

        return {
            closeModal,
            updateSchedule,
            intervalOptions,
            selectedInterval,
            create_shedules,
            office_day: props.office_day
        }
    }

}
</script>
<template>
    <div class="modal font-poppins ">
        <div class="flex justify-end">
            <span class="cursor-pointer text-xl font-bold" @click="closeModal">✕</span>
        </div>
        <!-- Select del tipo de intervalo -->
        <div class="mb-3">
            <label class="block text-sm font-medium">Intervalo:</label>
            <select v-model="selectedInterval" class="border rounded p-2 w-full">
                <option v-for="option in intervalOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>
        <Item_add_shedule :selected-day="office_day" @update-schedule="updateSchedule" />
        
        <div class="w-full bg-[var(--blue-1)] rounded-2xl cursor-pointer flex justify-center text-white py-2"
            @click="create_shedules">
            Crear horario semanal
        </div>

    </div>
</template>