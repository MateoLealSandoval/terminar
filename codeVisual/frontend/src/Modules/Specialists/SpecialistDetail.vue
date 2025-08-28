<script lang="ts">
import type { Specialist, Opinion } from './Specialist';
import Navbar from '../Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';
import { getMonthName, getDayName, isValidDate, getDayNameSpanish } from '@/utils/DateUtils'
import MapLeafet from './MapLeafet.vue';
import { useProfesionalDetailStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue';
import type { add_office_professional_dto_id } from '@/dto/professional/office_professional';
import type { ListDateDetail } from '@/dto/profession_detail/ListDatesDetail.dto';
import { usePaymentStore } from '@/store/payment.store';
import { favoritesStore } from '@/store/favorites.store';
import { toast } from 'vue3-toastify';
import type { CalificationItem } from '@/models/Califications';

enum ScoreType {
    RECOMMENDATION = "RECOMENDATION",
    TREATMENT = "TREATMENT",
    PERSONAL = "PERSONAL",
    WAITING = "WAITING",
    INSTALLATION = "INTALATION"
}
export default {
    name: "specialist_detail",
    props: {
        id: {
            type: String,
            required: false,
            default: null
        },
        modoVista: {
            type: Boolean,
            required: false, // Esto lo hace opcional
            default: false   // Puedes omitir esto si no quieres un valor por defecto
        }
    },
    components: {
        Navbar,
        Footer_Color,
        MapLeafet
    },
    setup(props, { emit }) {


        const updateData = async () => {

            if (idExists.value && props.id) {
                emit('update-data', props.id); // ✅ emit clásico
                await user_professional_detail_store.getProfessional(props.id);
            }
        };
        const payment_store = usePaymentStore()
        const user_professional_detail_store = useProfesionalDetailStore()
        const detail_favorite = computed(() => user_professional_detail_store.favorite || false);
        const shedules_days = computed(() => user_professional_detail_store.actually_days || []);
        const get_calification = computed(() => user_professional_detail_store.califications_summary || null);
        const route = useRoute();
        const router = useRouter();

        const id = route.params.id as string;
        //reactive data store
        const data = computed(() => user_professional_detail_store.profesional_detail);
        const photos = computed(() => {
            if (!data.value?.photos) return [];
            const groups = [];
            for (let i = 0; i < data.value.photos.length; i += 3) {
                groups.push(data.value.photos.slice(i, i + 3));
            }
            return groups;
        });
        const panels = reactive({
            opinionsData: false,
            schedules: false
        });
        const selected_date_and_hour = ref<{
            id: string,
            date: ListDateDetail;
            openTime: string;
            closeTime: string;
        } | null>(null);
        const setPanel = (name: keyof typeof panels) => {
            panels[name] = !panels[name];

        };
        const localselect = ref<add_office_professional_dto_id | null>(null);
        onMounted(() => {
            console.log(listDates.value)
            if (!props.id) {
                user_professional_detail_store.getProfessional(id)
                user_professional_detail_store.get_calification(id)
            } else {
                user_professional_detail_store.getProfessional(props.id)
                user_professional_detail_store.get_calification(props.id)
            }
        });
        onUnmounted(() => {
            user_professional_detail_store.clear_data();

        });
        const service = ref<{
            id: string;
            name: string;
            price: number;
            status: string;
            UserDataId: string;
        } | null>(null);
        const prepagada = ref<{
            id: string;
            name: string;
            type: 'SITE' | 'ANTICIPATED' ;
            status: string;
            UserDataId: string;
        } | null>(null);
        const urlFormat = (url: string) => {
            if (!url) return '#';
            url = url.trim();
            return /^https?:\/\//i.test(url) ? url : `https://${url}`;
        };
        const selectdateHour = (ListDateDetail: ListDateDetail, hour: string, finishHour: string, id: string) => {

            selected_date_and_hour.value = {
                date: ListDateDetail,
                openTime: hour,
                closeTime: finishHour,
                id: id
            }
        }

        const selectpay = ref<string>('');
        const functionPayment = async () => {
            const missingFields: string[] = [];

            if (!service.value) missingFields.push("servicio");
            if (!prepagada.value) missingFields.push("método de pago");
            if (!localselect.value) missingFields.push("local");
            if (!selected_date_and_hour.value) missingFields.push("fecha y hora");

            if (missingFields.length > 0) {
                toast.error(`Faltan los siguientes campos: ${missingFields.join(", ")}`, {

                    position: "top-center",

                });
                return;
            }
            if (
                service.value &&
                localselect.value &&
                selected_date_and_hour.value&&
                prepagada.value
            ) {

                await payment_store.FillDataAndNavigate(
                    service.value,
                    localselect.value,
                    {name:prepagada.value?.name,type:prepagada.value?.type},
                    selected_date_and_hour.value,
                    id,
                    router
                );
            }


        }
        const state = reactive({
            heart: true
        })

        const toggleHeart = async () => {
            try {
                const store_favorite = favoritesStore()
                const option = detail_favorite.value;

                if (data.value?.id) {
                    if (option === false) {
                        await user_professional_detail_store.add_favorite(data.value?.id)

                        toast.success(`Agregaste a ${data.value.name} a tu lista de favoritos`, {
                            position: 'top-center'
                        })
                    }
                    if (option === true) {
                        await user_professional_detail_store.delete_favorite(data.value?.id)


                        toast.success(`Borraste a ${data.value.name} de tu lista de favoritos`, {
                            position: 'top-center'
                        })
                    }



                } else {
                    toast.error(`Error al cargar datos`, {
                        position: 'top-center'
                    })
                }
            } catch (error) {
                toast.error(`Errror al intentar agregar a lista de favoritos`, {
                    position: 'top-center'
                })
            }


        };
        watchEffect(() => {
            if (data.value?.offices && data.value.offices.length > 0) {
                localselect.value = data.value.offices[0];
            }
        });
        const listDates = ref<ListDateDetail[]>([]);
        const onListDatesChange = () => {
            if (localselect.value?.id && listDates.value.length) {
                user_professional_detail_store.get_shedules(localselect.value?.id, listDates.value)
            }

        };

        watch([() => listDates.value, () => localselect.value], onListDatesChange, { deep: true });

        const movilepanel = reactive({
            schedule: false
        });
        const idExists = computed(() => !!props.id);
        const modoVista = computed(() => props.modoVista)

        return {
            prepagada,
            modoVista,
            idExists,
            get_calification,
            updateData,
            iduser: props.id,
            detail_favorite,
            functionPayment,
            selected_date_and_hour,
            selectdateHour,
            setPanel,
            shedules_days,
            photos,
            toggleHeart,
            state,
            urlFormat,
            data,
            payments: [
                "Particular",
                "Allianz",
                "Axa Colpatria",
                "Colmédica",
                "Colsanitas",
                "Compensar",
                "Coomeva",
                "MediSanitas",
                "Seguros Bolívar",
                "Sura",
                "Otros"
            ],
            specialist: null as Specialist | null,
            groupedImages: [] as string[][],

            totalPointType: {
                RECOMMENDATION: 0,
                TREATMENT: 0,
                PERSONAL: 0,
                WAITING: 0,
                INSTALLATION: 0
            },

            panels,
            selectpay,
            currentDay: null as number | null,
            currentMonth: null as number | null,
            currentYear: null as number | null,
            daysInMonth: null as number | null,
            localselect,
            selectdate: null as Date | null,
            service,
            exploreday: null as number | null,
            exploreMonth: null as number | null,
            exploreYear: null as number | null,
            totalScore: 0,
            listDates,
            movilepanel
        };
    },

    computed: {
        monthName(): string | null {
            if (this.listDates.length === 0) {
                return null;
            }
            const firstMonth = this.listDates[0].month;
            const lastMonth = this.listDates[this.listDates.length - 1].month;
            const firstMonthName = getMonthName(firstMonth);
            const lastMonthName = getMonthName(lastMonth);
            return firstMonth === lastMonth ? firstMonthName : `${firstMonthName} - ${lastMonthName}`;
        }

    },

    mounted() {
        const today = new Date();
        this.currentDay = today.getDate();
        this.exploreday = today.getDate();

        this.currentMonth = today.getMonth() + 1;
        this.exploreMonth = today.getMonth() + 1;

        this.exploreYear = today.getFullYear();
        this.currentYear = today.getFullYear();

        this.daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
        this.getListDates()

    },

    methods: {

        getDayNameSpanish,
        getScore(type: ScoreType, scores: Opinion[]): number {
            const filteredScores = scores
                .flatMap(opinion => opinion.score) // Extrae todos los puntajes de cada opinión
                .filter(score => score.type === type) // Filtra por el tipo solicitado
                .map(score => score.score); // Obtiene solo los valores numéricos

            if (filteredScores.length === 0) return 0; // Evita división por 0

            const sum = filteredScores.reduce((acc, value) => acc + value, 0);

            return Math.round(sum / filteredScores.length); // Calcula el promedio y redondea
        },
        getScoreTotal(opinions: Opinion[]): number {
            if (opinions.length === 0) return 0;
            const totalScores = opinions
                .flatMap(opinion => opinion.score) // Extrae todos los puntajes
                .map(score => score.score); // Obtiene solo los valores numéricos

            if (totalScores.length === 0) return 0; // Evita división por 0 si no hay puntajes

            const sum = totalScores.reduce((acc, value) => acc + value, 0);

            return Math.round(sum / totalScores.length);
        },
      
        getListDates() {
            // Reiniciamos la lista
            this.listDates = [];

            // Verificamos que exploreYear, exploreMonth y exploreday estén definidos
            if (this.exploreYear != null && this.exploreMonth != null && this.exploreday != null && this.currentDay != null && this.currentMonth != null && this.currentYear != null) {
                // Creamos un objeto Date a partir de la fecha de exploración
                const todayExplorer = this.isToday(
                    this.exploreday,      // día de exploración
                    this.exploreMonth,    // mes de exploración
                    this.exploreYear,     // año de exploración
                    this.currentDay,      // día actual
                    this.currentMonth,    // mes actual
                    this.currentYear      // año actual
                );

                let startDate = new Date(
                    this.exploreYear,
                    this.exploreMonth - 1,
                    this.exploreday
                );

                if (!todayExplorer) {
                    // Si no es hoy, se le suma un día a startDate
                    startDate.setDate(startDate.getDate() + 1);
                }

                // Generamos 3 fechas consecutivas (por ejemplo, hoy y los 2 días siguientes)

                for (let i = 0; i < 3; i++) {
                    // Clonamos startDate y le sumamos i días
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + i);

                    const day = currentDate.getDate();
                    const month = currentDate.getMonth() + 1; // Ajustamos a 1-indexado
                    const year = currentDate.getFullYear();




                    // Agregamos el objeto con la fecha a la lista
                    const name_day = getDayName(month, day, year)
                    this.listDates.push({

                        day,
                        month,
                        year,
                        isValid: isValidDate(day, month, year),
                        nameday: name_day
                    });
                }
                // Actualizamos los valores de explore* a la última fecha generada
                // En este caso, la última fecha es startDate + 2 días (ya que el bucle va de 0 a 2)
                const lastDate = new Date(startDate);
                lastDate.setDate(startDate.getDate() + 2);
                this.exploreday = lastDate.getDate();
                this.exploreMonth = lastDate.getMonth() + 1;
                this.exploreYear = lastDate.getFullYear();

            }


        },
        getTimeString(hour: number, minutes: number): string {
            const hourStr = hour.toString().padStart(2, '0');
            const minutesStr = minutes.toString().padStart(2, '0');
            return `${hourStr}:${minutesStr}`;
        },

        getListDatesBackwards() {
            // Verificamos que ya exista una fecha de referencia en listDates[0]
            if (!this.listDates || this.listDates.length === 0) return;

            // Creamos un objeto Date a partir de la fecha de referencia
            const refDate = new Date(
                this.listDates[0].year,
                this.listDates[0].month - 1, // JavaScript espera meses de 0 a 11
                this.listDates[0].day
            );
            this.listDates = [];

            // Generamos 3 días anteriores
            for (let i = 1; i <= 3; i++) {
                // Clonamos refDate y restamos i días
                const prevDate = new Date(refDate);
                prevDate.setDate(prevDate.getDate() - i);


                // Insertamos al inicio del array para mantener el orden deseado
                const preday = prevDate.getDate()
                const preyear = prevDate.getFullYear()
                const preMonth = prevDate.getMonth() + 1
                this.listDates.unshift({
                    day: preday,
                    month: preMonth,
                    year: prevDate.getFullYear(),
                    isValid: isValidDate(prevDate.getDate(), prevDate.getMonth() + 1, prevDate.getFullYear()),
                    nameday: getDayName(preMonth, preday, preyear)

                });

            }
            // Actualizamos los valores de explore con la fecha más antigua generada
            if (this.listDates.length > 0) {
                const earliest = this.listDates[0];
                this.exploreday = earliest.day;
                this.exploreMonth = earliest.month;
                this.exploreYear = earliest.year;
            }



        },


        isToday(
            day: number,
            month: number,
            year: number,
            compareDay: number,
            compareMonth: number,
            compareYear: number
        ): boolean {
            return (day === compareDay && month === compareMonth && year === compareYear);
        },
        isData(day: number, month: number, year: number, hour: number, minutes: number): boolean {
            const date1 = new Date(
                year,
                month - 1,
                day,
                hour,
                minutes
            )
            if (this.selectdate != null) {
                return date1.getFullYear() === this.selectdate.getFullYear() &&
                    date1.getMonth() === this.selectdate.getMonth() &&
                    date1.getDate() === this.selectdate.getDate() && date1.getHours() === this.selectdate.getHours() && date1.getMinutes() === this.selectdate.getMinutes()
            } else {
                return false
            }

        },
        getDaysInMonth(year: number, month: number): number {
            return new Date(year, month, 0).getDate();
        },
        groupImages() {
            if (this.specialist != null) {
                this.groupedImages = [];
                for (let i = 0; i < this.specialist.gallery.length; i += 3) {
                    this.groupedImages.push(this.specialist.gallery.slice(i, i + 3));
                }
            }
        },
        selectdata(day: number, month: number, year: number, hour: number, minute: number) {
            const dateData = new Date(year, month - 1, day, hour, minute);
            if (
                this.selectdate != null &&
                dateData.getFullYear() === this.selectdate.getFullYear() &&
                dateData.getMonth() === this.selectdate.getMonth() &&
                dateData.getDate() === this.selectdate.getDate() &&
                dateData.getHours() === this.selectdate.getHours() &&
                dateData.getMinutes() === this.selectdate.getMinutes()
            ) {
                this.selectdate = null;
            } else {
                this.selectdate = dateData;
            }
        },

        setPanelMovile(name: keyof typeof this.movilepanel) {
            this.movilepanel[name] = !this.movilepanel[name];
        },

        nextdate() {
            if (this.listDates.length > 2) {
                const lastDate = this.listDates[this.listDates.length - 1];
                this.exploreMonth = lastDate.month;
                this.exploreYear = lastDate.year;
                this.exploreday = lastDate.day;
                this.getListDates()
            }
        },
        getname(name: string): string {
            const namearray = name.split(" ");
            return `${namearray[0].charAt(0)}. ${namearray[1].charAt(0)}`
        },
        formatPrice(price: number) {
            return new Intl.NumberFormat('es-CO').format(price);
        },
    }
}

