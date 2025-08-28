<script lang="ts">
 
import { defineComponent } from 'vue';
import { formatTwoDigits, getMonthNameEs, formatHourMinute } from '@/utils/DateUtils';
import type { datas_List_reservation_profeccional_model } from "@/models/user_reservations/list_reservations_profeccional";
export default defineComponent({
    name: 'card_date_reservation_profeccional',
    props: {
        data_card: {
            type: Object as () => datas_List_reservation_profeccional_model,
            required: true
        }
    },
    setup(props) {
        const add_google_calendar = () => {
            const { data, date, price,datauser } = props.data_card

            // Crear fechas con los valores numéricos
            const start = new Date(date.year, date.month - 1, date.day, date.hour, date.minutes);
            const end = new Date(start.getTime() + 30 * 60 * 1000); // +30 minutos

            // Formato YYYYMMDD
            const dateStr = `${date.year}${String(date.month).padStart(2, "0")}${String(date.day).padStart(2, "0")}`;

            // Formato HHMMSS
            const startTime = `${String(start.getHours()).padStart(2, "0")}${String(start.getMinutes()).padStart(2, "0")}00`;
            const endTime = `${String(end.getHours()).padStart(2, "0")}${String(end.getMinutes()).padStart(2, "0")}00`;

            const startDateTime = `${dateStr}T${startTime}`;
            const endDateTime = `${dateStr}T${endTime}`;

            // Detalles del evento
            const title = encodeURIComponent(`Doc visual reserva con ${data.name}`);
            const details = encodeURIComponent(`Reserva con Dr. ${datauser.names}`);
            const coordinates = `${data.offices[0].latitude},${data.offices[0].longitude}`;
            const location = encodeURIComponent(coordinates);
            const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
            window.open(calendarUrl, "_blank");

        }


        return {
            add_google_calendar,
            formatTwoDigits,
            getMonthNameEs,
            formatHourMinute
        }
    }
});
</script>

<template>
    <div class="boder border-gray-200 rounded-2xl  w-full bg-white">
        <h1 class="text-2xl font-bold w-full text-center my-5">{{ `Cita ${formatTwoDigits(data_card.date.day)}
            ${getMonthNameEs(data_card.date.month)} ${data_card.date.year}` }}</h1>

        <div class="flex w-[90%] m-auto">
        
            <div class="w-full text-[14px] m-auto ml-2">
                <h1 class="text-2xl font-medium w-full text-center mb-5">{{ data_card.datauser.names }} {{ data_card.datauser.lastnames }}</h1>
            

                <div class="flex mb-4 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" class="mr-1"
                        width="20px" fill="var(--blue-1)">
                        <path
                            d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                    </svg>
                    <div >
                        <div>
                            <div class="flex items-center">
                                <h1 class="ml-1">{{
                                    formatTwoDigits(data_card.date.day) }}
                                </h1>
                                <h1 class="ml-1">{{
                                    getMonthNameEs(data_card.date.month)
                                }},</h1>
                                <h1>{{ data_card.date.year }},</h1>
                                <h1>{{ formatHourMinute(data_card.date.hour, data_card.date.minutes) }}</h1>
                            </div>

                        </div>

                    </div>

                </div>
                <div class="flex mb-5 items-center" v-if="data_card.data.offices[0]">
                    <!-- <img src="/assets/images/iconconsultorio.webp" class="    w-8 h-8 p-1" alt="Icono"> -->
                    <img src="../../../assets/images/iconconsultorio.webp" class="    w-8 h-8 p-1" alt="Icono">
                    <div class="ml-1">
                        <h1>{{ data_card.data.offices[0].description }}</h1>

                    </div>

                </div>
                <div class="flex mb-5 items-center">
                    <img src="../../../assets/images/icopnprepagada.webp" class="    w-8 h-8 p-1" alt="Icono">
                    <div class="ml-1">
                        <h1>{{ '...' }}</h1>

                    </div>

                </div>

            </div>

        </div>
        <div class="w-fit px-3 py-2 bg-[var(--blue-1)] text-white font-bold rounded-xl m-auto cursor-pointer  mb-5"
            @click="add_google_calendar">
            <h1 class="w-full text-center">+ Añadir al calendario</h1>
        </div>

    </div>
</template>
