<script lang="ts">
import { services } from './DataFilters/services';
import { locations } from './DataFilters/locations';
import SpecialistDataMock from './Mocks/SpecialistDataMock.json'
import type { Specialist } from './Specialist';
import CardSpecialist from './CardSpecialist.vue';
import { useRoute } from 'vue-router';
import { computed, onMounted, reactive } from 'vue';
import { useSearchProfesionalStorage } from '@/store';
import type { filters_profesional, Specialist_dto } from '@/dto/professional';
import { PaginationDto } from '@/dto/Pagination.dto';
import type { citys_dto } from '@/dto/professional/citys.dto';
import Swal from 'sweetalert2';
import { getDepartmentFromCoords } from '@/utils/geocoding';
export default {
    name: 'Search_Soecialist',
    components: {
        CardSpecialist
    },
    props: {
        buttonsActive: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    setup() {
        const filteredSpecialtiesOftamologi = computed(() => {
            const allowed = [
                'Oftalmología general',
                'Retinólogo',
                'Glaucomatólogo',
                'Cirugía refractiva',
                'Oftalmología pediátrica',
                'Neuro-oftalmología',
                'Plástica ocular',
                'Catarata y córnea',
                'Oncología ocular',
            ];
            return specialties.value.filter(option => allowed.includes(option.name));
        });
        const filteredSpecialtiesOptometry = computed(() => {
            const allowed = [
                'Terapia visual (ortóptica)',
                'Contactología',
                'Optometría pediátrica',
                'Optometría geriátrica',
                'Rehabilitación en baja visión',
                'Superficie ocular',
                'Optometría deportiva (entrenamiento visual)',
                'Optometría integral',
                'Seguridad y salud en el trabajo',
            ];
            return specialties.value.filter(option => allowed.includes(option.name));
        });

        const professionalStore = useSearchProfesionalStorage();
        //reactive data store
        const specialties = computed(() => professionalStore.specialties);
        const citys = computed(() => professionalStore.citys);
        const list_professionals = computed(() => professionalStore.list_professionals)
        onMounted(() => {
      
            professionalStore.provide_specialties()
            professionalStore.provide_citys()
            load_data()
        });

        //specialities funtions 


        const isSpecialistSelected = (specialty: Specialist_dto) => {
            return state.select_specialties.some(s => s.id === specialty.id);
        };
        const addOrRemoveSpecialty = (specialty: Specialist_dto) => {
            if (isSpecialistSelected(specialty)) {
                state.select_specialties = state.select_specialties.filter(s => s.id !== specialty.id);
            } else {
                state.select_specialties.push(specialty);
            }
        };
        const isSpecialistSelectedByName = (specialtyName: string) => {
            return state.select_specialties.some(s => s.name.toLowerCase() === specialtyName.toLowerCase());
        };
        const isServiceSelectedByName = (serviceName: string) => {
            return state.filterService.some(s => s.toLowerCase() === serviceName.toLowerCase());
        };
        // City functions
        const isCitySelected = (city: citys_dto) => {
            return state.select_citys.some(c => c.id === city.id);
        };

        const addOrRemoveCity = (city: citys_dto) => {
            if (isCitySelected(city)) {
                state.select_citys = state.select_citys.filter(c => c.id !== city.id);
            } else {
                state.select_citys.push(city);
            }
        };


        ///
        const route = useRoute();
        const state = reactive({
            pagination: {
                page: 1,
                limit: 100
            } as PaginationDto,
            items: SpecialistDataMock as Specialist[],
            name: "",
            select_specialties: [] as Specialist_dto[],
            select_citys: [] as citys_dto[],
            filterSpecialty: [] as string[],
            filterService: [] as string[],
            panels: {
                panelService: false,
                panelSpecialty: false,

                penelSpecialityoftamology: false,
                panelSpecialityoptometry: false,
                panelLocation: false,
            },
        });
        const togglePanel = (panel: keyof typeof state.panels) => {
            state.panels[panel] = !state.panels[panel];
        };
        //funtions
        const loadFiltersFromQuery = () => {
            if (route.query.filter) {
                state.filterSpecialty = Array.isArray(route.query.filter)
                    ? route.query.filter.filter((f): f is string => typeof f === "string")
                    : typeof route.query.filter === "string"
                        ? [route.query.filter]
                        : [];
            }
        };

        const load_data = async () => {
            const filters: filters_profesional = {
                specialitsFilters: state.select_specialties,
                cityFilters: state.select_citys,
                ...(state.name?.trim() ? { name: state.name } : {})
            }
            await professionalStore.load_specialists(state.pagination, filters)
            if (list_professionals.value.length === 0) {
                await Swal.fire({
                    title: 'No encontramos especialistas ',
                    text: 'No encontramos un especialista con todos los filtros, regresa y vuelve a buscar un especialista que se ajuste a lo que estas buscando.',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: 'var(--blue-1)',
                });
            } else {

            }
        }
        function handleEnter(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                // searchItems();
                togglePanel('panelService');
                load_data();
            }
        }


        onMounted(() => {
            loadFiltersFromQuery();
            window.addEventListener('keydown', handleEnter);
        });



        return {
            filteredSpecialtiesOptometry,
            filteredSpecialtiesOftamologi,
            isServiceSelectedByName,
            isCitySelected,
            addOrRemoveCity,
            load_data,
            isSpecialistSelectedByName,
            addOrRemoveSpecialty,
            isSpecialistSelected,
            togglePanel,
            list_professionals,
            state,
            specialties,
            citys,
            items: SpecialistDataMock as Specialist[],
            optionsServices: services,
            optionsSpecialist: specialties,
            optionsLocaltion: locations,
            filterSpecialty: [] as string[],

            filterLocation: [] as string[],
            name: '',
            data: SpecialistDataMock as Specialist[]
        };
    },
    methods: {
        async getLocationUser() {
            if (!navigator.geolocation) {
                console.warn('Geolocalización no está soportada por el navegador.');
                return;
            }
        
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    (async () => {
                         
                        const { latitude, longitude } = position.coords;
                        const departament = await getDepartmentFromCoords(longitude, latitude);
                        console.log('Tu ubicación (departamento):', departament);
                    })();
                },
                (error) => {
                    console.warn('No se pudo obtener la ubicación:', error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        },

        clearFilters() {
            this.state.name = '';
            this.state.select_citys = [];
            this.state.select_specialties = [];
            this.filterSpecialty = [];
            this.state.filterService = [];
        },
        selectSpecialist(specialist: string) {
            // Usar `find` para obtener un único objeto
            const data = this.specialties.find(item => item.name === specialist);
            if (!data) return;

            const index = this.state.select_specialties.findIndex(item => item.name === specialist);



            if (index === -1) {
                this.state.select_specialties.push(data); // Ahora sí es un objeto, no un array
            } else {
                this.state.select_specialties.splice(index, 1);
            }
            this.load_data()
        },
        selectService(service: string) {
            const index = this.state.filterService.indexOf(service);

            if (index === -1) {
                this.state.filterService.push(service);
            } else {
                this.state.filterService.splice(index, 1);
            }
        },
        isServiceSelected(service: string) {
            return this.state.filterService.includes(service);
        },
        searchItems() {
            let itemsFull = [...this.items]; // Clonamos para evitar mutaciones inesperadas
            const normalizeText = (text: string) =>
                text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();

            if (this.name.trim().length > 0) {
                const normalizedSearch = normalizeText(this.name.trim());

                itemsFull = itemsFull.filter(item =>
                    normalizeText(item.name).includes(normalizedSearch)
                );
            }
            if (this.filterSpecialty.length > 0) {
                itemsFull = itemsFull.filter(item =>
                    item.specialist.some(specialty => this.filterSpecialty.includes(specialty))
                );
            }

            if (this.state.filterService.length > 0) {
                itemsFull = itemsFull.filter(item =>
                    item.services.some(service => this.state.filterService.includes(service))
                );
            }

            if (this.filterLocation.length > 0) {
                itemsFull = itemsFull.filter(item =>
                    item.locals.some(local => this.filterLocation.includes(local.departament))
                );
            }

            this.data = itemsFull; // Actualiza el estado de `data`
        },
        goToSpecialist(id: string) {

        },




    },
    async mounted() {

        await this.getLocationUser()

        const query = this.$route.query;

        if (query.filter) {
            // Asegurar que el valor sea un array de strings y excluir valores nulos
            const newFilter = Array.isArray(query.filter)
                ? query.filter.filter((f): f is string => typeof f === "string") // Filtra solo los strings
                : typeof query.filter === "string"
                    ? [query.filter]
                    : [];

            this.filterSpecialty = newFilter;
            this.searchItems()
        }
    }
}
</script>
<template>
    <div class="w-full bg-gradient-to-r from-gray-100 to-gray-50">
        <div class="container m-auto px-2 pt-10">
            <h1 class="w-full text-center font-poppins text-2xl" style="color: var(--blue-1);">Especialistas en salud
                visual a la mano</h1>
            <h2 class="w-full text-center font-poppins mt-2 mb-9 text-xl md:text-2xl font-bold">Agenda tu cita con
                alguno de
                nuestros
                profesionales en:</h2>

            <!-- filterMovile and tablet -->
            <div class="flex flex-wrap justify-center mb-3 gap-3 lg:hidden  w-full">
                <div class="flex p-3 text-white rounded-full bg-[var(--blue-1)]/70"
                    @click="togglePanel('panelService')">
                    <h1 class="font-poppins">Servicios</h1>
                    <div class="  flex items-center  ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                            class="mx-1 w-5 h-5 transition-transform rotate-90" fill="var(--blue-1)">
                            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                        </svg>
                    </div>
                </div>
                <div class="flex p-3 text-white rounded-full bg-[var(--blue-1)]/70"
                    @click="togglePanel('panelSpecialty')">
                    <h1 class="font-poppins">Especialidad</h1>
                    <div class="  flex items-center  ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                            class="mx-1 w-5 h-5 transition-transform rotate-90" fill="var(--blue-1)">
                            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                        </svg>
                    </div>
                </div>
                <div class="flex p-3 text-white rounded-full bg-[var(--blue-1)]/70"
                    @click="togglePanel('panelLocation')">
                    <h1 class="font-poppins">Ubicación</h1>
                    <div class="  flex items-center  ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                            class="mx-1 w-5 h-5 transition-transform rotate-90" fill="var(--blue-1)">
                            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                        </svg>
                    </div>
                </div>
            </div>


            <!-- pantallas menor a grandes -->
            <div v-if="state.panels.panelService"
                class="fixed inset-0 z-50 bg-black/50    flex justify-center items-center sm:flex md:flex lg:hidden"
                @click.self="togglePanel('panelService')">
                <!-- Contenedor del modal -->
                <div class="bg-white w-11/12 max-w-md min-h-[60vh] max-h-[60vh]  rounded-2xl shadow-lg flex flex-col">
                    <!-- Encabezado -->
                    <div class="w-full">
                        <div class="w-full flex items-center px-2">
                            <button @click="togglePanel('panelService')"
                                class="p-2 text-lg font-poppins font-bold cursor-pointer">X</button>
                            <h3 class="flex-1 text-center font-poppins">Servicio</h3>
                            <h3 class="p-2 font-poppins cursor-pointer" style="color: var(--blue-1);"
                                @click="clearFilters">Limpiar</h3>
                        </div>
                        <hr class="text-gray-200" />
                    </div>

                    <!-- Contenido desplazable -->


                    <!-- Botón fijo en la parte inferior -->
                    <div class="w-full p-4 bg-white shadow-md rounded-2xl">
                        <button class="w-full bg-[var(--blue-1)] text-white py-2 rounded-lg font-poppins"
                            @click="searchItems(); togglePanel('panelService'); load_data()" tabindex="0">
                            Aplicar filtros
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="state.panels.panelSpecialty"
                class="fixed inset-0 z-50 bg-black/50    flex justify-center items-center sm:flex md:flex lg:hidden"
                @click.self="togglePanel('panelSpecialty')">
                <!-- Contenedor del modal -->
                <div class="bg-white w-11/12 max-w-md min-h-[60vh] max-h-[60vh]  rounded-2xl shadow-lg flex flex-col">
                    <!-- Encabezado -->
                    <div class="w-full">
                        <div class="w-full flex items-center px-2">
                            <button @click="togglePanel('panelSpecialty')"
                                class="p-2 text-lg font-poppins font-bold cursor-pointer">X</button>
                            <h3 class="flex-1 text-center font-poppins">Especialidad</h3>
                            <h3 class="p-2 font-poppins cursor-pointer" style="color: var(--blue-1);"
                                @click="clearFilters">Limpiar</h3>
                        </div>
                        <hr class="text-gray-200" />
                    </div>

                    <!-- Contenido desplazable -->
                    <div class="flex-1 overflow-auto p-4">
                        <div v-if="state.panels.panelSpecialty">
                            <div v-for="(option, index) in optionsSpecialist" :key="index" class="flex w-full my-2"
                                @click=" addOrRemoveSpecialty(option)">
                                <input type="checkbox" :id="'checkbox-' + index" :checked="isSpecialistSelected(option)"
                                    :value="option"
                                    class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)]">
                                <h1 class="mt-auto cursor-pointer">{{ option.name
                                }}</h1>
                            </div>
                        </div>
                    </div>

                    <!-- Botón fijo en la parte inferior -->
                    <div class="w-full p-4 bg-white shadow-md rounded-2xl">
                        <button class="w-full bg-[var(--blue-1)] text-white py-2 rounded-lg font-poppins"
                            @click="searchItems(); togglePanel('panelSpecialty'); load_data()">Aplicar filtros</button>
                    </div>
                </div>
            </div>


            <div v-if="state.panels.panelLocation"
                class="fixed inset-0 z-50 bg-black/50    flex justify-center items-center sm:flex md:flex lg:hidden"
                @click.self="togglePanel('panelLocation')">
                <!-- Contenedor del modal -->
                <div class="bg-white w-11/12 max-w-md min-h-[60vh] max-h-[60vh]  rounded-2xl shadow-lg flex flex-col">
                    <!-- Encabezado -->
                    <div class="w-full">
                        <div class="w-full flex items-center px-2">
                            <button @click="togglePanel('panelLocation')"
                                class="p-2 text-lg font-poppins font-bold cursor-pointer">X</button>
                            <h3 class="flex-1 text-center font-poppins">Ubicación</h3>
                            <h3 class="p-2 font-poppins cursor-pointer" style="color: var(--blue-1);"
                                @click="clearFilters">Limpiar</h3>
                        </div>
                        <hr class="text-gray-200" />
                    </div>

                    <!-- Contenido desplazable -->
                    <div class="flex-1 overflow-auto p-4">
                        <div v-if="state.panels.panelLocation">
                            <div v-for="(option, index) in citys" :key="index" @click=" addOrRemoveCity(option)"
                                class="flex w-full my-2">
                                <input type="checkbox" :id="'checkbox-' + index" :checked="isCitySelected(option)"
                                    :value="option"
                                    class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)]">
                                <h1 class="mt-auto cursor-pointer">{{ option.name
                                }}</h1>
                            </div>
                        </div>
                    </div>

                    <!-- Botón fijo en la parte inferior -->
                    <div class="w-full p-4 bg-white shadow-md rounded-2xl">
                        <button class="w-full bg-[var(--blue-1)] text-white py-2 rounded-lg font-poppins"
                            @click="searchItems(); togglePanel('panelLocation'); load_data()">Aplicar filtros</button>
                    </div>
                </div>
            </div>




            <!-- ------- -->
            <div class="hidden lg:flex  mx-28  flex-wrap justify-between   my-10" v-if="buttonsActive">

                <div class="px-6    rounded-2xl flex flex-col justify-center cursor-pointer transition duration-700 "
                    @click="selectSpecialist('Optometría integral')"
                    :class="isSpecialistSelectedByName('Optometría integral') ? 'selectCard' : 'bg-gray-200'">
                    <h1 class="font-poppins text-base mx-2 font-semibold">Optometría</h1>
                </div>

                <div class="px-6  bg-gray-200 rounded-2xl flex flex-col justify-center cursor-pointer transition duration-700"
                    @click="selectSpecialist('Oftalmología general')"
                    :class="isSpecialistSelectedByName('Oftalmología general') ? 'selectCard' : 'bg-gray-200'">
                    <h1 class="font-poppins text-base mx-2 font-semibold">Oftalmología</h1>
                </div>

                <div class=" px-6 bg-gray-200 rounded-2xl flex flex-col justify-center cursor-pointer transition duration-700"
                    @click="selectSpecialist('Terapia visual (ortóptica)')"
                    :class="isSpecialistSelectedByName('Terapia visual (ortóptica)') ? 'selectCard' : 'bg-gray-200'">
                    <h1 class="font-poppins text-base mx-2 font-semibold">Terapia Visual</h1>
                </div>
                <div class="p-1 px-6 bg-gray-200 rounded-2xl flex flex-col justify-center cursor-pointer transition duration-700"
                    @click="selectSpecialist('Optometría pediátrica')"
                    :class="isSpecialistSelectedByName('Optometría pediátrica') ? 'selectCard' : 'bg-gray-200'">
                    <h1 class="font-poppins text-base mx-2 font-semibold">Optometría</h1>
                    <h1 class="font-poppins text-base mx-2 font-semibold">Pediátrica</h1>
                </div>
            </div>
        </div>
        <div class="container m-auto px-2 min-h-svh">
            <div class="lg:flex     ">

                <div class="hidden lg:flex w-3/10 mx-9 bg-white   flex-col  rounded-2xl h-full sticky top-10">
                    <!-- Contenido con scroll -->
                    <div class="overflow-y-auto px-8 max-h-[50vh] min-h-0">

                        <div class="w-full">
                            <h1 class="mb-2 font-poppins mx-2 mt-6 font-semibold">Buscar por nombre</h1>
                            <div class="relative flex items-center w-full   ">

                                <svg class="absolute left-3 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                                        stroke="#000000" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                                <input type="text" placeholder="Buscar especialistas..." v-model="state.name"
                                    class="w-full pl-10 pr-3 py-2 mx-2  rounded-full    border border-gray-400 focus:ring-2 focus:ring-blue-500 font-poppins my-10" />
                            </div>
                        </div>
                        <div class="w-full">
                            <div class="w-full flex items-center px-2" @click="togglePanel('panelSpecialty')">
                                <h1 class="text-base font-medium font-poppins max-w-[80%] mb-3">Especialidad</h1>
                                <img src="@/assets/svg/arrow.svg" alt="Icono"
                                    class="w-4 h-4 transition-transform ml-auto"
                                    :class="{ 'rotate-90': state.panels.panelSpecialty }">
                            </div>


                            <Transition name="fade">
                                <div v-if="state.panels.panelSpecialty">

                                    <div class="w-[90%] flex items-center px-2 ml-auto"
                                        @click="togglePanel('penelSpecialityoftamology')">
                                        <h1 class="text-base font-medium font-poppins max-w-[80%] mb-3">Oftalmología
                                        </h1>
                                        <img src="@/assets/svg/arrow.svg" alt="Icono"
                                            class="w-4 h-4 transition-transform ml-auto"
                                            :class="{ 'rotate-90': state.panels.penelSpecialityoftamology }">
                                    </div>

                                    <div v-if="state.panels.penelSpecialityoftamology && state.panels.panelSpecialty"
                                        v-for="(option, index) in filteredSpecialtiesOftamologi" :key="index"
                                        @click="addOrRemoveSpecialty(option)"
                                        class="flex w-[90%] ml-auto items-center my-1">

                                        <input type="checkbox" :id="'checkbox-' + index"
                                            :checked="isSpecialistSelected(option)" :value="option"
                                            class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)]">
                                        <h1 class="mt-auto cursor-pointer">{{ option.name }}</h1>
                                    </div>

                                    <div class="w-[90%] flex items-center px-2 ml-auto mb-3"
                                        @click="togglePanel('panelSpecialityoptometry')">
                                        <h1 class="text-base font-medium font-poppins max-w-[80%]">Optometría</h1>
                                        <img src="@/assets/svg/arrow.svg" alt="Icono"
                                            class="w-4 h-4 transition-transform ml-auto"
                                            :class="{ 'rotate-90': state.panels.panelSpecialityoptometry }">
                                    </div>
                                    <div v-if="state.panels.panelSpecialityoptometry && state.panels.panelSpecialty"
                                        v-for="(option, index) in filteredSpecialtiesOptometry" :key="index"
                                        @click="addOrRemoveSpecialty(option)"
                                        class="flex w-[90%] ml-auto items-center my-1">

                                        <input type="checkbox" :id="'checkbox-' + index"
                                            :checked="isSpecialistSelected(option)" :value="option"
                                            class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)] ">
                                        <h1 class="mt-auto cursor-pointer">{{ option.name }}</h1>
                                    </div>
                                </div>
                            </Transition>
                            <hr class="my-4 px-3 text-gray-400" />
                        </div>

                        <div class="w-full ">
                            <div class="w-full flex items-center px-2" @click="togglePanel('panelService')">
                                <h1 class="text-base font-medium font-poppins ">Servicio</h1>
                                <img src="@/assets/svg/arrow.svg" alt="Icono"
                                    class="w-4 h-4 transition-transform ml-auto"
                                    :class="{ 'rotate-90': state.panels.panelService }">
                            </div>
                            <hr class="my-4 px-3 text-gray-400" />
                            <Transition name="fade">
                                <div v-if="state.panels.panelService">

                                    <div v-for="(option, index) in optionsServices" :key="index"
                                        @click="() => { selectService(option) }" class="flex w-full my-2 text-base">

                                        <input type="checkbox" :id="'checkbox-' + index"
                                            :checked="state.filterService.includes(option)" :value="option"
                                            class="w-5 h-5 mx-2 accent-[var(--blue-1)] pointer-events-none"
                                            tabindex="-1" />



                                        <label class="mt-auto cursor-pointer">
                                            {{ option }}
                                        </label>
                                    </div>
                                </div>
                            </Transition>
                        </div>



                        <div class="w-full">
                            <div class="w-full flex items-center px-2" @click=" togglePanel('panelLocation')">
                                <h1 class="text-base font-medium font-poppins max-w-[80%]">Ubicación</h1>
                                <img src="@/assets/svg/arrow.svg" alt="Icono"
                                    class="w-4 h-4 transition-transform ml-auto"
                                    :class="{ 'rotate-90': state.panels.panelLocation }">
                            </div>
                            <hr class="my-4 px-3 text-gray-400" />
                            <Transition name="fade">
                                <div v-if="state.panels.panelLocation">

                                    <div v-for="(option, index) in citys" :key="index" @click=" addOrRemoveCity(option)"
                                        class="flex w-full my-2">
                                        <input type="checkbox" :id="'checkbox-' + index"
                                            :checked="isCitySelected(option)" :value="option"
                                            class="w-5 h-5 mx-2 colorvar accent-[var(--blue-1)]" disabled />

                                        <h1 class="mt-auto cursor-pointer">{{ option.name
                                        }}</h1>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                    </div>

                    <!-- Botones fijos abajo -->
                    <div class="w-full  ">

                        <div class="flex justify-between px-8 py-5">
                            <button @click="clearFilters"
                                class="bg-transparent   w-[40%] rounded font-poppins text-base font-semibold cursor-pointer"
                                style="color: var(--blue-1);">Limpiar</button>
                            <button tabindex="0"
                                class="w-[50%] mx-2 text-base font-bold text-white   py-2 rounded-xl text-center flex items-center justify-center cursor-pointer whitespace-nowrap"
                                style="background-color: var(--blue-1);" @click="load_data()">
                                Aplicar filtros
                            </button>
                        </div>
                    </div>
                </div>

                <div class="w-full lg:w-7/10  ">
                    <h1 v-if="list_professionals.length" class="font-poppins mx-10  text-base text-center sm:text-left">
                        {{
                            `${list_professionals.length} Especialistas
                        disponibles para
                        ti` }}</h1>
                    <div class="flex flex-col flex-wrap justify-center      ">
                        <div v-for="(option, index) in list_professionals" :key="index"
                            class="flex flex-col items-center   p-0 md:p-4 rounded-lg">
                            <CardSpecialist :user_data="option" class="mb-3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style>
.selectCard {
    background-color: var(--blue-1);
    color: white;
}

.colorvar {
    color: var(--blue-1);
}

.bagroudVar {
    background: var(--blue-1);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
