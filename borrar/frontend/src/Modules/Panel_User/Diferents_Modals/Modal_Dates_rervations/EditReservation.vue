<script setup lang="ts">
import type { datas_List_reservation_user_model } from '@/models/user_reservations';
import { useProfesionalDetailStore } from '@/store';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { getDayName, getMonthName, isValidDate, getDayNameSpanish, formatDateTimeEs } from '@/utils/DateUtils'
import type { ListDateDetail } from '@/dto/profession_detail';

import type { ReservationResponsePartnert } from '@/models/user_reservations/reservation.partnert';
import Swal from 'sweetalert2';
import axios from 'axios';
const listDates = ref<ListDateDetail[]>([]);
const props = defineProps<{
    data_card: datas_List_reservation_user_model
}>();
const emit = defineEmits(['reload' ])
const office = ref(props.data_card.data.offices[0]);

const user_professional_detail_store = useProfesionalDetailStore()
const shedules_days = computed(() => user_professional_detail_store.actually_days || []);
onMounted(async () => {
    await user_professional_detail_store.get_shedules(props.data_card.data.offices[0].id, listDates.value)
    await user_professional_detail_store.clear_data();
    await user_professional_detail_store.getProfessional(props.data_card.data.id);

    initDate.value = {
        id: props.data_card.data.id,
        date: {
            day: props.data_card.date.day,
            month: props.data_card.date.month,
            year: props.data_card.date.year,

            isValid: isValidDate(props.data_card.date.day, props.data_card.date.month, props.data_card.date.year),
            nameday: getDayName(props.data_card.date.month, props.data_card.date.day, props.data_card.date.year)
        },
        openTime: formatHour(props.data_card.date.hour, props.data_card.date.minutes),
        closeTime: '',
    };



    const today = new Date()
    currentDay.value = today.getDate()
    exploreday.value = today.getDate()
    currentMonth.value = today.getMonth() + 1
    exploreMonth.value = today.getMonth() + 1
    currentYear.value = today.getFullYear()
    exploreYear.value = today.getFullYear()
    daysInMonth.value = getDaysInMonth(currentYear.value, currentMonth.value)
    getListDates()

})

const onListDatesChange = () => {
    if (props.data_card.data.offices[0].id && listDates.value.length) {
        user_professional_detail_store.get_shedules(props.data_card.data.offices[0].id, listDates.value)
    }
};
watch([() => listDates.value], onListDatesChange, { deep: true });
const maxLength = computed(() => {
    const days = shedules_days.value;
    return Math.max(...Object.values(days).map(list => list.length));
});
const nextdate = () => {
    if (listDates.value.length > 4) {
        const lastDate = listDates.value[listDates.value.length - 1];
        exploreMonth.value = lastDate.month;
        exploreYear.value = lastDate.year;
        exploreday.value = lastDate.day;
        getListDates()
    }
}
const getListDates = () => {
    listDates.value = [];
    // Verificamos que exploreYear, exploreMonth y exploreday estén definidos
    if (exploreYear.value != null && exploreMonth.value != null && exploreday.value != null && currentDay.value != null && currentMonth.value != null && currentYear.value != null) {
        const todayExplorer = isToday(
            exploreday.value,      // día de exploración
            exploreMonth.value,    // mes de exploración
            exploreYear.value,     // año de exploración
            currentDay.value,      // día actual
            currentMonth.value,    // mes actual
            currentYear.value      // año actual
        );
        let startDate = new Date(
            exploreYear.value,
            exploreMonth.value - 1,
            exploreday.value
        );
        if (!todayExplorer) {
            // Si no es hoy, se le suma un día a startDate
            startDate.setDate(startDate.getDate() + 1);
        }

        // Generamos 3 fechas consecutivas (por ejemplo, hoy y los 2 días siguientes)

        for (let i = 0; i < 5; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Ajustamos a 1-indexado
            const year = currentDate.getFullYear();
            const name_day = getDayName(month, day, year)
            listDates.value.push({
                day,
                month,
                year,
                isValid: isValidDate(day, month, year),
                nameday: name_day
            });
        }
        const lastDate = new Date(startDate);
        lastDate.setDate(startDate.getDate() + 2);
        exploreday.value = lastDate.getDate();
        exploreMonth.value = lastDate.getMonth() + 1;
        exploreYear.value = lastDate.getFullYear();

    }
}
const dataReservation = ref<ReservationResponsePartnert | null>(null)

