<script lang="ts" setup>
import type { datas_List_reservation_user_model } from "@/models/user_reservations";
import { use_reservations_store } from "@/store";
import { formatTwoDigits, getMonthNameEs, formatDateTimeEs } from '@/utils/DateUtils';
import Swal from "sweetalert2";
import { defineProps, defineEmits, ref, computed } from 'vue';
import modal_Float from '@/components/modal_Float.vue';
import EditReservation from './EditReservation.vue';
const storeReservation = use_reservations_store();

const props = defineProps<{
    data_card: datas_List_reservation_user_model
}>();

const emit = defineEmits<{
    (e: 'select-reservation', payload: datas_List_reservation_user_model): void
}>();

const select_reservation = () => {
    emit('select-reservation', props.data_card);
};

const modalEdit = ref(false);

const add_google_calendar = () => {
    const { data, date, price } = props.data_card;

    const start = new Date(date.year, date.month - 1, date.day, date.hour, date.minutes);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // +30 minutos

    const dateStr = `${date.year}${String(date.month).padStart(2, "0")}${String(date.day).padStart(2, "0")}`;
    const startTime = `${String(start.getHours()).padStart(2, "0")}${String(start.getMinutes()).padStart(2, "0")}00`;
    const endTime = `${String(end.getHours()).padStart(2, "0")}${String(end.getMinutes()).padStart(2, "0")}00`;

    const startDateTime = `${dateStr}T${startTime}`;
    const endDateTime = `${dateStr}T${endTime}`;

    const title = encodeURIComponent(`Doc visual reserva con ${data.name}`);
    const details = encodeURIComponent(`Reserva  con Dr. ${data.name}  ${data.specialists[0].name}`);
    const coordinates = `${data.offices[0].latitude},${data.offices[0].longitude}`;
    const location = encodeURIComponent(coordinates);
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
    window.open(calendarUrl, "_blank");
};

function openWhatsApp() {
    const { data } = props.data_card;
    const url = `https://wa.me/${data.phone}`;
    window.open(url, '_blank'); // Abre en una nueva pestaña
}
const isSmallScreen = ref(window.innerWidth < 768);
window.addEventListener('resize', () => {
    isSmallScreen.value = window.innerWidth < 768;
});