</script>
<template>
    <div class="w-full bg-gradient-to-r from-gray-100 to-gray-50 font-poppins">
        <Navbar v-if="!modoVista" />
        <!-- movile shedule -->
        <div v-if="!modoVista">
            <button v-if="!movilepanel.schedule"
                class="fixed bottom-4 left-1/2 transform -translate-x-1/2 lg:hidden  bg-[var(--blue-1)] flex justify-center gap-2 text-white px-6 py-3 rounded container cursor-pointer z-50"
                @click="setPanelMovile('schedule');">

                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#ffffff">
                    <path
                        d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                </svg>

                <h1 class="font-bold">Agendar cita</h1>
            </button>
            <div v-else
                class="fixed inset-0 z-100 bg-black/50    flex justify-center items-center sm:flex md:flex lg:hidden"
                @click.self="setPanelMovile('schedule')">
                <!-- Contenedor del modal -->
                <div
                    class="bg-white w-[90%] max-w-[90%] min-h-[80%] max-h-[80%]  rounded-2xl shadow-lg flex flex-col overflow-y-auto">
                    <!-- Encabezado -->


                    <!-- Encabezado -->
                    <div class="w-full">

                        <hr class="text-gray-200" />
                        <div
                            class="w-full  ml-auto   min-h-[60vh] border border-gray-300 bg-white rounded-2xl  font-poppins text-sm sticky top-5">
                            <h1 class="font-poppins font-bold  w-[90%] m-auto my-3">{{ `Agendar tu cita con
                                ${data?.name}`
                                }}</h1>
                            <ol class="  mx-auto list-decimal list-inside">
                                <li class="font-poppins text-base  w-[90%]  m-auto my-3">Escoge el servicio</li>

                                <div class="relative w-[90%] m-auto  ">
                                    <!-- Ícono -->
                                    <img src="@/assets/images/iconconsulta.webp"
                                        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-1 "
                                        alt="Icono">


                                    <!-- Select -->
                                    <select v-model="service" id="specialist"
                                        class="border p-2   pl-12 w-full rounded-xl flex appearance-none   border-gray-400">
                                        <option disabled value="">Escoge el servicio</option>
                                        <option v-for="(service, index) in data?.services?.filter(s => s.price > 0)"
                                            :key="index" :value="service">
                                            {{
                                                service.name === 'CONSULTA'
                                                    ? 'Consulta seguimiento'
                                                    : service.name === 'PRIMERA_CONSULTA'
                                                        ? 'Primera consulta'
                                                        : service.name
                                            }}
                                        </option>

                                    </select>
                                </div>
                                <li class="font-poppins text-base  w-[90%]  m-auto my-3">Escoge la sucursal donde
                                    quieres
                                    ser
                                    atendido</li>
                                <div class="relative w-[90%] m-auto   ">
                                    <!-- Ícono -->

                                    <!-- Ícono -->
                                    <img src="@/assets/images/iconconsultorio.webp"
                                        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-1"
                                        alt="Icono">

                                    <!-- Select -->
                                    <select v-model="localselect" id="specialist"
                                        class="border p-2 pl-12 w-full rounded-xl flex appearance-none border-gray-400 ">
                                        <option v-for="(data, index) in data?.offices" :key="index" :value="data">
                                            {{ data.title + "\n" + data.description }}
                                        </option>
                                    </select>

                                </div>

                                <li class="font-poppins text-base  w-[90%]  m-auto my-3">Selecciona si tienes algún
                                    convenio
                                    o prepagada</li>

                                <div class="relative w-[90%] m-auto  mb-3">
                                    <!-- Ícono -->



                                    <img src="@/assets/images/icopnprepagada.webp"
                                        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-1"
                                        alt="Icono">
                                    <!-- Select -->
                                    <select v-model="prepagada" id="specialist"
                                        class="border p-2   pl-12 w-full rounded-xl flex appearance-none   border-gray-400">
                                        <option disabled value="">Escoge el servicio</option>
                                        <option v-for="(prepagada, index) in data?.prepagadas" :key="index"
                                            :value="prepagada">
                                            {{

                                                prepagada.name
                                            }}
                                        </option>

                                    </select>
                                </div>
                                <div v-if="data?.type_of_payment"
                                    class="  flex   w-[90%] m-auto font-bold mb-3 justify-between">
                                    <div class="flex">



                                        <h1 class="mr-2">Tipo de pago:</h1>
                                        <h2 v-if="prepagada?.type === 'SITE'" class="text-gray-700">Pago en
                                            consultorio</h2>
                                        <h2 v-if="prepagada?.type === 'ANTICIPATED'" class="text-gray-700">Pago
                                            anticipado
                                        </h2>
                                    </div>

                                    <h1 v-if="service != null">${{ formatPrice(service?.price) }}</h1>
                                </div>
                            </ol>











                            <h1 v-if="selectpay !== 'Particular' && selectpay !== 'Otros'" class="w-[90%] m-auto mb-3">

                                En caso de aplicación con alguna medicina prepagada, el costo del bono se cancela en
                                el
                                momento de la cita
                            </h1>
                            <div class="w-[90%] m-auto">
                                <h1 class="  mb-3  font-bold     "> {{ monthName
                                    }}-{{ currentYear }}</h1>
                            </div>
                            <div class="relative  w-[90%] m-auto  "
                                v-if="listDates.length && currentDay != null && currentMonth != null && currentYear != null && iduser != null">


                                <div class="    w-full flex   justify-between  ">
                                    <!-- Flecha izquierda -->
                                    <button @click="getListDatesBackwards" class="  w-12 h-12 mt-2 flex items-center justify-center  text-gray-600 hover:text-gray-900 cursor-pointer 
                        transition-opacity duration-300" :class="isToday(listDates[0].day, listDates[0].month, listDates[0].year, currentDay, currentMonth, currentYear)
                            ? 'opacity-0 invisible'
                            : 'opacity-100 visible'">
                                        <img src="@/assets/svg/arrow.svg" alt="Icono"
                                            class="w-4 h-4 transition-transform   rotate-180">
                                    </button>

                                    <!-- Flecha derecha -->
                                    <button
                                        class="w-12 h-12 mt-2 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer"
                                        @click="nextdate">
                                        <img src="@/assets/svg/arrow.svg" alt="Icono"
                                            class="w-4 h-4 transition-transform  ">
                                    </button>
                                </div>
                                <!-- Grid de 3 columnas -->

                                <div class="w-full flex justify-between ">

                                    <div class="w-[30%]  text-black py-4 rounded-lg text-center">
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
                                        <div v-if="shedules_days[listDates[0].nameday] && shedules_days[listDates[0].nameday].length"
                                            v-for="(data, index) in (!panels.schedules ? shedules_days[listDates[0].nameday].slice(0, 3) : shedules_days[listDates[0].nameday])"
                                            :key="index"
                                            @click="data.active && !data.reserver && selectdateHour(listDates[0], data.openTime, data.closeTime, data.id)"
                                            :class="[
                                                'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                                                data.reserver === false && data.active === true ? 'border' : '',

                                                selected_date_and_hour &&
                                                    listDates[0] === selected_date_and_hour.date &&
                                                    data.openTime === selected_date_and_hour.openTime &&
                                                    data.closeTime === selected_date_and_hour.closeTime
                                                    ? 'bg-[var(--blue-1)] text-white border-none'
                                                    : ''
                                            ]">
                                            <h1 v-if="data.active === true">
                                                <span :class="[
                                                    data.reserver === true ? 'line-through text-gray-400' : ''
                                                ]">
                                                    {{ data.openTime }}
                                                </span>
                                            </h1>
                                            <h1 v-else>---</h1>
                                        </div>

                                    </div>

                                    <div class="w-[30%]  text-black py-4 rounded-lg text-center">
                                        <h1 class="  pb-2 font-semibold"
                                            :class="{ 'text-[var(--blue-1)]': listDates[1].isValid, 'text-[var(--blue-1)]/50': !listDates[1].isValid }">
                                            {{
                                                getDayNameSpanish(listDates[1].nameday) }}
                                        </h1>
                                        <h1 class="mb-5" :class="{
                                            'text-black': listDates[1].isValid,
                                            'text-black/50': !listDates[1].isValid
                                        }">{{ listDates[1].day }}</h1>

                                        <div v-if="listDates[1] && shedules_days[listDates[1].nameday] && shedules_days[listDates[1].nameday].length"
                                            v-for="(data, index) in (!panels.schedules ? shedules_days[listDates[1].nameday].slice(0, 3) : shedules_days[listDates[1].nameday])"
                                            :key="index"
                                            @click="data.active && !data.reserver && selectdateHour(listDates[1], data.openTime, data.closeTime, data.id)"
                                            :class="[
                                                'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                                                data.reserver === false && data.active === true ? 'border' : '',

                                                selected_date_and_hour &&
                                                    listDates[1] === selected_date_and_hour.date &&
                                                    data.openTime === selected_date_and_hour.openTime &&
                                                    data.closeTime === selected_date_and_hour.closeTime
                                                    ? 'bg-[var(--blue-1)] text-white border-none'
                                                    : ''
                                            ]">
                                            <h1 v-if="data.active === true">
                                                <span :class="[
                                                    data.reserver === true ? 'line-through text-gray-400' : ''
                                                ]">
                                                    {{ data.openTime }}
                                                </span>
                                            </h1>
                                            <h1 v-else>---</h1>
                                        </div>

                                    </div>
                                    <div class=" w-[30%] text-black py-4 rounded-lg text-center">
                                        <h1 class="  pb-2 font-semibold"
                                            :class="{ 'text-[var(--blue-1)]': listDates[2].isValid, 'text-[var(--blue-1)]/50': !listDates[2].isValid }">
                                            {{
                                                getDayNameSpanish(listDates[2].nameday) }}
                                        </h1>
                                        <h1 class="mb-5"
                                            :class="{ 'text-black': listDates[2].isValid, 'text-black/50': !listDates[2].isValid }">
                                            {{ listDates[2].day }}</h1>
                                        <!--  -->
                                        <div v-if="listDates[2] && shedules_days[listDates[2].nameday] && shedules_days[listDates[2].nameday].length"
                                            v-for="(data, index) in (!panels.schedules ? shedules_days[listDates[2].nameday].slice(0, 3) : shedules_days[listDates[2].nameday])"
                                            :key="index"
                                            @click="data.active && !data.reserver && selectdateHour(listDates[2], data.openTime, data.closeTime, data.id)"
                                            :class="[
                                                'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                                                data.reserver === false && data.active === true ? 'border' : '',

                                                selected_date_and_hour &&
                                                    listDates[2] === selected_date_and_hour.date &&
                                                    data.openTime === selected_date_and_hour.openTime &&
                                                    data.closeTime === selected_date_and_hour.closeTime
                                                    ? 'bg-[var(--blue-1)] text-white border-none'
                                                    : ''
                                            ]">
                                            <h1 v-if="data.active === true">
                                                <span :class="[
                                                    data.reserver === true ? 'line-through text-gray-400' : ''
                                                ]">
                                                    {{ data.openTime }}
                                                </span>
                                            </h1>
                                            <h1 v-else>---</h1>
                                        </div>

                                    </div>
                                </div>


                            </div>
                            <h1 class="text-center font-bold text-[var(--blue-1)] cursor-pointer"
                                v-if="!panels.schedules" @click="setPanel('schedules')">ver más horarios</h1>
                            <h1 class="text-center font-bold text-[var(--blue-1)] cursor-pointer" v-else
                                @click="setPanel('schedules')">ver menos</h1>
                            <div class="w-full">
                                <div v-if="iduser != null"
                                    class="flex gap-2 items-center bg-[var(--blue-1)] py-2 px-8 mb-10  w-fit text-white rounded-xl shadow cursor-pointer m-auto my-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                        width="24px" fill="#ffffff">
                                        <path
                                            d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                                    </svg>
                                    <h1 class="font-bold" @click="functionPayment">Agendar cita</h1>
                                </div>
                            </div>
                            <div class="full mb-10">
                                <h1 class="w-full text-center">* Si no encuentra una cita disponible para la fecha y
                                    hora
                                    que necesitas escribenos al correo:</h1>
                                <h1 class="w-full text-center">hola@docvisual.co y te ingresaremos a una lista de
                                    espera.
                                </h1>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>




        <!-- --------------------- -->

        <div class="w-[90%] md:container  m-auto">
            <div
                class="w-full border border-gray-300 my-8 rounded-4xl sm:flex justify-center items-center bg-white relative">
                <div class="pt-2 pl-2 sm:pt-0 sm:pl-0 sm:absolute sm:top-6 sm:left-6" v-if="iduser != null">
                    <svg class="w-10 h-auto cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="none"
                        xmlns="http://www.w3.org/2000/svg"
                        :class="!detail_favorite ? '  stroke-gray-500 ' : ' fill-[var(--blue-1)]'" @click="toggleHeart">
                        <path
                            d="M7 3C4.23858 3 2 5.21619 2 7.95C2 10.157 2.87466 15.3947 11.4875 20.6903C11.7994 20.8821 12.2006 20.8821 12.5125 20.6903C21.1253 15.3947 22 10.157 22 7.95C22 5.21619 19.7614 3 17 3C14.2386 3 12 6 12 6C12 6 9.76142 3 7 3Z"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </div>



                <!-- icons solcial  -->
                <div class="absolute top-2 right-2 gap-3  p-2   ">
                    <ul class="flex  gap-1 mt-1 space-x-1.5">
                        <li v-if="data?.facebook">
                            <a style="color: var(--blue-1);" class="group cursor-pointer"
                                :href="urlFormat(data?.facebook)" target="_blank" rel="noopener noreferrer">
                                <div
                                    class="  w-5 h-5 md:w-8 md:h-8 bg-[var(--grayicon-1)] rounded-full flex items-center justify-center  hover:bg-[var(--blue-1)] transition shadow-lg">
                                    <svg class=" w-3 h-3 md:w-5 md:h-5" fill="#ffffff" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        width="800px" height="800px" viewBox="0 0 512 512" xml:space="preserve">

                                        <g id="7935ec95c421cee6d86eb22ecd11b7e3">

                                            <path style="display: inline;" d="M283.122,122.174c0,5.24,0,22.319,0,46.583h83.424l-9.045,74.367h-74.379
		c0,114.688,0,268.375,0,268.375h-98.726c0,0,0-151.653,0-268.375h-51.443v-74.367h51.443c0-29.492,0-50.463,0-56.302
		c0-27.82-2.096-41.02,9.725-62.578C205.948,28.32,239.308-0.174,297.007,0.512c57.713,0.711,82.04,6.263,82.04,6.263
		l-12.501,79.257c0,0-36.853-9.731-54.942-6.263C293.539,83.238,283.122,94.366,283.122,122.174z">

                                            </path>

                                        </g>

                                    </svg>
                                </div>
                            </a>
                        </li>
                        <li v-if="data?.instagram">
                            <a style="color: var(--blue-1);" class="group cursor-pointer"
                                :href="urlFormat(data?.instagram)" target="_blank" rel="noopener noreferrer">
                                <div
                                    class="w-5 h-5 md:w-8 md:h-8 bg-[var(--grayicon-1)] rounded-full flex items-center justify-center  hover:bg-[var(--blue-1)] transition shadow-lg ">
                                    <svg class="  w-3 h-3 md:w-5 md:h-5" fill="#ffffff" viewBox="0 0 24 24"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                            </a>
                        </li>
                        <li v-if="data?.linkedin">


                            <a style="color: var(--blue-1);" class="group cursor-pointer"
                                :href="urlFormat(data?.linkedin)" target="_blank" rel="noopener noreferrer">
                                <div
                                    class="w-5 h-5 md:w-8 md:h-8 bg-[var(--grayicon-1)] rounded-full flex items-center justify-center  hover:bg-[var(--blue-1)] shadow-lg transition">
                                    <svg class="w-3 h-3 md:w-5 md:h-5" fill="#ffffff" width="800px" height="800px"
                                        viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <title>linkedin</title>
                                        <path
                                            d="M28.778 1.004h-25.56c-0.008-0-0.017-0-0.027-0-1.199 0-2.172 0.964-2.186 2.159v25.672c0.014 1.196 0.987 2.161 2.186 2.161 0.010 0 0.019-0 0.029-0h25.555c0.008 0 0.018 0 0.028 0 1.2 0 2.175-0.963 2.194-2.159l0-0.002v-25.67c-0.019-1.197-0.994-2.161-2.195-2.161-0.010 0-0.019 0-0.029 0h0.001zM9.9 26.562h-4.454v-14.311h4.454zM7.674 10.293c-1.425 0-2.579-1.155-2.579-2.579s1.155-2.579 2.579-2.579c1.424 0 2.579 1.154 2.579 2.578v0c0 0.001 0 0.002 0 0.004 0 1.423-1.154 2.577-2.577 2.577-0.001 0-0.002 0-0.003 0h0zM26.556 26.562h-4.441v-6.959c0-1.66-0.034-3.795-2.314-3.795-2.316 0-2.669 1.806-2.669 3.673v7.082h-4.441v-14.311h4.266v1.951h0.058c0.828-1.395 2.326-2.315 4.039-2.315 0.061 0 0.121 0.001 0.181 0.003l-0.009-0c4.5 0 5.332 2.962 5.332 6.817v7.855z">
                                        </path>
                                    </svg>
                                </div>
                            </a>

                        </li>
                        <li v-if="data?.youtube">

                            <a style="color: var(--blue-1);" class="group cursor-pointer"
                                :href="urlFormat(data?.youtube)" target="_blank" rel="noopener noreferrer">
                                <div
                                    class="w-5 h-5 md:w-8 md:h-8 bg-[var(--grayicon-1)] rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--blue-1)] transition">
                                    <svg class="w-3 h-3 md:w-5 md:h-5" fill="#ffffff" viewBox="0 0 24 24"
                                        aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M10 15.5l6-3.5-6-3.5v7zM22 12s0 4.08-.69 6.02a3.27 3.27 0 01-2.31 2.31C17.08 21 12 21 12 21s-5.08 0-6.98-.67a3.27 3.27 0 01-2.31-2.31C2 16.08 2 12 2 12s0-4.08.69-6.02a3.27 3.27 0 012.31-2.31C6.92 3 12 3 12 3s5.08 0 6.98.67a3.27 3.27 0 012.31 2.31C22 7.92 22 12 22 12z"
                                            clip-rule="evenodd">
                                        </path>
                                    </svg>
                                </div>
                            </a>



                        </li>


                    </ul>
                </div>

                <div class="flex w-fit gap-6 items-center px-8 md:px-0 my-7  ">
                    <div
                        class="w-[90px] h-[90px] border border-white shadow-[2px_0px_0px_3px_var(--blue-1)] md:w-[150px] md:h-[150px] rounded-full overflow-hidden">
                        <img :src="data?.perfilPhoto" alt="Avatar" class="w-full h-full object-cover"
                            v-if="data?.perfilPhoto">
                        <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1742425056/fidungtrcbetkco1tqqz.png"
                            alt="Avatar" class="w-full h-full object-cover" v-else>
                    </div>


                    <div class="w-fit ">
                        <p class="mt-4 text-[14px] md:text-3xl font-semibold  font-poppins ">{{ data?.name }}</p>
                        <p v-if="data?.specialists && data.specialists[0]?.name"
                            class="text-base font-normal font-poppins ">
                            {{ data.specialists[0].name }}
                        </p>
                        <div class=" md:flex mt-4 font-poppins text-sm md:text-base">
                            <p>{{ `Experiencia: ` }}<span class="font-bold"> {{ data?.experience }} años </span>
                            </p>
                            <div class="flex ml-1">
                                <p> Satisfacción</p>



                                <svg class="ml-1 h-5 w-5 text-amber-200" viewBox="0 0 32 32" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">

                                    <title>start-favorite</title>
                                    <desc>Created with Sketch Beta.</desc>
                                    <defs>

                                    </defs>
                                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
                                        sketch:type="MSPage">
                                        <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                            transform="translate(-154.000000, -881.000000)" fill="#000000">
                                            <path fill="#e89f20"
                                                d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                id="start-favorite" sketch:type="MSShapeGroup">

                                            </path>
                                        </g>
                                    </g>
                                </svg>
                                <p class="font-bold">{{ specialist?.point }}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <!-- sobre mi -->
            <div class="w-full lg:flex">
                <div class="w-[100%]   lg:w-1/2   ">
                    <div
                        class="w-full rounded-2xl border mb-3 border-gray-300 bg-white font-poppins text-sm md:text-base">
                        <div class="w-full p-8 ">
                            <h1 class="font-bold">Sobre mí</h1>
                            <p class="text-sm mt-3">
                                {{ data?.description }}
                            </p>

                        </div>
                    </div>

                    <div class="text-xs md:text-base w-full rounded-2xl border mt-3 mb-3 border-gray-300 bg-white">
                        <div class="w-full p-8 font-poppins text-base">
                            <h1 class="font-bold">Campos de acción</h1>
                            <ul class="list-disc pl-5 mt-5">
                                <li v-for="(item, index) in data?.actions" :key="index" class="text-xs md:text-base">
                                    {{ item }}
                                </li>
                            </ul>

                        </div>
                    </div>
                    <!-- <div class="w-full rounded-2xl border border-gray-300 bg-white font-poppins text-sm md:text-base">
                        <div class="w-full p-8 ">
                            <h1 class="font-bold">Recomendaciones para los pacientes</h1>
                            <p class="text-sm mt-3">
                                  //dato back    

                            </p>

                        </div>
                    </div> -->
                    <div v-if="data?.web"
                        class="text-xs md:text-base w-full rounded-2xl border mt-3 border-gray-300 bg-white">
                        <div class="w-full p-8 font-poppins ">
                            <h1 class="font-bold">Página web</h1>

                            <a class="mt-4 text-sm" :href="urlFormat(data?.web ?? '')" target="_blank">
                                {{ urlFormat(data?.web) }}
                            </a>

                        </div>
                    </div>
                    <div class="ext-xs md:text-base w-full rounded-2xl border mt-3 border-gray-300 bg-white">
                        <div class="w-full p-8 font-poppins  ">
                            <h1 class="font-bold ">Consultorio</h1>
                            <p>{{ localselect?.title }}</p>
                            <p class="mt-4 text-sm mb-3">
                                {{ localselect?.description }}
                            </p>
                            <MapLeafet v-if="localselect != null" :description="localselect?.description"
                                :latitude="localselect?.latitude" :longitude="localselect.longitude"
                                :title="localselect.title" class="w-[500px]" />
                        </div>
                    </div>


                    <div class="w-full rounded-2xl border mt-3 border-gray-300 bg-white">
                        <div class="w-full p-8 font-poppins text-base">
                            <div v-for="(group, index) in photos" :key="index" class="group   m-2 flex">
                                <!-- Primera imagen (izquierda) -->
                                <div class="w-1/2">
                                    <img :src="group[0].url" alt="Imagen principal"
                                        class="w-full h-full object-cover rounded-2xl  pb-1">
                                </div>

                                <!-- Las otras dos imágenes (derecha) -->
                                <div class="w-1/2 flex flex-col px-1.5">
                                    <img v-for="(image, i) in group.slice(1)" :key="i" :src="image.url"
                                        alt="Imagen secundaria" class="w-full h-1/2 object-cover rounded-2xl mb-1">
                                </div>
                            </div>



                        </div>
                    </div>


                    <div class="text-xs md:text-base w-full rounded-2xl border mt-3 border-gray-300 bg-white">
                        <div class="w-full p-8 font-poppins  ">
                            <h1 class="font-bold mb-6">Servicios </h1>
                            <div v-for="(service, index) in data?.services" :key="index"
                                v-if="service && service.price > 0" class="font-poppins font-mono">
                                <p v-if="service.name === 'CONSULTA'">Consulta</p>
                                <p v-else-if="service.name === 'PRIMERA_CONSULTA'">Primera consulta</p>
                                <p v-else>{{ service.name }}</p>

                                <p class="mb-2 mt-2">
                                    ${{ formatPrice(service.price) }}
                                </p>

                                <hr class="text-gray-300" />
                            </div>


                        </div>
                    </div>


                    <div class="w-full  rounded-2xl  border mt-3 border-gray-300 bg-white">
                        <div class="w-full p-8 font-poppins text-xs md:text-base">
                            <div class="flex flex-wrap justify-between ">
                                <h1 class="font-bold mb-6 ">Calificaciones</h1>
                                <!-- <button class="text-white font-bold rounded-2xl  px-1 md:px-2 text-xs md:text-base"
                                    style="background-color: var(--blue-1); ">Añadir tu opinión</button> -->
                            </div>
                            <hr class="text-gray-300 my-4 " />
                            <div class="sm:flex justify-between gap-2 items-center">
                                <div class="font-poppins text-sm font-mono   m-auto ">
                                    <p class="text-center"><span class=" text-[var(--blue-1)] ">{{
                                        specialist?.opinions.length
                                            }}</span> opiniones</p>
                                    <p class="text-2xl md:text-6xl text-center">
                                        {{ (get_calification?.total ?? 0).toFixed(1) }}
                                    </p>
                                    <div class="flex    w-fit m-auto mb-10 sm:mb-0">
                                        <svg v-for="n in 5" class="ml-1 w-3 h-3 md:h-5 md:w-5" :class="{
                                            'text-amber-400': n <= Math.round(get_calification?.total ?? 0),
                                            'text-gray-300': n > Math.round(get_calification?.total ?? 0)
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>
                                    </div>


                                </div>
                                <div class="  justify-center items-center ps-">

                                    <div class="flex flex-wrap mb-3 ">
                                        <svg v-for="n in 5" class="ml-1 w-3 h-3 md:h-5 md:w-5" :class="{
                                            'text-amber-400': n <= (get_calification?.avg_score_recommends ?? 0),
                                            'text-gray-300': n > (get_calification?.avg_score_recommends ?? 0)
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>
                                        <h1 class="ms-5 flex-1 break-words">¿Recomendarías a esta doctora?</h1>
                                    </div>

                                    <div class="flex flex-wrap mb-3">
                                        <svg v-for="n in 5" class="ml-1 w-3 h-3 md:h-5 md:w-5" :class="{
                                            'text-amber-400': n <= (get_calification?.avg_score_service_specialist ?? 0),
                                            'text-gray-300': n > (get_calification?.avg_score_service_specialist ?? 0)
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>
                                        <h1 class="ms-5">Trato del doctor</h1>
                                    </div>
                                    <div class="flex flex-wrap mb-3">
                                        <svg v-for="n in 5" class="ml-1 w-3 h-3 md:h-5 md:w-5" :class="{
                                            'text-amber-400': n <= (get_calification?.avg_score_personal_attention ?? 0),
                                            'text-gray-300': n > (get_calification?.avg_score_personal_attention ?? 0)
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>
                                        <h1 class="ms-5 flex-1 break-words">Trato del personal en consulta</h1>
                                    </div>
                                    <div class="flex flex-wrap mb-3">
                                        <svg v-for="n in 5" class="ml-1 w-3 h-3 md:h-5 md:w-5" :class="{
                                            'text-amber-400': n <= (get_calification?.avg_score_time_service ?? 0),
                                            'text-gray-300': n > (get_calification?.avg_score_time_service ?? 0)
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>
                                        <h1 class="ms-5">Espera en consulta</h1>
                                    </div>
                                    <div class="flex flex-wrap mb-3">
                                        <svg v-for="n in 5" class="ml-1 w-3 h-3 md:h-5 md:w-5" :class="{
                                            'text-amber-400': n <= (get_calification?.avg_score_site ?? 0),
                                            'text-gray-300': n > (get_calification?.avg_score_site ?? 0)
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>
                                        <h1 class="ms-5 flex-1 break-words">Estado de las instalaciones</h1>
                                    </div>
                                    <div class="flex flex-wrap mb-3">
                                        <svg v-for="n in 5" class="ml-1 w-3 h-3 md:h-5 md:w-5" :class="{
                                            'text-amber-400': n <= (get_calification?.avg_score_ubication_and_comfort ?? 0),
                                            'text-gray-300': n > (get_calification?.avg_score_ubication_and_comfort ?? 0)
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>
                                        <h1 class="ms-5 flex-1 break-words">Comodidad</h1>
                                    </div>
                                    <div class="flex flex-wrap mb-3">
                                        <svg v-for="n in 5" class="ml-1 w-3 h-3 md:h-5 md:w-5" :class="{
                                            'text-amber-400': n <= (get_calification?.avg_score_time_waiting ?? 0),
                                            'text-gray-300': n > (get_calification?.avg_score_time_waiting ?? 0)
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>
                                        <h1 class="ms-5 flex-1 break-words">Tiempo de espera en sala</h1>
                                    </div>
                                    <div class="flex flex-wrap mb-3">
                                        <svg v-for="n in 5" class="ml-1 w-3 h-3 md:h-5 md:w-5" :class="{
                                            'text-amber-400': n <= (get_calification?.avg_score_recommendations_specialist ?? 0),
                                            'text-gray-300': n > (get_calification?.avg_score_recommendations_specialist ?? 0)
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>
                                        <h1 class="ms-5 flex-1 break-words">Recomendaciones ofrecidas por el
                                            especialista</h1>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <hr class="text-gray-300 my-3" />
                                <!-- first data opinions -->
                                <div class="font-poppins">
                                    <!-- <h1 class="font-bold">{{ get_calification?.comments.count ? getname(
                                        specialist.opinions[0].user)
                                        : 'Usuario desconocido' }}</h1> -->

                                    <div class="flex" v-if="get_calification?.comments.data[0]">
                                        <svg v-for="n in 5"
                                            v-if="get_calification?.comments.data[0] && get_calification?.comments.data[0]"
                                            class="ml-1 h-3 w-3 text-amber-200" :class="{
                                                'text-amber-400': n <= get_calification?.comments.data[0].score,
                                                'text-gray-300': n >get_calification?.comments.data[0].score
                                            }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>



                                    </div>
                                    <p v-if="get_calification?.comments.data[0]">Comentario: {{
                                        get_calification?.comments.data[0].coment ?? '' }}</p>
                                    <hr class="text-gray-300" v-if="panels.opinionsData" />

                                </div>


                                <div v-for="(data, index) in get_calification?.comments.data" :key="index + 1"
                                    class="font-poppins" v-if="panels.opinionsData">
                                    <!-- <h1 class="font-bold">{{ getname(data.user) }} </h1> -->
                                    <div class="flex">
                                        <svg v-for="n in 5" class="ml-1 h-3 w-3 text-amber-200" :class="{
                                            'text-amber-400': n <= data.score,
                                            'text-gray-300': n > data.score
                                        }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink"
                                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
                                                fill-rule="evenodd" sketch:type="MSPage">
                                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                                    transform="translate(-154.000000, -881.000000)" fill="currentColor">
                                                    <path
                                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                                                        id="start-favorite" sketch:type="MSShapeGroup" />
                                                </g>
                                            </g>
                                        </svg>


                                    </div>
                                    <!-- <p>Localización: {{ data.lugar }}</p> -->
                                    <p>Comentario: {{ data.coment }}</p>
                                    <hr class="text-gray-300" />
                                </div>

                                <button @click="setPanel('opinionsData')" v-if="!panels.opinionsData"
                                    class="w-full border border-[var(--blue-1)] font-poppins font-semibold py-2 rounded-2xl text-[var(--blue-1)] mt-4 ">
                                    Ver más opiniones
                                </button>
                                <button @click="setPanel('opinionsData')" v-else
                                    class="w-full border border-[var(--blue-1)] font-poppins font-semibold py-2 rounded-2xl text-[var(--blue-1)] mt-4 ">
                                    Ver menos
                                </button>


                            </div>
                        </div>
                    </div>




                </div>
                <!-- derecho -->
                <div class="hidden lg:block w-[50%]">
                    <div
                        class="w-[95%]  ml-auto   min-h-[60vh] border border-gray-300 bg-white rounded-2xl  font-poppins text-sm sticky top-5">
                        <h1 class="font-poppins font-bold  w-[90%] m-auto my-3">{{ `Agendar tu cita con ${data?.name}`
                            }}</h1>

                        <ol class="  mx-auto list-decimal list-inside">
                            <li class="font-poppins text-base  w-[90%]  m-auto my-3">Escoge el servicio</li>

                            <div class="relative w-[90%] m-auto  ">
                                <!-- Ícono -->
                                <img src="@/assets/images/iconconsulta.webp"
                                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-1 " alt="Icono">


                                <!-- Select -->
                                <select v-model="service" id="specialist"
                                    class="border p-2   pl-12 w-full rounded-xl flex appearance-none   border-gray-400">
                                    <option disabled value="">Escoge el servicio</option>
                                    <option v-for="(service, index) in data?.services?.filter(s => s.price > 0)"
                                        :key="index" :value="service">
                                        {{
                                            service.name === 'CONSULTA'
                                                ? 'Consulta seguimiento'
                                                : service.name === 'PRIMERA_CONSULTA'
                                                    ? 'Primera consulta'
                                                    : service.name
                                        }}
                                    </option>

                                </select>
                            </div>
                            <li class="font-poppins text-base  w-[90%]  m-auto my-3">Escoge la sucursal donde quieres
                                ser
                                atendido</li>
                            <div class="relative w-[90%] m-auto   ">
                                <!-- Ícono -->

                                <!-- Ícono -->
                                <img src="@/assets/images/iconconsultorio.webp"
                                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-1" alt="Icono">

                                <!-- Select -->
                                <select v-model="localselect" id="specialist"
                                    class="border p-2 pl-12 w-full rounded-xl flex appearance-none border-gray-400 ">
                                    <option v-for="(data, index) in data?.offices" :key="index" :value="data">
                                        {{ data.title + "\n" + data.description }}
                                    </option>
                                </select>

                            </div>

                            <li class="font-poppins text-base  w-[90%]  m-auto my-3">Selecciona si tienes algún convenio
                                o prepagada</li>

                            <div class="relative w-[90%] m-auto  mb-3">
                                <!-- Ícono -->



                                <img src="@/assets/images/icopnprepagada.webp"
                                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-1" alt="Icono">
                                <!-- Select -->
                                <select v-model="prepagada" id="specialist"
                                    class="border p-2   pl-12 w-full rounded-xl flex appearance-none   border-gray-400">
                                    <option disabled value="">Escoge el servicio</option>
                                    <option v-for="(prepagada, index) in data?.prepagadas" :key="index"
                                        :value="prepagada">
                                        {{

                                            prepagada.name
                                        }}
                                    </option>

                                </select>
                            </div>
                            <div v-if="data?.type_of_payment"
                                class="  flex   w-[90%] m-auto font-bold mb-3 justify-between">
                                <div class="flex">



                                    <h1 class="mr-2">Tipo de pago:</h1>
                                    <h2 v-if="prepagada?.type === 'SITE'" class="text-gray-700">Pago en
                                        consultorio</h2>
                                    <h2 v-if="prepagada?.type === 'ANTICIPATED'" class="text-gray-700">Pago anticipado
                                    </h2>
                                </div>

                                <h1 v-if="service != null">${{ formatPrice(service?.price) }}</h1>
                            </div>
                        </ol>
                        <h1 v-if="selectpay !== 'Particular' && selectpay !== 'Otros'"
                            class="w-[90%] m-auto mb-3 text-[var(--blue-1)]">

                            En caso de aplicación con alguna medicina prepagada, el costo del bono se cancela en el
                            momento de la cita .
                        </h1>
                        <div class="w-[90%] m-auto">
                            <h1 class="  mb-3  font-bold     "> {{ monthName
                            }}-{{ currentYear }}</h1>
                        </div>
                        <div class="relative  w-[90%] m-auto  "
                            v-if="listDates.length && currentDay != null && currentMonth != null && currentYear != null && iduser != null">


                            <div class="absolute top-0 left-0 w-full flex   justify-between  ">
                                <!-- Flecha izquierda -->
                                <button @click="getListDatesBackwards" class="  w-12 h-12 mt-2 flex items-center justify-center  text-gray-600 hover:text-gray-900 cursor-pointer 
                        transition-opacity duration-300" :class="isToday(listDates[0].day, listDates[0].month, listDates[0].year, currentDay, currentMonth, currentYear)
                            ? 'opacity-0 invisible'
                            : 'opacity-100 visible'">
                                    <img src="@/assets/svg/arrow.svg" alt="Icono"
                                        class="w-4 h-4 transition-transform   rotate-180">
                                </button>

                                <!-- Flecha derecha -->
                                <button
                                    class="w-12 h-12 mt-2 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer"
                                    @click="nextdate">
                                    <img src="@/assets/svg/arrow.svg" alt="Icono"
                                        class="w-4 h-4 transition-transform  ">
                                </button>
                            </div>
                            <!-- Grid de 3 columnas -->

                            <div class="w-full flex justify-between ">

                                <div class="w-[30%]  text-black py-4 rounded-lg text-center">
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
                                    <div v-if="shedules_days[listDates[0].nameday] && shedules_days[listDates[0].nameday].length"
                                        v-for="(data, index) in (!panels.schedules ? shedules_days[listDates[0].nameday].slice(0, 3) : shedules_days[listDates[0].nameday])"
                                        :key="index"
                                        @click="data.active && !data.reserver && selectdateHour(listDates[0], data.openTime, data.closeTime, data.id)"
                                        :class="[
                                            'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                                            data.active === true ? 'border' : '',
                                            data.reserver === true ? '   border-none' : '',
                                            data.reserver === false ? '' : '',
                                            selected_date_and_hour &&
                                                listDates[0] === selected_date_and_hour.date &&
                                                data.openTime === selected_date_and_hour.openTime &&
                                                data.closeTime === selected_date_and_hour.closeTime
                                                ? 'bg-[var(--blue-1)] text-white border-none'
                                                : ''
                                        ]">
                                        <h1 v-if="data.active === true">
                                            <span :class="[
                                                data.reserver === true ? 'line-through ' : ''
                                            ]">
                                                {{ data.openTime }}
                                            </span>
                                        </h1>
                                        <h1 v-else>---</h1>
                                    </div>

                                </div>

                                <div class="w-[30%]  text-black py-4 rounded-lg text-center">
                                    <h1 class="  pb-2 font-semibold"
                                        :class="{ 'text-[var(--blue-1)]': listDates[1].isValid, 'text-[var(--blue-1)]/50': !listDates[1].isValid }">
                                        {{
                                            getDayNameSpanish(listDates[1].nameday) }}
                                    </h1>
                                    <h1 class="mb-5" :class="{
                                        'text-black': listDates[1].isValid,
                                        'text-black/50': !listDates[1].isValid
                                    }">{{ listDates[1].day }}</h1>

                                    <div v-if="listDates[1] && shedules_days[listDates[1].nameday] && shedules_days[listDates[1].nameday].length"
                                        v-for="(data, index) in (!panels.schedules ? shedules_days[listDates[1].nameday].slice(0, 3) : shedules_days[listDates[1].nameday])"
                                        :key="index"
                                        @click="data.active && !data.reserver && selectdateHour(listDates[1], data.openTime, data.closeTime, data.id)"
                                        :class="[
                                            'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                                            data.reserver === false && data.active === true ? 'border' : '',

                                            selected_date_and_hour &&
                                                listDates[1] === selected_date_and_hour.date &&
                                                data.openTime === selected_date_and_hour.openTime &&
                                                data.closeTime === selected_date_and_hour.closeTime
                                                ? 'bg-[var(--blue-1)] text-white border-none'
                                                : ''
                                        ]">
                                        <h1 v-if="data.active === true">
                                            <span :class="[
                                                data.reserver === true ? 'line-through text-gray-400' : ''
                                            ]">
                                                {{ data.openTime }}
                                            </span>
                                        </h1>
                                        <h1 v-else>---</h1>
                                    </div>

                                </div>
                                <div class=" w-[30%] text-black py-4 rounded-lg text-center">
                                    <h1 class="  pb-2 font-semibold"
                                        :class="{ 'text-[var(--blue-1)]': listDates[2].isValid, 'text-[var(--blue-1)]/50': !listDates[2].isValid }">
                                        {{
                                            getDayNameSpanish(listDates[2].nameday) }}
                                    </h1>
                                    <h1 class="mb-5"
                                        :class="{ 'text-black': listDates[2].isValid, 'text-black/50': !listDates[2].isValid }">
                                        {{ listDates[2].day }}</h1>
                                    <!--  -->
                                    <div v-if="listDates[2] && shedules_days[listDates[2].nameday] && shedules_days[listDates[2].nameday].length"
                                        v-for="(data, index) in (!panels.schedules ? shedules_days[listDates[2].nameday].slice(0, 3) : shedules_days[listDates[2].nameday])"
                                        :key="index"
                                        @click="data.active && !data.reserver && selectdateHour(listDates[2], data.openTime, data.closeTime, data.id)"
                                        :class="[
                                            'rounded-xl px-2 py-4 mb-2 cursor-pointer',
                                            data.reserver === false && data.active === true ? 'border' : '',

                                            selected_date_and_hour &&
                                                listDates[2] === selected_date_and_hour.date &&
                                                data.openTime === selected_date_and_hour.openTime &&
                                                data.closeTime === selected_date_and_hour.closeTime
                                                ? 'bg-[var(--blue-1)] text-white border-none'
                                                : ''
                                        ]">
                                        <h1 v-if="data.active === true">
                                            <span :class="[
                                                data.reserver === true ? 'line-through text-gray-400' : ''
                                            ]">
                                                {{ data.openTime }}
                                            </span>
                                        </h1>
                                        <h1 v-else>---</h1>
                                    </div>

                                </div>
                            </div>


                        </div>
                        <h1 class="text-center font-bold text-[var(--blue-1)] cursor-pointer" v-if="!panels.schedules"
                            @click="setPanel('schedules')">ver más horarios</h1>
                        <h1 class="text-center font-bold text-[var(--blue-1)] cursor-pointer" v-else
                            @click="setPanel('schedules')">ver menos</h1>
                        <div class="w-full">
                            <div v-if="iduser != null"
                                class="flex gap-2 items-center bg-[var(--blue-1)] py-2 px-8 mb-10  w-fit text-white rounded-xl shadow cursor-pointer m-auto my-8">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#ffffff">
                                    <path
                                        d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                                </svg>
                                <h1 class="font-bold" @click="functionPayment">Agendar cita</h1>
                            </div>
                        </div>
                        <div class="full mb-10">
                            <h1 class="w-full text-center">* Si no encuentra una cita disponible para la fecha y hora
                                que necesitas escribenos al correo:</h1>
                            <h1 class="w-full text-center">hola@docvisual.co y te ingresaremos a una lista de espera.
                            </h1>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <Footer_Color color="#ffffff" v-if="!modoVista" />
    </div>
</template>
<style>
#specialist {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: none;
}
</style>