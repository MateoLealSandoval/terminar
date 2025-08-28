<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { getDayName, getMonthName, isValidDate, getDayNameSpanish } from '@/utils/DateUtils'
import { profeccional_reservations_store } from '@/store/proceccional_reservations.store'
//components
import modal_Float from '@/components/modal_Float.vue'
import { usePofessionalStorage, useProfesionalDetailStore } from '@/store'
import type { office_professional_dto } from '@/dto/professional/office_professional'
import type { ListDateDetail } from '@/dto/profession_detail'
import axios from 'axios'
import Swal from "sweetalert2";
import type { ReservationResponsePartnert } from '@/models/user_reservations/reservation.partnert'
// Variables reactivas
const alldata = ref(false)
const myDiary = ref([])



const user_professional_detail_store = useProfesionalDetailStore()
const store_professional = usePofessionalStorage();
const iduser = computed(() => store_professional.professional_detail?.id || null);
const offices = computed(() => store_professional.professional_detail?.offices || []);
const shedules_days = computed(() => user_professional_detail_store.actually_days || []);
const selectedOffice = ref<office_professional_dto | null>(null);
const store_reservations = profeccional_reservations_store()
const listDates = ref<ListDateDetail[]>([]);
watch(offices, (newOffices) => {
  if (newOffices.length > 0 && !selectedOffice.value) {
    selectedOffice.value = newOffices[0];
  }
});
const maxLength = computed(() => {
  const days = shedules_days.value;
  return Math.max(...Object.values(days).map(list => list.length));
});
const dataReservation = ref<ReservationResponsePartnert | null>(null)

const getDataselect = async () => {
  try {
    const response = await axios.get(`reservations-calendar/reservation/partner/${selected_date_and_hour.value?.id}`)
    dataReservation.value = response.data.data

  } catch (error) {
    const err = error as any;
    Swal.fire({
      icon: 'error',
      title: 'Error al obtener la reserva',
      text: err.response?.data?.message || 'Ocurrió un error inesperado.',
    });
  }
}

const onListDatesChange = () => {
  if (selectedOffice.value?.id && listDates.value.length) {
    user_professional_detail_store.get_shedules(selectedOffice.value?.id, listDates.value)
  }

};
watch([() => listDates.value, () => selectedOffice.value], onListDatesChange, { deep: true });



const selectdate = ref<Date[]>([

])

const currentDay = ref<number | null>(null)
const currentMonth = ref<number | null>(null)
const currentYear = ref<number | null>(null)
const daysInMonth = ref<number | null>(null)

const exploreday = ref<number | null>(null)
const exploreMonth = ref<number | null>(null)
const exploreYear = ref<number | null>(null)

const monthName = computed(() => {
  if (listDates.value.length === 0) {
    return null
  }
  const firstMonth = listDates.value[0].month
  const lastMonth = listDates.value[listDates.value.length - 1].month
  const firstMonthName = getMonthName(firstMonth)
  const lastMonthName = getMonthName(lastMonth)
  return firstMonth === lastMonth ? firstMonthName : `${firstMonthName} - ${lastMonthName}`
})

