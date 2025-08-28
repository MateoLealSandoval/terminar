<script lang="ts" setup>
import { ref, watch, onMounted, computed, onUnmounted } from 'vue';

import { useNotificationsStore } from '@/store';
import { getTimeFromISOString } from '@/utils/DateUtils';
import type { notifications } from '@/dto/notifications';
import Select_Notification from './Select_Notification.vue';
type Notification = { title: string; text: string };
const notification_store = useNotificationsStore();
import Paginade_notifications from './Paginade_notifications.vue';
onMounted(() => {
    notification_store.getNotifications()
})
const realNotification = computed(() => notification_store.notifications || []);
const pagination = computed(() => notification_store.page || 0);

// Variables reactivas
const search = ref('');
const notificationSelect = ref<notifications | null>(null);
const notifications = ref<Notification[] | null>(null);

onUnmounted(() => {
    notification_store.reset();
});



// Seleccionar notificación
function selectNotification(notification: notifications) {
    notificationSelect.value = notification;
}







</script>

<template>
    <div class="w-full block md:flex items-stretch font-poppins  text-base " v-if="realNotification.length > 0">
 
        <!-- Columna Izquierda (30%) -->

        <div class="w-full md:w-[30%] h-auto flex flex-col  ">
            <div class="w-[90%] m-auto mt-8  rounded-xl bg-white flex flex-col flex-1 shadow  ">
                <div class="w-[90%] m-auto flex-1 overflow-auto flex flex-col">
                    <h1 class=" my-5">Notificaciones</h1>
                    <div class="w-full border rounded-2xl p-2 mb-4">
                        <input v-model="search" type="text" placeholder="Buscar notificación..."
                            class="border-gray-200 focus:outline-none focus:ring-0" />
                    </div>
                    <div class="flex-1 overflow-auto">
                        <div v-for="(data, index) in realNotification" :key="index" @click="selectNotification(data)"
                            class="mb-1 cursor-pointer hover:text-[var(--blue-1)]">

                            <div class="w-full flex justify-between ">
                                <div>
                                    <p class="text-xs">{{ getTimeFromISOString(data.createdAt) }}</p>
                                    <h1 class="mb-3 my-auto">{{ data.title }}</h1>
                                </div>

                                <svg v-if="data.state === 'CLOSE'" fill="#000000" viewBox="0 0 24 24" id="email"
                                    data-name="Flat Line" xmlns="http://www.w3.org/2000/svg"
                                    class="icon flat-line w-8 h-auto">
                                    <path id="secondary"
                                        d="M20.61,5.23l-8,6.28a1,1,0,0,1-1.24,0l-8-6.28A1,1,0,0,0,3,6V18a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V6A1,1,0,0,0,20.61,5.23Z"
                                        style="fill: rgb(44, 169, 188); stroke-width: 2;"></path>
                                    <path id="primary"
                                        d="M20,19H4a1,1,0,0,1-1-1V6A1,1,0,0,1,4,5H20a1,1,0,0,1,1,1V18A1,1,0,0,1,20,19ZM20,5H4a1,1,0,0,0-.62.22l8,6.29a1,1,0,0,0,1.24,0l8-6.29A1,1,0,0,0,20,5Z"
                                        style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;">
                                    </path>
                                </svg>
                                <svg v-else fill="#000000" width="800px" height="800px" viewBox="0 0 24 24"
                                    id="email-file-text" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg"
                                    class="icon flat-line w-8 h-auto  ">
                                    <path id="secondary"
                                        d="M12.55,14.63,19.45,10a1,1,0,0,1,1.55.83V20a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V10.87A1,1,0,0,1,4.55,10l6.9,4.59A1,1,0,0,0,12.55,14.63Z"
                                        style="fill: rgb(44, 169, 188); stroke-width: 2;"></path>
                                    <path id="primary"
                                        d="M11.45,14.63a1,1,0,0,0,1.1,0L18,11V4a1,1,0,0,0-1-1H8L6,5v6ZM6,5H8V3Zm6.55,9.63L19.45,10a1,1,0,0,1,1.55.83V20a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V10.87A1,1,0,0,1,4.55,10l6.9,4.59A1,1,0,0,0,12.55,14.63Z"
                                        style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;">
                                    </path>
                                </svg>
                            </div>

                            <hr />

                        </div>
                    </div>
                </div>
                <div class="  max-w-[90%] py-10 mx-auto ">
               
                    <Paginade_notifications />
                </div>
            </div>


        </div>


        <!-- Columna Derecha (65%) -->
        <div class="w-full md:w-[65%] h-auto">
            <div class="w-[90%] m-auto my-10">
                <div v-if="notificationSelect != null" class="w-full mb-6">
                    <Select_Notification :notification="notificationSelect" />

                </div>
                <!-- <div class="w-full  flex flex-col items-end">
                    <button
                        class="px-16  bg-[var(--blue-1)]   text-white rounded-2xl  py-2  cursor-pointer ">Enviar</button>
                </div> -->
            </div>
        </div>
    </div>
    <div v-else class="w-full h-[65dvh] flex flex-col justify-center items-center">
        <div class="w-full   bg-white text-center fonts-poppins  ">

            <img src="@/assets/imageIcons/icononotifica.webp" alt="No notificaciones" class="w-[250px] h-auto mx-auto" />
            <h1 class="text-2xl font-poppins pt-5 text-gray-500 font-semibold">No tienes notificaciones.</h1>
        </div>
    </div>


</template>