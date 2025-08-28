<script lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Specialist_dto, filters_profesional, user_professional_search_dto } from '@/dto/professional';
import type { citys_dto } from '@/dto/professional/citys.dto';
import type { PaginationDto } from '@/dto/Pagination.dto';
import { useSearchProfesionalStorage } from '@/store';
import CardSpecialist from '@/Modules/Specialists/CardSpecialist.vue';
import SpecialistDataMock from '@/Modules/Specialists/Mocks/SpecialistDataMock.json';
import type { Specialist } from '@/Modules/Specialists/Specialist';
import Swal from 'sweetalert2';
import { getDepartmentFromCoords } from '@/utils/geocoding';
import { services } from '@/Modules/Specialists/DataFilters/services';

export default {
    name: 'Search_Specialists',
    components: { CardSpecialist },
    props: {
        buttonsActive: {
            type: Boolean,
            default: true
        }
    },
    setup() {
        const professionalStore = useSearchProfesionalStorage();
        const route = useRoute();

        const state = reactive({
            pagination: {
                page: 1,
                limit: 100
            } as PaginationDto,
            items: SpecialistDataMock as unknown as user_professional_search_dto[],
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

        // Estado de carga
        const isLoading = ref(true);

        // Datos reactivos del store
        const specialties = computed(() => professionalStore.specialties);
        const citys = computed(() => professionalStore.citys);
        const list_professionals = computed(() => professionalStore.list_professionals);

        // Especialidades filtradas
        const filteredSpecialtiesOftamologi = computed(() => {
            const allowed = [
                'Oftalmología general',
                'Retina',
                'Glaucoma',
                'Córnea',
                'Oculoplástica',
                'Oftalmología pediátrica',
                'Neuro-oftalmología',
                'Cirugía refractiva',
                'Catarata',
                'Uveítis',
                'Estrabismo'
            ];
            return specialties.value.filter(option => allowed.includes(option.name));
        });

        const filteredSpecialtiesOptometry = computed(() => {
            const allowed = [
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

        // Funciones de toggle
        const togglePanel = (panel: keyof typeof state.panels) => {
            state.panels[panel] = !state.panels[panel];
        };

        // Funciones de especialidades
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

        // Funciones de servicios
        const isServiceSelectedByName = (serviceName: string) => {
            return state.filterService.some(s => s.toLowerCase() === serviceName.toLowerCase());
        };

        // Funciones de ciudades
        const isCitySelected = (city: citys_dto) => {
            return state.select_citys.some((c: citys_dto) => c.id === city.id);
        };

        const addOrRemoveCity = (city: citys_dto) => {
            if (isCitySelected(city)) {
                state.select_citys = state.select_citys.filter((c: citys_dto) => c.id !== city.id);
            } else {
                state.select_citys.push(city);
            }
        };

        // Función para cargar filtros desde query
        const loadFiltersFromQuery = () => {
            if (route.query.filter) {
                state.filterSpecialty = Array.isArray(route.query.filter)
                    ? route.query.filter.filter((f): f is string => typeof f === "string")
                    : typeof route.query.filter === "string"
                        ? [route.query.filter]
                        : [];
            }
        };

        // Función para cargar datos
        const load_data = async () => {
            try {
                isLoading.value = true;
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
                }
            } catch (error) {
                console.error('Error cargando especialistas:', error);
            } finally {
                isLoading.value = false;
            }
        }

        // Función para limpiar filtros
        const clearFilters = () => {
            state.name = '';
            state.select_citys = [];
            state.select_specialties = [];
            state.filterSpecialty = [];
            state.filterService = [];
        };

        // Función para manejar Enter
        function handleEnter(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                load_data();
            }
        }

        onMounted(() => {
            loadFiltersFromQuery();
            professionalStore.provide_specialties();
            professionalStore.provide_citys();
            load_data();
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
            clearFilters,
            isLoading,
            services,
            items: SpecialistDataMock as unknown as user_professional_search_dto[],
            filterSpecialty: [] as string[],
            filterLocation: [] as string[],
            name: '',
            data: SpecialistDataMock as unknown as user_professional_search_dto[]
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

        selectSpecialist(specialist: string) {
            const data = this.specialties.find(item => item.name === specialist);
            if (!data) return;

            const index = this.state.select_specialties.findIndex(item => item.name === specialist);

            if (index === -1) {
                this.state.select_specialties.push(data);
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
            let itemsFull = [...this.items] as user_professional_search_dto[];
            const normalizeText = (text: string) =>
                text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();

            if (this.name.trim().length > 0) {
                const normalizedSearch = normalizeText(this.name.trim());

                itemsFull = itemsFull.filter((item: user_professional_search_dto) =>
                    normalizeText(item.name).includes(normalizedSearch)
                );
            }

            this.data = itemsFull;
        },

        goToSpecialist(id: string) {
            // Función para navegar al especialista
        },
    },

    async mounted() {
        await this.getLocationUser();

        const query = this.$route.query;

        if (query.filter) {
            const newFilter = Array.isArray(query.filter)
                ? query.filter.filter((f): f is string => typeof f === "string")
                : typeof query.filter === "string"
                    ? [query.filter]
                    : [];

            this.filterSpecialty = newFilter;
            this.searchItems();
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
                alguno de nuestros profesionales en:</h2>

            <!-- Card de búsqueda para móvil -->
            <div class="lg:hidden w-full">
                <div class="mx-4 mb-6 bg-white flex-col rounded-2xl shadow-lg">
                    <div class="px-8 py-6">
                        <!-- Búsqueda por nombre -->
                        <div class="w-full">
                            <h1 class="mb-2 font-poppins mx-2 font-semibold">Buscar por nombre</h1>
                            <div class="relative flex items-center w-full">
                                <svg class="absolute left-3 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                                        stroke="#000000" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                                <input type="text" placeholder="Buscar especialistas..." v-model="state.name"
                                    class="w-full pl-10 pr-3 py-2 mx-2 rounded-full border border-gray-400 focus:ring-2 focus:ring-blue-500 font-poppins my-6" />
                            </div>
                        </div>

                        <!-- Filtros de especialidad -->
                        <div class="w-full">
                            <div class="w-full flex items-center px-2" @click="togglePanel('panelSpecialty')">
                                <h1 class="text-base font-medium font-poppins max-w-[80%] mb-3">Especialidad</h1>
                                <img src="@/assets/svg/arrow.svg" alt="Icono"
                                    class="w-4 h-4 ml-auto transform transition-transform duration-300"
                                    :class="state.panels.panelSpecialty ? 'rotate-180' : ''" />
                            </div>
                            <Transition name="fade">
                                <div v-if="state.panels.panelSpecialty" class="w-full max-h-40 overflow-y-auto">
                                    <div v-for="(option, index) in specialties" :key="index" class="flex w-full my-2"
                                        @click="addOrRemoveSpecialty(option)">
                                        <input type="checkbox" :id="'mobile-checkbox-' + index"
                                            :checked="isSpecialistSelected(option)" :value="option"
                                            class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)]">
                                        <h1 class="mt-auto cursor-pointer">{{ option.name }}</h1>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <!-- Filtros de servicio -->
                        <div class="w-full">
                            <div class="w-full flex items-center px-2" @click="togglePanel('panelService')">
                                <h1 class="text-base font-medium font-poppins max-w-[80%] mb-3">Servicio</h1>
                                <img src="@/assets/svg/arrow.svg" alt="Icono"
                                    class="w-4 h-4 ml-auto transform transition-transform duration-300"
                                    :class="state.panels.panelService ? 'rotate-180' : ''" />
                            </div>
                            <Transition name="fade">
                                <div v-if="state.panels.panelService" class="w-full max-h-40 overflow-y-auto">
                                    <div v-for="(option, index) in services" :key="index" class="flex w-full my-2"
                                        @click="selectService(option)">
                                        <input type="checkbox" :id="'mobile-service-checkbox-' + index"
                                            :checked="isServiceSelected(option)" :value="option"
                                            class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)]">
                                        <h1 class="mt-auto cursor-pointer">{{ option }}</h1>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <!-- Filtros de ubicación -->
                        <div class="w-full">
                            <div class="w-full flex items-center px-2" @click="togglePanel('panelLocation')">
                                <h1 class="text-base font-medium font-poppins max-w-[80%] mb-3">Ubicación</h1>
                                <img src="@/assets/svg/arrow.svg" alt="Icono"
                                    class="w-4 h-4 ml-auto transform transition-transform duration-300"
                                    :class="state.panels.panelLocation ? 'rotate-180' : ''" />
                            </div>
                            <Transition name="fade">
                                <div v-if="state.panels.panelLocation" class="w-full max-h-40 overflow-y-auto">
                                    <div v-for="(option, index) in citys" :key="index" class="flex w-full my-2"
                                        @click="addOrRemoveCity(option)">
                                        <input type="checkbox" :id="'mobile-city-checkbox-' + index" :checked="isCitySelected(option)"
                                            :value="option"
                                            class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)]">
                                        <h1 class="mt-auto cursor-pointer">{{ option.name }}</h1>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <!-- Botones -->
                        <div class="w-full">
                            <div class="flex justify-between px-2 py-5">
                                <button @click="clearFilters"
                                    class="bg-transparent w-[40%] rounded font-poppins text-base font-semibold cursor-pointer"
                                    style="color: var(--blue-1);">Limpiar</button>
                                <button tabindex="0"
                                    class="w-[50%] mx-2 text-base font-bold text-white py-2 rounded-xl text-center flex items-center justify-center cursor-pointer whitespace-nowrap"
                                    style="background-color: var(--blue-1);" @click="load_data()">
                                    Aplicar filtros
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botones de especialidades directas -->
            <div class="flex flex-wrap justify-center mb-6 gap-3">
                <div class="p-1 px-6 bg-gray-200 rounded-2xl flex justify-center cursor-pointer transition duration-700"
                    @click="selectSpecialist('Optometría')"
                    :class="isSpecialistSelectedByName('Optometría') ? 'selectCard' : 'bg-gray-200'">
                    <h1 class="font-poppins text-base mx-2 font-semibold">Optometría</h1>
                </div>
                <div class="p-1 px-6 bg-gray-200 rounded-2xl flex justify-center cursor-pointer transition duration-700"
                    @click="selectSpecialist('Oftalmología')"
                    :class="isSpecialistSelectedByName('Oftalmología') ? 'selectCard' : 'bg-gray-200'">
                    <h1 class="font-poppins text-base mx-2 font-semibold">Oftalmología</h1>
                </div>
                <div class="p-1 px-6 bg-gray-200 rounded-2xl flex justify-center cursor-pointer transition duration-700"
                    @click="selectSpecialist('Terapia Visual')"
                    :class="isSpecialistSelectedByName('Terapia Visual') ? 'selectCard' : 'bg-gray-200'">
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

        <!-- Contenedor principal -->
        <div class="container m-auto px-2 min-h-svh">
            <div class="lg:flex">
                <!-- Sidebar desktop -->
                <div class="hidden lg:flex w-3/10 mx-9 bg-white flex-col rounded-2xl h-full sticky top-10">
                    <div class="overflow-y-auto px-8 max-h-[50vh] min-h-0">
                        <!-- Búsqueda por nombre para desktop -->
                        <div class="w-full">
                            <h1 class="mb-2 font-poppins mx-2 mt-6 font-semibold">Buscar por nombre</h1>
                            <div class="relative flex items-center w-full">
                                <svg class="absolute left-3 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                                        stroke="#000000" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                                <input type="text" placeholder="Buscar especialistas..." v-model="state.name"
                                    class="w-full pl-10 pr-3 py-2 mx-2 rounded-full border border-gray-400 focus:ring-2 focus:ring-blue-500 font-poppins my-10" />
                            </div>
                        </div>

                        <!-- Filtros de especialidad para desktop -->
                        <div class="w-full">
                            <div class="w-full flex items-center px-2" @click="togglePanel('panelSpecialty')">
                                <h1 class="text-base font-medium font-poppins max-w-[80%] mb-3">Especialidad</h1>
                                <img src="@/assets/svg/arrow.svg" alt="Icono"
                                    class="w-4 h-4 ml-auto transform transition-transform duration-300"
                                    :class="state.panels.panelSpecialty ? 'rotate-180' : ''" />
                            </div>
                            <Transition name="fade">
                                <div v-if="state.panels.panelSpecialty" class="w-full max-h-40 overflow-y-auto">
                                    <div v-for="(option, index) in specialties" :key="index" class="flex w-full my-2"
                                        @click="addOrRemoveSpecialty(option)">
                                        <input type="checkbox" :id="'desktop-checkbox-' + index"
                                            :checked="isSpecialistSelected(option)" :value="option"
                                            class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)]">
                                        <h1 class="mt-auto cursor-pointer">{{ option.name }}</h1>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <!-- Filtros de servicio para desktop -->
                        <div class="w-full">
                            <div class="w-full flex items-center px-2" @click="togglePanel('panelService')">
                                <h1 class="text-base font-medium font-poppins max-w-[80%] mb-3">Servicio</h1>
                                <img src="@/assets/svg/arrow.svg" alt="Icono"
                                    class="w-4 h-4 ml-auto transform transition-transform duration-300"
                                    :class="state.panels.panelService ? 'rotate-180' : ''" />
                            </div>
                            <Transition name="fade">
                                <div v-if="state.panels.panelService" class="w-full max-h-40 overflow-y-auto">
                                    <div v-for="(option, index) in services" :key="index" class="flex w-full my-2"
                                        @click="selectService(option)">
                                        <input type="checkbox" :id="'desktop-service-checkbox-' + index"
                                            :checked="isServiceSelected(option)" :value="option"
                                            class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)]">
                                        <h1 class="mt-auto cursor-pointer">{{ option }}</h1>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        <!-- Filtros de ubicación para desktop -->
                        <div class="w-full">
                            <div class="w-full flex items-center px-2" @click="togglePanel('panelLocation')">
                                <h1 class="text-base font-medium font-poppins max-w-[80%] mb-3">Ubicación</h1>
                                <img src="@/assets/svg/arrow.svg" alt="Icono"
                                    class="w-4 h-4 ml-auto transform transition-transform duration-300"
                                    :class="state.panels.panelLocation ? 'rotate-180' : ''" />
                            </div>
                            <Transition name="fade">
                                <div v-if="state.panels.panelLocation" class="w-full max-h-40 overflow-y-auto">
                                    <div v-for="(option, index) in citys" :key="index" class="flex w-full my-2"
                                        @click="addOrRemoveCity(option)">
                                        <input type="checkbox" :id="'desktop-city-checkbox-' + index" :checked="isCitySelected(option)"
                                            :value="option"
                                            class="w-5 h-5 mx-2 colorvar pointer-events-none accent-[var(--blue-1)]">
                                        <h1 class="mt-auto cursor-pointer">{{ option.name }}</h1>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>

                    <!-- Botones fijos abajo para desktop -->
                    <div class="w-full">
                        <div class="flex justify-between px-8 py-5">
                            <button @click="clearFilters"
                                class="bg-transparent w-[40%] rounded font-poppins text-base font-semibold cursor-pointer"
                                style="color: var(--blue-1);">Limpiar</button>
                            <button tabindex="0"
                                class="w-[50%] mx-2 text-base font-bold text-white py-2 rounded-xl text-center flex items-center justify-center cursor-pointer whitespace-nowrap"
                                style="background-color: var(--blue-1);" @click="load_data()">
                                Aplicar filtros
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Contenido principal -->
                <div class="w-full lg:w-7/10">
                    <!-- Indicador de carga -->
                    <div v-if="isLoading" class="font-poppins mx-10 text-base text-center sm:text-left">
                        <div class="flex items-center justify-center sm:justify-start">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--blue-1)] mr-2"></div>
                            Buscando especialistas...
                        </div>
                    </div>
                    
                    <!-- Contador de resultados -->
                    <h1 v-else-if="list_professionals.length > 0" class="font-poppins mx-10 text-base text-center sm:text-left">
                        {{ `${list_professionals.length} Especialistas disponibles para ti` }}
                    </h1>
                    
                    <!-- Mensaje cuando no hay resultados -->
                    <h1 v-else class="font-poppins mx-10 text-base text-center sm:text-left text-gray-500">
                        No se encontraron especialistas con los filtros aplicados
                    </h1>
                    
                    <!-- Lista de profesionales -->
                    <div class="flex flex-col flex-wrap justify-center">
                        <div v-for="(option, index) in list_professionals" :key="index"
                            class="flex flex-col items-center p-0 md:p-4 rounded-lg">
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