function setOption() {
  alldata.value = !alldata.value
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
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

function getTimeString(hour: number, minutes: number): string {
  return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

function isDate(day: number, month: number, year: number, hour: number, minute: number): boolean {
  return selectdate.value.some(date =>
    date.getDate() === day &&
    date.getMonth() + 1 === month &&
    date.getFullYear() === year &&
    date.getHours() === hour &&
    date.getMinutes() === minute
  )
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


  const earliest = listDates.value[0]
  exploreday.value = earliest.day
  exploreMonth.value = earliest.month
  exploreYear.value = earliest.year
}

const getListDates = () => {
  // Reiniciamos la lista
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


const nextdate = () => {
  if (listDates.value.length > 5) {
    const lastDate = listDates.value[listDates.value.length - 1];
    exploreMonth.value = lastDate.month;
    exploreYear.value = lastDate.year;
    exploreday.value = lastDate.day;
    getListDates()
  }
}

onMounted(async () => {
  await store_professional.get_user_profesional_detail();

  store_reservations.get_my_reviews()
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
onUnmounted(async () => {
  await user_professional_detail_store.clear_data();
  if (iduser.value) {
    await user_professional_detail_store.getProfessional(iduser.value);
  }

});
const panels = reactive({
  opinionsData: false,
  schedules: false
});
function onOfficeChange() {


}
const selected_date_and_hour = ref<{
  id: string,
  date: ListDateDetail;
  openTime: string;
  closeTime: string;
} | null>(null);

const clearSelectDateAndhours = () => {
  selected_date_and_hour.value = null
}
const cleardata = async () => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción cancelará la reserva.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No, volver'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`reservations-calendar/cancel/professional/${selected_date_and_hour.value?.id}`);

      Swal.fire({
        icon: 'success',
        title: 'Reserva cancelada',
        text: 'La reserva se canceló correctamente.'
      });



      if (selectedOffice.value?.id) {
        console.log('Ejecutando get_shedules...');
        user_professional_detail_store.get_shedules(selectedOffice.value?.id, listDates.value);
      }



      // Opcional: limpiar el estado local
      clearSelectDateAndhours();

    } catch (error) {
      const err = error as any;
      Swal.fire({
        icon: 'error',
        title: 'Error al cancelar la reserva',
        text: err.response?.data?.message || 'Ocurrió un error inesperado.',
      });
    }
  }
};
const selectdateHour = async (ListDateDetail: ListDateDetail, hour: string, finishHour: string, id: string) => {

  selected_date_and_hour.value = {
    date: ListDateDetail,
    openTime: hour,
    closeTime: finishHour,
    id: id
  }
  await getDataselect()
}
const setPanel = (name: keyof typeof panels) => {
  panels[name] = !panels[name];

};
</script>

<template>
  <div class="w-full   text-[9px] md:text-base font-poppins"
    v-if="listDates.length && listDates != null && currentDay && currentMonth && currentYear">


    <modal_Float v-if="selected_date_and_hour" :height-percent="50" :width-percent="50"
      v-on:click-outside="clearSelectDateAndhours">
      <div class="w-full h-full p-3 flex flex-col justify-between">

        <!-- Contenido principal -->
        <div>
          <div class="flex">
            <div class="w-1/3">
              <h1 class="text-[var(--blue-1)]">Hora de inicio</h1>
              <h1>{{ selected_date_and_hour.openTime }}</h1>
            </div>
            <div class="w-1/3">
              <h1 class="text-[var(--blue-1)]">Hora de cierre</h1>
              <h1>{{ selected_date_and_hour.closeTime }}</h1>
            </div>
            <div class="w-1/3">
              <h1 class="text-[var(--blue-1)]">Oficina</h1>
              <h1>{{ dataReservation?.office.offices[0].title }}</h1>
            </div>
          </div>

          <h1 class="text-2xl font-bold my-10">Datos paciente</h1>
          <div class="w-full flex">
            <div class="w-1/2 flex gap-3">
              <h1>Nombre:</h1>
              <h1>{{ dataReservation?.user.names }}</h1>
            </div>
            <div class="w-1/2 flex gap-3">
              <h1>Correo:</h1>
              <h1>{{ dataReservation?.user.email }}</h1>
            </div>
          </div>
        </div>

        <!-- Botones al fondo -->
        <div class="flex justify-end gap-4 mt-6">
          <button @click="cleardata"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer">
            Borrar
          </button>
          <button @click="clearSelectDateAndhours"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </modal_Float>


    <div class="w-[95%] mx-auto ">
      <select id="office" v-model="selectedOffice" @change="onOfficeChange" class="border py-1 px-2 rounded-xs mb-10">
        <option :value="null" disabled>Selecciona un local</option>
        <option v-for="office in offices" :key="office.id" :value="office">
          {{ office.title }}
        </option>
      </select>
    </div>


    <div class="w-[95%] mx-auto  flex gap-10 justify-between ">

      <div class="w-[20%]  text-black py-4 rounded-lg text-center">
        <h1 class="text-[var(--blue-1)] pb-2 font-semibold"
          v-if="!isToday(listDates[0].day, listDates[0].month, listDates[0].year, currentDay, currentMonth, currentYear)">
          {{ getDayNameSpanish(listDates[0].nameday) }}
        </h1>
        <h1 class="  pb-2 font-semibold"
          :class="{ 'text-[var(--blue-1)]': listDates[0].isValid, 'text-[var(--blue-1)]/50': !listDates[0].isValid }"
          v-else>Hoy</h1>

        <h1 class="mb-5" :class="{ 'text-black': listDates[0].isValid, 'text-black/50': !listDates[0].isValid }">
          {{ listDates[0].day }}</h1>
        <!-- @click="selectdata(listDates[0].day, listDates[0].month, listDates[0].year, data.hour, data.minute)" -->
        <!-- -->
        <div v-for="index in maxLength + 1" :key="index" :class="[
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
              if (shedules_days[listDates[0].nameday][index - 1].reserver)
                selectdateHour(
                  listDates[0],
                  shedules_days[listDates[0].nameday][index - 1].openTime,
                  shedules_days[listDates[0].nameday][index - 1].closeTime,
                  shedules_days[listDates[0].nameday][index - 1].id
                )
            }" class="cursor-pointer   px-2 py-1 rounded">
            <span :class="[
              shedules_days[listDates[0].nameday][index - 1].reserver ? 'line-through text-gray-400' : ''
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
          'rounded-xl px-2 py-4 mb-2 cursor-pointer',
          shedules_days[listDates[1].nameday]?.[index - 1]?.reserver === false &&
            shedules_days[listDates[1].nameday]?.[index - 1]?.active === true ? 'border' : '',

          selected_date_and_hour &&
            listDates[0] === selected_date_and_hour.date &&
            shedules_days[listDates[1].nameday]?.[index - 1]?.id === selected_date_and_hour.id
            ? 'bg-[var(--blue-1)] text-white border-none'
            : ''
        ]">
          <h1 v-if="shedules_days[listDates[1].nameday]?.[index - 1]?.active === true" @click="() => {
            if (shedules_days[listDates[1].nameday][index - 1].reserver)
              selectdateHour(
                listDates[1],
                shedules_days[listDates[1].nameday][index - 1].openTime,
                shedules_days[listDates[1].nameday][index - 1].closeTime,
                shedules_days[listDates[1].nameday][index - 1].id
              )
          }">
            <span :class="[
              shedules_days[listDates[1].nameday]?.[index - 1]?.reserver === true
                ? 'line-through text-gray-400'
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
        <h1 class="mb-5" :class="{ 'text-black': listDates[2].isValid, 'text-black/50': !listDates[2].isValid }">
          {{ listDates[2].day }}</h1>
        <!--  -->
        <div v-for="index in maxLength" :key="index" :class="[
          'rounded-xl px-2 py-4 mb-2 cursor-pointer',
          shedules_days[listDates[2].nameday]?.[index - 1]?.reserver === false &&
            shedules_days[listDates[2].nameday]?.[index - 1]?.active === true ? 'border' : '',

          selected_date_and_hour &&
            listDates[0] === selected_date_and_hour.date &&
            shedules_days[listDates[2].nameday]?.[index - 1]?.id === selected_date_and_hour.id

            ? 'bg-[var(--blue-1)] text-white border-none'
            : ''
        ]">
          <h1 v-if="shedules_days[listDates[2].nameday]?.[index - 1]?.active === true" @click="() => {
            if (shedules_days[listDates[2].nameday][index - 1].reserver)
              selectdateHour(
                listDates[2],
                shedules_days[listDates[2].nameday][index - 1].openTime,
                shedules_days[listDates[2].nameday][index - 1].closeTime,
                shedules_days[listDates[2].nameday][index - 1].id
              )
          }">
            <span :class="[
              shedules_days[listDates[2].nameday]?.[index - 1]?.reserver === true
                ? 'line-through text-gray-400'
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
        <h1 class="mb-5" :class="{ 'text-black': listDates[3].isValid, 'text-black/50': !listDates[3].isValid }">
          {{ listDates[3].day }}</h1>
        <!--  -->
        <div v-for="index in maxLength + 1" :key="index" :class="[
          'rounded-xl px-2 py-4 mb-2 cursor-pointer',
          shedules_days[listDates[3].nameday]?.[index - 1]?.reserver === false &&
            shedules_days[listDates[3].nameday]?.[index - 1]?.active === true ? 'border' : '',

          selected_date_and_hour &&
            listDates[0] === selected_date_and_hour.date &&
            shedules_days[listDates[3].nameday]?.[index - 1]?.id === selected_date_and_hour.id

            ? 'bg-[var(--blue-1)] text-white border-none'
            : ''
        ]">
          <h1 v-if="shedules_days[listDates[3].nameday]?.[index - 1]?.active === true" @click="() => {
            if (shedules_days[listDates[3].nameday][index - 1].reserver)
              selectdateHour(
                listDates[3],
                shedules_days[listDates[3].nameday][index - 1].openTime,
                shedules_days[listDates[3].nameday][index - 1].closeTime,
                shedules_days[listDates[3].nameday][index - 1].id
              )
          }">
            <span :class="[
              shedules_days[listDates[3].nameday]?.[index - 1]?.reserver === true
                ? 'line-through text-gray-400'
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
        <h1 class="mb-5" :class="{ 'text-black': listDates[4].isValid, 'text-black/50': !listDates[4].isValid }">
          {{ listDates[4].day }}</h1>
        <!--  -->
        <div v-for="index in maxLength + 1" :key="index" :class="[
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
            if (shedules_days[listDates[4].nameday][index - 1].reserver)
              selectdateHour(
                listDates[4],
                shedules_days[listDates[4].nameday][index - 1].openTime,
                shedules_days[listDates[4].nameday][index - 1].closeTime,
                shedules_days[listDates[4].nameday][index - 1].id
              )
          }">
            <span :class="[
              shedules_days[listDates[4].nameday]?.[index - 1]?.reserver === true
                ? 'line-through text-gray-400'
                : ''
            ]">
              {{ shedules_days[listDates[4].nameday]?.[index - 1]?.openTime || '---' }}
            </span>
          </h1>
          <h1 v-else>---</h1>
        </div>

      </div>
    </div>
    <h1 class="text-center font-bold text-[var(--blue-1)] cursor-pointer" v-if="!panels.schedules"
      @click="setPanel('schedules')">ver más horarios</h1>
    <h1 class="text-center font-bold text-[var(--blue-1)] cursor-pointer" v-else @click="setPanel('schedules')">ver
      menos</h1>

  </div>
</template>