<script lang="ts">
import { use_reservations_store } from '@/store';
import data from './Mock/data.json'
import Card_valoration from '@/common/Card_valoration.vue';
import { onMounted } from 'vue';
export default {
    name: 'panel_user_client_reviews',
    components: {
        Card_valoration
    },
    setup() {
       
        return {
            data: data
        };
    }

}
</script>

<template>
    <div class=" w-full flex items-stretch font-poppins text-xs md:text-base" v-if="data.notifications.length">
        <!-- Columna Izquierda (30%) -->
        <div class="hidden md:block w-[40%] md:w-[30%]   ">

            <div class="w-[90%] m-auto mt-10 border rounded-2xl bg-white flex-1 min-h-[80vh]">
                <h1 class="w-[90%] m-auto font-bold my-5">Valoraciones</h1>
                <div v-for="(data, index) in data?.reviews" :key="index" class="w-[90%] m-auto mb-1">
                    <h1>{{ data.name }}</h1>
                    <hr />
                </div>
            </div>
        </div>

        <!-- Columna Derecha (65%) -->
        <div class="w-[100%]  md:w-[65%] h-auto">
            <div class="w-[85%] m-auto my-10">
                <div v-for="(data, index) in data?.reviews" :key="index" class="w-full mb-6">
                    <Card_valoration :data="data" />
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <h1>No existen notificaciones</h1>
    </div>
</template>