const selectdateHour = (ListDateDetail: ListDateDetail, hour: string, finishHour: string, id: string) => {


    selected_date_and_hour.value = {
        date: ListDateDetail,
        openTime: hour,
        closeTime: finishHour,
        id: id
    }
}




const currentDay = ref<number | null>(null)
const currentMonth = ref<number | null>(null)
const currentYear = ref<number | null>(null)
const daysInMonth = ref<number | null>(null)

const exploreday = ref<number | null>(null)
const exploreMonth = ref<number | null>(null)
const exploreYear = ref<number | null>(null)

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate()
}
function formatDate(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // los meses van de 0 a 11
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}
function isToday(
    day: number,
    month: number,
    year: number,
    compareDay: number,
    compareMonth: number,
    compareYear: number
): boolean {
    return day === compareDay && month === compareMonth && year === compareYear
}
const selected_date_and_hour = ref<{
    id: string,
    date: ListDateDetail;
    openTime: string;
    closeTime: string;
} | null>(null);

const initDate = ref<{
    id: string,
    date: ListDateDetail;
    openTime: string;
    closeTime: string;
} | null>(null);

const panels = reactive({
    opinionsData: false,

});
const setPanel = (name: keyof typeof panels) => {
    panels[name] = !panels[name];

};
function formatHour(hour: number, minute: number): string {
    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    return `${hh}:${mm}`;
}
const getListDatesBackwards = () => {
    // Verificamos que ya exista una fecha de referencia en listDates[0]
    if (!listDates.value || listDates.value.length === 0) return;

    // Creamos un objeto Date a partir de la fecha de referencia
    const refDate = new Date(
        listDates.value[0].year,
        listDates.value[0].month - 1, // JavaScript espera meses de 0 a 11
        listDates.value[0].day
    );
    listDates.value = [];

    // Generamos 3 días anteriores
    for (let i = 1; i <= 5; i++) {
        // Clonamos refDate y restamos i días
        const prevDate = new Date(refDate);
        prevDate.setDate(prevDate.getDate() - i);


        // Insertamos al inicio del array para mantener el orden deseado
        const preday = prevDate.getDate()
        const preyear = prevDate.getFullYear()
        const preMonth = prevDate.getMonth() + 1
        listDates.value.unshift({
            day: preday,
            month: preMonth,
            year: prevDate.getFullYear(),
            isValid: isValidDate(prevDate.getDate(), prevDate.getMonth() + 1, prevDate.getFullYear()),
            nameday: getDayName(preMonth, preday, preyear)

        });

    }
}
const updateDate = async () => {
    try {
        if (!selected_date_and_hour.value || !initDate.value) throw new Error('No hay fecha seleccionada');
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Estas seguro de cambiar tu cita de la fecha ${formatDateTimeEs(initDate.value?.date.year, initDate.value?.date.month, initDate.value?.date.day)} a las ${initDate.value.openTime}  a la fecha  ${formatDateTimeEs(selected_date_and_hour.value.date.year, selected_date_and_hour.value.date.month, selected_date_and_hour.value.date.day)} a las ${selected_date_and_hour.value.openTime}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            confirmButtonColor: 'var(--blue-1)',
            cancelButtonText: 'No, mantener',
        });
        if (confirm.isConfirmed) {
            const year = selected_date_and_hour.value.date.year;
            const month = selected_date_and_hour.value.date.month.toString().padStart(2, '0');
            const day = selected_date_and_hour.value.date.day.toString().padStart(2, '0');
            const [hourStr, minuteStr] = selected_date_and_hour.value.openTime.split(':');
            const hour = hourStr.padStart(2, '0');
            const minute = minuteStr.padStart(2, '0');
            const dateString = `${year}-${month}-${day}T${hour}:${minute}:00Z`;
            const date = new Date(dateString);
            const response = await axios.patch('/reservations-calendar', {
                id: props.data_card.id,
                idshedule: selected_date_and_hour.value.id,
                date: date,
            });
            if (response.data.status == 200) {
                 emit('reload')
            }
            await Swal.fire({
                title: 'Fecha actializada',
                text: 'Tu cita ha sido actializada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'var(--blue-1)',
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
            confirmButtonColor: 'var(--blue-1)',
        });
        return;
    }

}


</script>