const modalWidth = computed(() => (isSmallScreen.value ? 100 : 80));
const modalHeight = computed(() => (isSmallScreen.value ? 100 : 80));
const cancelReservation = async () => {

    try {
        const { data_card } = props;

        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción cancelará tu cita. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            confirmButtonColor: 'var(--blue-1)',
            cancelButtonText: 'No, mantener',
        });
        if (confirm.isConfirmed) {
            const response = await storeReservation.cancel_reservationUser(data_card.id);
            Swal.fire({
                title: 'Cancelación exitosa',
                text: 'Tu cita ha sido cancelada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });


        }
    } catch (error) {
        let errorMessage = 'No se pudo cancelar la cita. Inténtalo más tarde.';

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        Swal.fire({
            title: 'Error al cancelar',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

}
const reloadData = async () => {
    await storeReservation.get_my_reviews()

    setModalEdit();
};
const setModalEdit = () => {
    modalEdit.value = !modalEdit.value;
};

</script>

<template>
    <div class="boder border-gray-200 rounded-2xl w-fit  mx-10 max-w-full  bg-white shadow shadow-gray-500/30 ">

        <modal_Float :model-value="modalEdit === true" :width-percent="modalWidth" :height-percent="modalWidth"
            v-if="modalEdit" @click-outside="setModalEdit">
            <EditReservation :data_card="data_card" @close-modal="setModalEdit" @reload="reloadData" />
        </modal_Float>
        <h1 class="text-2xl font-bold w-full text-center my-10">{{ `Cita ${formatTwoDigits(data_card.date.day)}
            ${getMonthNameEs(data_card.date.month)} ${data_card.date.year}` }}</h1>

        <div class="flex w-[90%] m-auto">
            <div
                class="w-16 h-16 md:w-32 md:h-32 mr-1 border border-white shadow-[2px_0px_0px_3px_var(--blue-1)] rounded-full overflow-hidden">
                <img :src="data_card.data.perfilPhoto" alt="Avatar" class="w-full h-full object-cover" />
            </div>

            <div class="w-[70%] text-[14px] m-auto ml-2">
                <h1 class="text-xl md:text-2xl font-medium mb-3">{{ data_card.data.name }}</h1>
                <h1 class="mb-5" v-if="data_card.data.specialists[0]">{{ data_card.data.specialists[0].name }}</h1>

                <div class="flex mb-4 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" class="mr-2"
                        width="20px" fill="var(--blue-1)">
                        <path
                            d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                    </svg>
                    <div>
                        <div>
                            <div class="flex items-center">
                                <h1>{{
                                    formatDateTimeEs(data_card.date.year, data_card.date.month, data_card.date.day,
                                        data_card.date.hour, data_card.date.minutes
                                    )
                                }}
                                </h1>

                            </div>

                        </div>

                    </div>

                </div>
                <div class="flex mb-5 items-center" v-if="data_card.data.offices[0]">
                    <!-- <img src="/assets/images/iconconsultorio.webp" class="    w-8 h-8 p-1" alt="Icono"> -->
                    <img src="../../../../assets/images/iconconsultorio.webp" class="    w-8 h-8 p-1" alt="consultorio">
                    <div>
                        <h1>{{ data_card.data.offices[0].description }}</h1>

                    </div>

                </div>
                <div class="flex mb-5 items-center">
                    <img src="../../../../assets/images/icopnprepagada.webp" class="    w-8 h-8 p-1" alt="prepagada">
                    <div>
                        <h1>
                            {{
                                data_card.payment === 'ANTICIPATED'
                                    ? 'Pago anticipado'
                                    : data_card.payment === 'SITE'
                            ? 'Pago en el lugar'
                            : ''
                            }}
                        </h1>

                    </div>

                </div>

            </div>

        </div>
        <div v-if="data_card.status === 'ACTIVE'"
            class="w-fit px-3 py-2 bg-[var(--blue-1)] text-white font-bold rounded-xl m-auto cursor-pointer   mb-3"
            @click="add_google_calendar">
            <h1 class="w-full text-center">+ Añadir al calendario</h1>
        </div>
        <div class="w-[90%] mx-auto flex gap-2" v-if="data_card.status === 'ACTIVE' ">
            <div class="w-1/2 py-2 bg-[var(--blue-1)] text-white font-bold rounded-xl m-auto cursor-pointer   "
                @click="setModalEdit">
                <h1 class="w-full text-center">Reprogramar cita</h1>
            </div>
            <div class="w-1/2 py-2 bg-[var(--blue-1)] text-white font-bold rounded-xl m-auto cursor-pointer   "
                @click="cancelReservation">
                <h1 class="w-full text-center">Cancelar cita</h1>
            </div>
        </div>
        <div class="w-fit mx-auto gap-3 flex py-5 items-center cursor-pointer" @click="openWhatsApp">
            <img src="@/assets/images/whatsAppBlue.webp" alt="WhatsApp" class="w-10 h-10 object-contain" />
            <h1 class="text-xl font-semibold text-[var(--blue-1)]">Comunicarme con mi especialista</h1>
        </div>
        <div v-if="data_card.status === 'PENDING'"
            class="w-fit   py-2 bg-[var(--blue-1)] text-white font-bold rounded-xl m-auto cursor-pointer  mb-10 px-10"
            @click="select_reservation">
            <h1 class="w-full text-center">Calificar</h1>
        </div>
        <div v-if="data_card.status === 'COMPLETED'"
            class="w-fit   py-2     font-bold rounded-xl m-auto cursor-pointer  mb-10 px-10">
            <h1 class="w-full text-center text-[var(--blue-1)]">Finalizada</h1>
        </div>
        <div v-if="data_card.status === 'CANCELLED'"
            class="w-fit   py-2   text-white font-bold rounded-xl m-auto cursor-pointer  mb-10 px-10">
            <h1 class="w-full text-center">Cancelado</h1>
        </div>

    </div>
</template>