<template>
    <div class="w-full ">
        <div class="    w-full flex   justify-between  " v-if="currentDay && currentMonth && currentYear">
            <!-- Flecha izquierda -->
            <button @click="getListDatesBackwards" class="  w-12 h-12 mt-2 flex items-center justify-center  text-gray-600 hover:text-gray-900 cursor-pointer 
                        transition-opacity duration-300" :class="isToday(listDates[0].day, listDates[0].month, listDates[0].year, currentDay, currentMonth, currentYear)
                            ? 'opacity-0 invisible'
                            : 'opacity-100 visible'">
                <img src="@/assets/svg/arrow.svg" alt="Icono" class="w-4 h-4 transition-transform   rotate-180">
            </button>

            <!-- Flecha derecha -->
            <button
                class="w-12 h-12 mt-2 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer"
                @click="nextdate">
                <img src="@/assets/svg/arrow.svg" alt="Icono" class="w-4 h-4 transition-transform  ">
            </button>
        </div>

        <div class="w-full   text-[9px] md:text-base font-poppins"
            v-if="listDates.length && listDates != null && currentDay && currentMonth && currentYear">
            <div class="w-[95%] mx-auto  flex gap-10 justify-between ">

                <div class="w-[20%]  text-black py-4 rounded-lg text-center">
                    <h1 class="text-[var(--blue-1)] pb-2 font-semibold"
                        v-if="!isToday(listDates[0].day, listDates[0].month, listDates[0].year, currentDay, currentMonth, currentYear)">
                        {{ getDayNameSpanish(listDates[0].nameday) }}
                    </h1>
                    <h1 class="  pb-2 font-semibold"
                        :class="{ 'text-[var(--blue-1)]': listDates[0].isValid, 'text-[var(--blue-1)]/50': !listDates[0].isValid }"
                        v-else>Hoy</h1>

                    <h1 class="mb-5"
                        :class="{ 'text-black': listDates[0].isValid, 'text-black/50': !listDates[0].isValid }">
                        {{ listDates[0].day }}</h1>
                    <!-- @click="selectdata(listDates[0].day, listDates[0].month, listDates[0].year, data.hour, data.minute)" -->
                    <!-- -->
                    <div v-for="index in maxLength + 1" :key="index" :class="[
                        initDate &&
                            listDates[0].day === initDate.date.day &&
                            listDates[0].month === initDate.date.month &&
                            listDates[0].year === initDate.date.year &&
                            shedules_days[listDates[0].nameday]?.[index - 1]?.openTime === initDate.openTime
                            ? 'bg-gray-400 text-white'
                            : '',
                        'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                        shedules_days[listDates[0].nameday]?.[index - 1]?.reserver === false &&
                            shedules_days[listDates[0].nameday]?.[index - 1]?.active === true ? 'border' : '',

                        selected_date_and_hour &&
                            listDates[0] === selected_date_and_hour.date &&
                            shedules_days[listDates[0].nameday]?.[index - 1]?.id === selected_date_and_hour.id
                            ? 'bg-[var(--blue-1)] text-white border-none'
                            : ''
                    ]">
                        <h1 v-if="shedules_days[listDates[0].nameday]?.[index - 1]?.active === true &&
                            shedules_days[listDates[0].nameday]?.[index - 1]?.openTime" @click="() => {
                                if (!shedules_days[listDates[0].nameday][index - 1].reserver)
                                    selectdateHour(
                                        listDates[0],
                                        shedules_days[listDates[0].nameday][index - 1].openTime,
                                        shedules_days[listDates[0].nameday][index - 1].closeTime,
                                        shedules_days[listDates[0].nameday][index - 1].id
                                    )
                            }" class="cursor-pointer   px-2 py-1 rounded">
                            <span :class="[
                                shedules_days[listDates[0].nameday][index - 1].reserver ? 'line-through  ' : ''
                            ]">
                                {{ shedules_days[listDates[0].nameday][index - 1].openTime }}
                            </span>
                        </h1>


                        <h1 v-else class="text-gray-400">---</h1>

                        <h1 v-else>---</h1>
                    </div>

                </div>

                <div class="w-[20%]  text-black py-4 rounded-lg text-center">
                    <h1 class="  pb-2 font-semibold"
                        :class="{ 'text-[var(--blue-1)]': listDates[1].isValid, 'text-[var(--blue-1)]/50': !listDates[1].isValid }">
                        {{
                            getDayNameSpanish(listDates[1].nameday) }}
                    </h1>
                    <h1 class="mb-5" :class="{
                        'text-black': listDates[1].isValid,
                        'text-black/50': !listDates[1].isValid
                    }">{{ listDates[1].day }}</h1>

                    <div v-for="index in maxLength + 1" :key="index" :class="[
                        initDate &&
                            listDates[1].day === initDate.date.day &&
                            listDates[1].month === initDate.date.month &&
                            listDates[1].year === initDate.date.year &&
                            shedules_days[listDates[1].nameday]?.[index - 1]?.openTime === initDate.openTime
                            ? 'bg-gray-400 text-white'
                            : '',
                        'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                        shedules_days[listDates[1].nameday]?.[index - 1]?.reserver === false &&
                            shedules_days[listDates[1].nameday]?.[index - 1]?.active === true ? 'border' : '',

                        selected_date_and_hour &&
                            listDates[1] === selected_date_and_hour.date &&
                            shedules_days[listDates[1].nameday]?.[index - 1]?.id === selected_date_and_hour.id
                            ? 'bg-[var(--blue-1)] text-white border-none'
                            : ''
                    ]">
                        <h1 v-if="shedules_days[listDates[1].nameday]?.[index - 1]?.active === true" @click="() => {
                            if (!shedules_days[listDates[1].nameday][index - 1].reserver)
                                selectdateHour(
                                    listDates[1],
                                    shedules_days[listDates[1].nameday][index - 1].openTime,
                                    shedules_days[listDates[1].nameday][index - 1].closeTime,
                                    shedules_days[listDates[1].nameday][index - 1].id
                                )
                        }">
                            <span :class="[
                                shedules_days[listDates[1].nameday]?.[index - 1]?.reserver === true
                                    ? 'line-through  '
                                    : ''
                            ]">
                                {{ shedules_days[listDates[1].nameday]?.[index - 1]?.openTime || '---' }}
                            </span>
                        </h1>
                        <h1 v-else>---</h1>
                    </div>

                </div>
                <div class=" w-[20%] text-black py-4 rounded-lg text-center">
                    <h1 class="  pb-2 font-semibold"
                        :class="{ 'text-[var(--blue-1)]': listDates[2].isValid, 'text-[var(--blue-1)]/50': !listDates[2].isValid }">
                        {{
                            getDayNameSpanish(listDates[2].nameday) }}
                    </h1>
                    <h1 class="mb-5"
                        :class="{ 'text-black': listDates[2].isValid, 'text-black/50': !listDates[2].isValid }">
                        {{ listDates[2].day }}</h1>
                    <!--  -->
                    <div v-for="index in maxLength" :key="index" :class="[
                        initDate &&
                            listDates[2].day === initDate.date.day &&
                            listDates[2].month === initDate.date.month &&
                            listDates[2].year === initDate.date.year &&
                            shedules_days[listDates[2].nameday]?.[index - 1]?.openTime === initDate.openTime
                            ? 'bg-gray-400 text-white'
                            : '',
                        'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                        shedules_days[listDates[2].nameday]?.[index - 1]?.reserver === false &&
                            shedules_days[listDates[2].nameday]?.[index - 1]?.active === true ? 'border' : '',

                        selected_date_and_hour &&
                            listDates[2] === selected_date_and_hour.date &&
                            shedules_days[listDates[2].nameday]?.[index - 1]?.id === selected_date_and_hour.id

                            ? 'bg-[var(--blue-1)] text-white border-none'
                            : ''
                    ]">
                        <h1 v-if="shedules_days[listDates[2].nameday]?.[index - 1]?.active === true" @click="() => {
                            if (!shedules_days[listDates[2].nameday][index - 1].reserver)
                                selectdateHour(
                                    listDates[2],
                                    shedules_days[listDates[2].nameday][index - 1].openTime,
                                    shedules_days[listDates[2].nameday][index - 1].closeTime,
                                    shedules_days[listDates[2].nameday][index - 1].id
                                )
                        }">
                            <span :class="[
                                shedules_days[listDates[2].nameday]?.[index - 1]?.reserver === true
                                    ? 'line-through  '
                                    : ''
                            ]">
                                {{ shedules_days[listDates[2].nameday]?.[index - 1]?.openTime || '---' }}
                            </span>
                        </h1>
                        <h1 v-else>---</h1>
                    </div>
                </div>
                <div class=" w-[20%] text-black py-4 rounded-lg text-center">
                    <h1 class="  pb-2 font-semibold"
                        :class="{ 'text-[var(--blue-1)]': listDates[3].isValid, 'text-[var(--blue-1)]/50': !listDates[3].isValid }">
                        {{
                            getDayNameSpanish(listDates[3].nameday) }}
                    </h1>
                    <h1 class="mb-5"
                        :class="{ 'text-black': listDates[3].isValid, 'text-black/50': !listDates[3].isValid }">
                        {{ listDates[3].day }}</h1>
                    <!--  -->
                    <div v-for="index in maxLength" :key="index" :class="[
                        initDate &&
                            listDates[3].day === initDate.date.day &&
                            listDates[3].month === initDate.date.month &&
                            listDates[3].year === initDate.date.year &&
                            shedules_days[listDates[3].nameday]?.[index - 1]?.openTime === initDate.openTime
                            ? 'bg-gray-400 text-white'
                            : '',
                        'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                        shedules_days[listDates[3].nameday]?.[index - 1]?.reserver === false &&
                            shedules_days[listDates[3].nameday]?.[index - 1]?.active === true ? 'border' : '',

                        selected_date_and_hour &&
                            listDates[3] === selected_date_and_hour.date &&
                            shedules_days[listDates[3].nameday]?.[index - 1]?.id === selected_date_and_hour.id

                            ? 'bg-[var(--blue-1)] text-white border-none'
                            : ''
                    ]">
                        <h1 v-if="shedules_days[listDates[3].nameday]?.[index - 1]?.active === true" @click="() => {
                            if (!shedules_days[listDates[3].nameday][index - 1].reserver)
                                selectdateHour(
                                    listDates[3],
                                    shedules_days[listDates[3].nameday][index - 1].openTime,
                                    shedules_days[listDates[3].nameday][index - 1].closeTime,
                                    shedules_days[listDates[3].nameday][index - 1].id
                                )
                        }">
                            <span :class="[
                                shedules_days[listDates[3].nameday]?.[index - 1]?.reserver === true
                                    ? 'line-through  '
                                    : ''
                            ]">
                                {{ shedules_days[listDates[3].nameday]?.[index - 1]?.openTime || '---' }}
                            </span>
                        </h1>
                        <h1 v-else>---</h1>
                    </div>
                </div>
                <div class=" w-[20%] text-black py-4 rounded-lg text-center">
                    <h1 class="  pb-2 font-semibold"
                        :class="{ 'text-[var(--blue-1)]': listDates[4].isValid, 'text-[var(--blue-1)]/50': !listDates[4].isValid }">
                        {{
                            getDayNameSpanish(listDates[4].nameday) }}
                    </h1>
                    <h1 class="mb-5"
                        :class="{ 'text-black': listDates[4].isValid, 'text-black/50': !listDates[4].isValid }">
                        {{ listDates[4].day }}</h1>
                    <!--  -->
                    <div v-for="index in maxLength + 1" :key="index" :class="[
                        initDate &&
                            listDates[4].day === initDate.date.day &&
                            listDates[4].month === initDate.date.month &&
                            listDates[4].year === initDate.date.year &&
                            shedules_days[listDates[4].nameday]?.[index - 1]?.openTime === initDate.openTime
                            ? 'bg-gray-400  '
                            : '',


                        'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                        shedules_days[listDates[4].nameday]?.[index - 1]?.reserver === false &&
                            shedules_days[listDates[4].nameday]?.[index - 1]?.active === true ? 'border' : '',

                        selected_date_and_hour &&
                            listDates[4] === selected_date_and_hour.date &&
                            shedules_days[listDates[4].nameday]?.[index - 1]?.id === selected_date_and_hour.id

                            ? 'bg-[var(--blue-1)] text-white border-none'
                            : ''
                    ]">
                        <h1 v-if="shedules_days[listDates[4].nameday]?.[index - 1]?.active === true" @click="() => {

                            if (!shedules_days[listDates[4].nameday][index - 1].reserver)
                                selectdateHour(
                                    listDates[4],
                                    shedules_days[listDates[4].nameday][index - 1].openTime,
                                    shedules_days[listDates[4].nameday][index - 1].closeTime,
                                    shedules_days[listDates[4].nameday][index - 1].id
                                )
                        }">
                            <span :class="[

                                shedules_days[listDates[4].nameday]?.[index - 1]?.reserver === true
                                    ? 'line-through  '
                                    : ''
                            ]">
                                {{ shedules_days[listDates[4].nameday]?.[index - 1]?.openTime || '---' }}
                            </span>
                        </h1>
                        <h1 v-else>---</h1>
                    </div>

                </div>
            </div>
            <div @click="updateDate"
                class="w-[95%] mx-auto  flex gap-10 justify-between mt-5 bg-[var(--blue-1)] text-white py-3 px-5 rounded-lg cursor-pointer">
                <h1 class="w-full text-center font-semibold">Cambiar fecha de reserva</h1>

            </div>

        </div>
    </div>

</template>