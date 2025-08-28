<script lang="ts">

import { toast } from "vue3-toastify";
import { getDayOfWeekName, EsgetDayOfWeekName } from "@/utils/DateUtils";
import Add_adress from "./Modals/Add_adress.vue";
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useAuthStore, usePofessionalStorage } from '@/store';
import type { Specialist_dto, user_professional_body_dto } from '@/dto/professional';
import axios from 'axios';
import Swal from "sweetalert2";
import Add_servicess from "./Modals/Add_servicess.vue";
import type { ServicesDtoBody } from "@/dto/professional/Services-Dto";
import type { office_professional_dto } from "@/dto/professional/office_professional";
import type { Get_shedule_dto } from "@/dto/professional/shedules";
import Add_shedule from "./Modals/Add_shedule.vue";
import type { PutSheduleItemsOfficeDto, SheduleItemCompleteId } from "@/dto/professional/shedules/put_shedules.dto";
import Put_service from "./Modals/Put_service.vue";
import SpecialistDetail from "../Specialists/SpecialistDetail.vue";

import Modal_Float from "@/components/modal_Float.vue";
export default {
    name: 'panel_user_perfil',
    components: {
        Add_adress,
        Add_servicess,
        Add_shedule,
        Put_service,
        SpecialistDetail,
        Modal_Float
    },
    setup() {
        const store_auth = useAuthStore()
        const store_professional = usePofessionalStorage();

        onMounted(async () => {
            try {
                await store_professional.provide_specialties();
                await store_professional.get_user_profesional_detail();
                await store_professional.loadPrepago();
                // Asignar valores iniciales a los ref()
                document.value = store_professional.professional_detail?.document || "";

                experience.value = store_professional.professional_detail?.experience ?? 0;
                dataEdit.experience = store_professional.professional_detail?.experience ?? 0;



                description.value = store_professional.professional_detail?.description || "";
                dataEdit.description = store_professional.professional_detail?.description || "";
                
                title.value = store_professional.professional_detail?.title || "";
                dataEdit.title = store_professional.professional_detail?.title || "";

                phone.value = store_professional.professional_detail?.phone || "";
                dataEdit.phone = store_professional.professional_detail?.phone || "";

                web.value = store_professional.professional_detail?.web || "";
                dataEdit.web = store_professional.professional_detail?.web || "";



                facebook.value = store_professional.professional_detail?.facebook || "";
                dataEdit.facebook = store_professional.professional_detail?.facebook || "";

                instagram.value = store_professional.professional_detail?.instagram || "";
                dataEdit.instagram = store_professional.professional_detail?.instagram || "";

                linkedin.value = store_professional.professional_detail?.linkedin || "";
                dataEdit.linkedin = store_professional.professional_detail?.linkedin || "";


                youtube.value = store_professional.professional_detail?.youtube || "";
                dataEdit.youtube = store_professional.professional_detail?.youtube || "";


                perfilPhoto.value = store_professional.professional_detail?.perfilPhoto || "";
                dataEdit.perfilPhoto = store_professional.professional_detail?.perfilPhoto || ""


                email.value = store_auth.user?.email || "";
                name.value = store_auth.user?.names || "";
                lastname.value = store_auth.user?.lastnames || "";
                actions.value = store_professional.professional_detail?.actions || []
                dataEdit.actions = store_professional.professional_detail?.actions || []


                paymentMethod.value = store_professional.professional_detail?.type_of_payment as 'CLINIC' | 'prepaid' || 'CLINIC';
                selectedSpecialists.value = store_professional.professional_detail?.specialists?.map(s => ({
                    id: s.id ?? "",
                    name: s.name ?? "",
                    status: s.status ?? ""
                })) || [];

                dataEdit.selectedSpecialists = store_professional.professional_detail?.specialists?.map(s => ({
                    id: s.id ?? "",
                    name: s.name ?? "",
                    status: s.status ?? ""
                })) || [];

                selectedPrepagadaList.value = store_professional.professional_detail?.prepagadas?.map(s => ({
                    id: s.id ?? "",
                    name: s.name ?? "",
                    status: s.status ?? ""
                })) || [];

            } catch (error) {
                console.error("Error al cargar datos:", error);
                toast.error("Error al cargar datos");
            }
        });
        const toggleActive = (index: number) => {
            if (shedules_datas_office.value[index]) {
                shedules_datas_office.value[index].active = !shedules_datas_office.value[index].active;
            }
        };
        const dataEdit = reactive({
            experience: 0,
            description: "",
            document: "",
            actions: [] as string[],
            writeAction: "",
            title: "",
            phone: "",
            web: "",
            facebook: "",
            instagram: "",
            linkedin: "",
            youtube: "",
            perfilPhoto: "",
            name: "",
            email: "",
            day_name: "",
            selectedSpecialists: [] as Specialist_dto[]
        });
        const experience = ref<number | null>(null);
        const componentKey = ref(0);
        const idUser = computed(() => store_auth.user?.id || '');
        const lastname = ref<string>("");
        const name = ref<string>("");

        const select_shedule = ref<null | office_professional_dto>(null);
        const shedules_datas_office = computed(() => store_professional.shedule_data || []);
        const offices = computed(() => store_professional.professional_detail?.offices || []);
        const photosPanel = computed(() => store_professional.professional_detail?.photos || []);
        const services = computed(() => store_professional.professional_detail?.services || []);
        const day = ref<number>(1);
        const description = ref<string>("");
        const document = ref<string>("");
        const actions = ref<string[]>([]);
        const writeAction = ref<string>("");
        const title = ref<string>("");
        const phone = ref<string>("");
        const web = ref<string>("");
        const facebook = ref<string>("");
        const instagram = ref<string>("");
        const linkedin = ref<string>("");
        const youtube = ref<string>("");
        const perfilPhoto = ref<string>("");


        const email = ref<string>("");
        const day_name = ref<string>("");
        const paymentMethod = ref<'CLINIC' | 'prepaid'>('CLINIC');
        const selectedSpecialists = ref<Specialist_dto[]>([]);
         const selectedPrepagadaList = ref<Specialist_dto[]>([]);
        const removeSpecialist = (index: number) => {
            selectedSpecialists.value.splice(index, 1);
        };
        const removePrepagada = (index:number)=>{
            selectedPrepagadaList.value.splice(index,1)
        }
        const select_service = ref<ServicesDtoBody | null>(null);

        const funtion_select_service = (servicesDto: ServicesDtoBody) => {
            select_service.value = servicesDto
            set_Modal('put_service')
        }

        watch([select_shedule, day], ([newSelectShedule, newDay]) => {
            const name_day = EsgetDayOfWeekName(newDay)

            if (select_shedule.value != null) {
                const search_shedule: Get_shedule_dto = {
                    officeId: String(newSelectShedule?.id),
                    day: name_day as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
                };
                day_name.value = name_day as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
                store_professional.get_shedules_office(search_shedule)
            }
        });
        const fetchSchedules = () => {
            const name_day = EsgetDayOfWeekName(day.value);
            if (select_shedule.value?.id) {
                const search_shedule: Get_shedule_dto = {
                    officeId: select_shedule.value?.id,
                    day: name_day as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"
                };
                store_professional.get_shedules_office(search_shedule);
            }
        };
        const handleSelectSpecialists = (event: Event) => {
            const target = event.target as HTMLSelectElement;
            const selectedId = target.value;
            const specialist = optionsSpecialist.value.find(s => s.id === selectedId);

            if (specialist && !selectedSpecialists.value.some(s => s.id === specialist.id)) {
                selectedSpecialists.value.push(specialist);
            }
        };

        const handleSelectPrepagadalist = (event: Event) => {
            const target = event.target as HTMLSelectElement;
            const selectedId = target.value;
            const specialist = optionsPrepago.value.find(s => s.id === selectedId);

            if (specialist && !selectedPrepagadaList.value.some(s => s.id === specialist.id)) {
                selectedPrepagadaList.value.push(specialist);
            }
        };
        const addAction = () => {
            if (writeAction.value.trim()) {
                actions.value = [...actions.value, writeAction.value]; // ✅ Esto es reactivo
                writeAction.value = '';
            }
        };
        const removeActionByIndex = (index: number) => {
            actions.value.splice(index, 1);
        };
        const modals = reactive({
            add_adress: false,
            add_services: false,
            put_service: false,
            add_shedule_office: false
        });
        const set_Modal = (modal: keyof typeof modals) => {
            modals[modal] = !modals[modal];
        };
        const handleImageUploadmulti = async (event: Event) => {
            const files = (event.target as HTMLInputElement).files;
            if (!files || files.length === 0) return;

            const lastFile = files[files.length - 1]; // 📌 Obtiene el último archivo agregado

            const formData = new FormData();
            formData.append("file", lastFile);

            try {
                const response = await axios.post("/files/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                const url_image = response.data.url
                await axios.post("/partner-photos", { url: url_image });
                await store_professional.get_user_profesional_detail();
                toast.success("La imagen subió correctamente.")
            } catch (error) {

                alert("Error al subir la imagen.");
                toast.error("Error al subir la imagen")
            }


        };
        const delete_user = async () => {
            const result = await Swal.fire({
                title: "¡Alerta!",
                text: "¿Estás seguro de que quieres eliminar mi usuario?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "var(--blue-1)",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí",
                cancelButtonText: "Cancelar"
            });
        }



        const deleteImgageMulti = async (id: string) => {
            try {
                const result = await Swal.fire({
                    title: "¡Alerta!",
                    text: "¿Estás seguro de que quieres eliminar esta imagen?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "var(--blue-1)",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí",
                    cancelButtonText: "Cancelar"
                });

                if (result.isConfirmed) {
                    const delete_url = `/partner-photos/${id}`;
                    const response = await axios.delete(delete_url);

                    if (response.status === 200) { // Verifica `status`, no `response.data.status`
                        toast.success("Imagen eliminada.");

                        await store_professional.get_user_profesional_detail();
                    } else {
                        toast.error("Error al eliminar la imagen.");
                    }
                }
            } catch (error) {
                console.error("Error al eliminar la imagen:", error);
                toast.error("No se pudo borrar la imagen.");
            }
        };

        const restrictToInteger = (event: Event) => {
            const input = event.target as HTMLInputElement;
            let value = input.value;

            // Remove non-digit characters and ensure it's a valid integer
            value = value.replace(/[^0-9]/g, "");

            // Convert to number and update v-model
            experience.value = value ? parseInt(value, 10) : null;

            // Update the input field to reflect the cleaned value
            input.value = experience.value?.toString() ?? "";
        }

        const delete_service = async (service: ServicesDtoBody) => {
            try {
                const result = await Swal.fire({
                    title: "¡Alerta!",
                    text: `¿Estás seguro de que quieres eliminar el servicio ${service.name}?`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "var(--blue-1)",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí",
                    cancelButtonText: "Cancelar"
                });

                if (result.isConfirmed) {
                    const delete_url = `/services/${service.id}`;
                    const response = await axios.delete(delete_url);

                    if (response.status === 200) { // Verifica `status`, no `response.data.status`
                        toast.success("Servicio eliminada.");
                        await store_professional.get_user_profesional_detail();
                    } else {
                        toast.error("Error al eliminar el servicio");
                    }
                }
            } catch (error) {
                console.error("Error al eliminar el servicio:", error);
                toast.error("No se pudo borrar el servicio.");
            }
        }
        const pdf_funtion = () => {
            toast.success("Gracias por enviarnos tu información. En 24 a 48 horas estará activo, después de la revisión que hará el equipo de doc visual ");
        }

        const imageUrl = computed(() => perfilPhoto.value ? `${perfilPhoto.value}` : null);

        const optionsSpecialist = computed<{ id: string; name: string; status: string }[]>(() => store_professional.special ?? []);
        const optionsPrepago = computed <{ id: string; name: string; status: string }[]>(()=>store_professional.prepago ?? []);
        const update_user = async () => {
            try {
                const data: user_professional_body_dto = {
                    names: name.value,
                    lastnames: lastname.value,
                    document: document.value,
                    description: description.value,
                    facebook: facebook.value,
                    instagram: instagram.value,
                    linkedin: linkedin.value,
                    perfilPhoto: perfilPhoto.value,
                    phone: phone.value,
                    web: web.value,
                    title: title.value,
                    youtube: youtube.value,
                    specialists: selectedSpecialists.value,
                    prepagadas:selectedPrepagadaList.value,
                    type_of_payment: paymentMethod.value,
                    actions: actions.value,
                    experience: experience.value !== null ? Math.floor(experience.value) : 0,
                };

                await store_professional.update_user_professional(data);
                componentKey.value++;

                await Swal.fire({
                    title: "Gracias",
                    text: "Por enviarnos tu informacion en 24 a 48 horas estara activo, despues de la revisión que hara el equipo de DocVisual.",
                    icon: "success",
                    confirmButtonColor: "var(--blue-1)",
                    confirmButtonText: "OK"
                });
                //update data dataEdit
                dataEdit.description = description.value;
                dataEdit.phone = phone.value;
                dataEdit.title = title.value;
                dataEdit.document = document.value;
                dataEdit.facebook = facebook.value;
                dataEdit.instagram = instagram.value;
                dataEdit.linkedin = linkedin.value;
                dataEdit.web = web.value;
                experience.value != null && (dataEdit.experience = experience.value);
                dataEdit.actions = actions.value;
            } catch (error) {
                console.error("Error al actualizar el usuario:", error);
                toast.error("Error al actualizar el usuario");
            }
        };
        const update_user2 = async () => {
            try {
                const data: user_professional_body_dto = {
                    names: name.value,
                    lastnames: name.value,
                    document: document.value,
                    description: description.value,
                    facebook: facebook.value,
                    instagram: instagram.value,
                    linkedin: linkedin.value,
                    perfilPhoto: perfilPhoto.value,
                    phone: phone.value,
                    web: web.value,
                    title: title.value,
                    youtube: youtube.value,
                    specialists: selectedSpecialists.value,
                    type_of_payment: paymentMethod.value,
                    actions: actions.value,
                    experience: experience.value !== null ? Math.floor(experience.value) : 0,
                };

                await store_professional.update_user_professional(data);
                await store_auth.refreshToken();
                componentKey.value++;

                await Swal.fire({
                    title: "Gracias",
                    text: "Su informacion se actualizo exitosamente.",
                    icon: "success",
                    confirmButtonColor: "var(--blue-1)",
                    confirmButtonText: "OK"
                });
            } catch (error) {
                console.error("Error al actualizar el usuario:", error);
                toast.error("Error al actualizar el usuario");
            }
        };

        const update_active_schedules = async () => {
            if (select_shedule.value?.id && shedules_datas_office.value.length) {
                const all_items: SheduleItemCompleteId[] = shedules_datas_office.value.map(value => {
                    return {
                        active: value.active,
                        id: value.id
                    }
                })
                const request: PutSheduleItemsOfficeDto = {
                    officeId: select_shedule.value?.id,
                    items: all_items
                }
                const response = await axios.put('/reservations', request)
                if (response.data.status === 200) {
                    toast.success("Se guardó correctamente la habilitación de horarios. ", {
                        position: "top-center"
                    })

                } else {
                    toast.error("Ocurrió un error inesperado.")
                }


            }



        }
        const goToTerms = () => {
            window.open('/terms', '_blank');
        };
        function areArraysEqual(arr1: string[], arr2: string[]): boolean {

            if (arr1.length !== arr2.length) return false;
            return arr1.every((val, index) => val === arr2[index]);
        }
        const isModified = computed(() => {
            return !areArraysEqual(actions.value, dataEdit.actions);
        });
        const reloadUserDetai = async () => {
            await store_professional.get_user_profesional_detail();
        }
        return {
            selectedPrepagadaList,
            handleSelectPrepagadalist,
            optionsPrepago,
            reloadUserDetai,
            lastname,
            isModified,
            areArraysEqual,
            dataEdit,
            goToTerms,
            update_user2,
            experience,
            restrictToInteger,
            componentKey,
            idUser,
            select_service,
            funtion_select_service,
            delete_user,
            update_active_schedules,
            toggleActive,
            day_name,
            pdf_funtion,
            fetchSchedules,
            shedules_datas_office,
            select_shedule,
            store_professional,
            delete_service,
            services,
            deleteImgageMulti,
            photosPanel,
            handleImageUploadmulti,
            removeActionByIndex,
            writeAction,
            actions,
            addAction,
            offices,
            handleSelectSpecialists,
            description,
            update_user,
            modals,
            removePrepagada ,
            removeSpecialist,
            selectedSpecialists,
            store_auth,
            title,
            name,
            imageUrl,
            perfilPhoto,
            actiontext: '' as string | '',
            optionsSpecialist,
            isDragging: ref(false),
            errorMessage: '' as string,
            email,
            document,
            phone,
            set_Modal,
            payment: '',
            social: {
                facebook,
                instagram,
                linkedin,
                youtube
            },
            web,
            costo: '',
            agenda: null,
            day,
            times: [{ hour: 8, minutes: 0 }, { hour: 9, minutes: 0 }, { hour: 10, minutes: 0 }, { hour: 11, minutes: 0 }, { hour: 12, minutes: 0 }, { hour: 13, minutes: 0 }, { hour: 14, minutes: 0 }, { hour: 15, minutes: 0 }, { hour: 16, minutes: 0 }, { hour: 17, minutes: 0 }, { hour: 18, minutes: 0 }, { hour: 19, minutes: 0 }],
            timesSelects: [] as { hour: number; minutes: number }[],
            paymentMethod,

        }
    },
    methods: {

        set_Modal(modal: keyof typeof this.modals) {
            this.modals[modal] = !this.modals[modal];
        },

        formatTime(hour: number, minutes: number) {
            let period = hour >= 12 ? "PM" : "AM";
            let formattedHour = hour % 12 || 12; // Convierte 0 y 12 en 12
            let formattedMinutes = minutes.toString().padStart(2, "0"); // Asegura dos dígitos

            return `${formattedHour}:${formattedMinutes} ${period}`;
        },
        selectTimes(hour: number, minutes: number) {
            const data = { hour: hour, minutes: minutes }
            const index = this.timesSelects.findIndex(
                t => t.hour === hour && t.minutes === minutes
            );
            if (index === -1) {
                this.timesSelects.push(data); // Si no existe, lo agrega
            } else {
                this.timesSelects.splice(index, 1); // Si ya existe, lo elimina
            }
        },
        isSelected(hour: number, minutes: number): boolean {
            return this.timesSelects.some(t => t.hour === hour && t.minutes === minutes);
        },
        getNamethree(number: number) {
            return getDayOfWeekName(number).slice(0, 3);
        },
        formatPrice(price: number) {
            return new Intl.NumberFormat('es-CO').format(price);
        },
        async handleImageUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const response = await axios.post("/files/upload", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });

                    this.imageUrl = response.data.url.startsWith("http")
                        ? response.data.url
                        : `${response.data.url}`;
                    this.perfilPhoto = response.data.url

                } catch (error) {
                    console.error("Error al subir la imagen:", error);
                    alert("Error al subir la imagen.");
                }
            }
        }
    },

}
</script>
<template>
    <div class="w-full font font-poppins bg-gray-100">
        <!-- modals -->
        <!-- @Modal add adress -->
        <div v-if="modals.add_adress" class="fixed inset-0 bg-black/80   flex items-center justify-center z-50"
            @click.self="set_Modal('add_adress')">
            <div class="bg-white p-6 rounded-lg shadow-lg w-[90%]  md:w-[60%]   h-[80%] z-20">
                <Add_adress @close="   set_Modal('add_adress');" />
            </div>
        </div>
        <!-- modal service -->
        <div v-if="modals.put_service && select_service != null"
            class="fixed inset-0 bg-black/80   flex items-center justify-center z-50"
            @click.self="set_Modal('put_service')">
            <div class="bg-white p-6 rounded-lg shadow-lg        z-20">
                <Put_service @close="set_Modal('put_service')" :service="select_service"
                    @update_user="store_professional.get_user_profesional_detail()" />
            </div>
        </div>
        <!-- //// -->
        <!-- Modal crear Horarios -->
        <div v-if="modals.add_shedule_office" class="fixed inset-0 bg-black/80   flex items-center justify-center z-50"
            @click.self="set_Modal('add_shedule_office')">
            <div class="bg-white p-6 rounded-lg shadow-lg  z-20">
                <Add_shedule :idOfficine="select_shedule?.id" :fetch-schedules="fetchSchedules" :office_day="day_name"
                    @close="set_Modal('add_shedule_office')" />
            </div>
        </div>



        <div class="w-[100%]   py-12 sm:w-[90%] mx-auto justify-center sm:justify-between">
            <div class="flex    w-[95%] gap-6 items-center mb-8 mx-auto">
                <h1 class="text-gray-700  font-medium" for="username">Instructivo para crear el perfil accede aca:</h1>
                <div class=" bg-[var(--blue-1)] text-white rounded-xl cursor-pointer  shadow-2xs ">
                    <h1 class="px-8  py-2" @click="goToTerms">Descargar PDF</h1>
                </div>
            </div>
            <div class="w-full  sm:flex   ">

                <div class="sm:w-[50%]">

                    <div class="mb-5 w-[90%] mx-auto">
                        <label class="text-gray-700 font-medium  " for="username">Nombres</label>

                        <input v-model="name" type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                    </div>
                    <div class="mb-5 w-[90%] mx-auto">
                        <label class="text-gray-700 font-medium  " for="username">Apellidos</label>

                        <input v-model="lastname" type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                    </div>
                    <div class="mb-5 w-[90%] mx-auto">
                        <label class="text-gray-700 font-medium  " for="username">Correo electrónico</label>

                        <input v-model="email" type="text" readonly
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                    </div>
                    <div class="mb-5 w-[90%] mx-auto">
                        <label class="text-gray-700  font-medium  " for="username">Cédula</label>

                        <input v-model="document" type="text" readonly
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                    </div>
                    <div class="mb-5 w-[90%] mx-auto">
                        <h1 class="font-medium">Foto de Perfil</h1>
                        <label for="fileInput"
                            class="mt-6 w-fit block text-sm font-medium  text-white bg-[var(--blue-1)] px-4 py-2 rounded-md cursor-pointer hover:bg-blue-500">
                            Añadir Foto
                        </label>
                        <!-- Input oculto -->
                        <input type="file" id="fileInput" ref="fileInput" accept="image/*" @change="handleImageUpload"
                            class="hidden">

                        <div v-if="imageUrl" class="my-6">

                            <img :src="imageUrl" alt="Imagen seleccionada" class="w-32 h-auto rounded-lg shadow-md">
                        </div>
                    </div>

                    <div class="w-[90%] mx-auto">
                        <div class="mb-5 ">
                            <h1 class="  cursor-pointer font-medium my-3">Especialidades</h1>
                            <div class="w-full  border bg-white border-gray-200 rounded-xl">

                                <select @change="handleSelectSpecialists($event)"
                                    class=" w-[98%]  bg-transparent m-auto  p-3">
                                    <option value="" selected disabled>Seleccione una opción</option>
                                    <option v-for="specialist in optionsSpecialist" :key="specialist.id"
                                        :value="specialist.id">
                                        {{ specialist.name }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 my-4">
                            <span v-for="(specialist, index) in selectedSpecialists" :key="index"
                                class="px-3 py-1 bg-[var(--blue-1)] text-white rounded-md flex items-center gap-2">
                                {{ specialist.name ?? '' }}
                                <button @click="removeSpecialist(index)"
                                    class="text-white bg-red-500 px-1 rounded">✖</button>
                            </span>
                        </div>


                    </div>
                 
                    <div class="mb-5 w-[90%] mx-auto">
                        <label class="text-gray-700  font-medium " for="emailAddress">Sobre mi</label>
                        <textarea id="actiontext" v-model="description" rows="4" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md 
                               
                               focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 
                               focus:outline-none focus:ring resize-none" placeholder="Escribe aquí..."></textarea>
                        <h1 v-if="description !== dataEdit.description" class="text-[var(--blue-2)]">* Datos pendientes
                            por guardar.</h1>
                    </div>

                    <div class="mb-5 w-[90%] mx-auto">
                        <label class="text-gray-700 font-medium  " for="username">Celular</label>

                        <input v-model="phone" type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                        <h1 v-if="phone !== dataEdit.phone" class="text-[var(--blue-2)]">* Datos pendientes por guardar.
                        </h1>
                    </div>

                    <div class="mb-5 w-[90%] mx-auto">
                        <h1 class="cursor-pointer font-medium my-3">Tipos de pagos</h1>
                        <div class="flex w-full justify-between items-center gap-4 my-5">
                            <!-- Opción 1 -->
                            <label class="flex items-center gap-2 cursor-pointer w-full">
                                <input v-model="paymentMethod" type="radio" value="CLINIC" class="hidden peer">
                                <div
                                    class="w-5 h-5 border-2 border-gray-200 rounded-full flex items-center justify-center bg-gray-200 peer-checked:bg-[var(--blue-1)]">
                                </div>
                                <span class="text-gray-700 w-full">Pago en consultorio</span>
                            </label>

                            <!-- Opción 2 -->
                            <label class="flex items-center gap-2 cursor-pointer w-full">
                                <input v-model="paymentMethod" type="radio" value="prepaid" class="hidden peer">
                                <div
                                    class="w-5 h-5 border-2 border-gray-200 rounded-full flex items-center justify-center bg-gray-200 peer-checked:bg-[var(--blue-1)]">
                                </div>
                                <span class="text-gray-700 w-full">Pago anticipado</span>
                            </label>
                        </div>
                    </div>
                    <!-- Vista previa de la imagen -->
                </div>
                <div class="sm:w-[50%] ">
                    <div class="mb-5 w-[90%] mx-auto">
                        <label class="text-gray-700  " for="emailAddress">Años de experiencia</label>
                        <input v-model="experience" type="number" min="0" step="1"
                            class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                            placeholder="Años de experiencia" @input="restrictToInteger" />
                        <h1 v-if="experience !== dataEdit.experience" class="text-[var(--blue-2)]  ">* Datos pendientes
                            por guardar.
                        </h1>
                    </div>
                    <div class="mb-5 w-[90%] mx-auto">
                        <label class="text-gray-700  " for="emailAddress">Principales campos de acción</label>
                        <div class="flex items-center space-x-2 w-full">
                            <input v-model="writeAction" type="text"
                                class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                                placeholder="Escribe una acción..." />
                            <button @click="addAction"
                                class="px-4 py-2 text-white bg-[var(--blue-1)] rounded-md hover:bg-blue-600 focus:outline-none">
                                Agregar
                            </button>
                        </div>

                        <ul class="mt-4 list-disc list-inside mb-10">
                            <li v-for="(action, index) in actions" :key="index"
                                class="flex justify-between items-center p-2 bg-gray-200 rounded-md mb-2">
                                {{ action }}
                                <button @click="removeActionByIndex(index)"
                                    class="text-red-500 hover:text-red-700">✖</button>
                            </li>
                        </ul>
                        <h1 v-if="isModified" class="text-[var(--blue-2)] pl-3">*
                            Datos pendientes
                            por guardar.
                        </h1>

                    </div>

                    <div class="mb-5 w-[90%] mx-auto">
                        <div class="flex w-full  text-[10px] sm:text-base justify-between  mb-6">
                            <label class="text-gray-700 font-medium" for="emailAddress">Ubicación Consultorio</label>
                            <button
                                class="bg-[var(--blue-1)] text-white px-4 py-2 rounded-md hover:bg-sky-600 cursor-pointer"
                                @click="set_Modal('add_adress')">
                                Nuevo consultorio
                            </button>
                        </div>
                        <div v-for="(data_office, index) in offices" :key="index"
                            class="w-full border border-gray-200 bg-white mb-6 rounded-2xl ">
                            <div class="w-full p-4">
                                <h1 class="font-medium mb-3">{{ data_office.title }}</h1>
                                <h1 class="font-light text-[8px] sm:text-xs">{{ data_office.description }}</h1>
                            </div>
                        </div>
                    </div>
                       <div class="w-[90%] mx-auto">
                        <div class="mb-5 ">
                            <h1 class="  cursor-pointer font-medium my-3">Convenios o prepagadas</h1>
                            <div class="w-full  border bg-white border-gray-200 rounded-xl">

                                <select @change="handleSelectPrepagadalist($event)"
                                    class=" w-[98%]  bg-transparent m-auto  p-3">
                                    <option value="" selected disabled>Seleccione una opción</option>
                                    <option v-for="specialist in optionsPrepago" :key="specialist.id"
                                        :value="specialist.id">
                                        {{ specialist.name }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 my-4">
                            <span v-for="(specialist, index) in selectedPrepagadaList" :key="index"
                                class="px-3 py-1 bg-[var(--blue-1)] text-white rounded-md flex items-center gap-2">
                                {{ specialist.name ?? '' }}
                                <button @click="removePrepagada(index)"
                                    class="text-white bg-red-500 px-1 rounded">✖</button>
                            </span>
                        </div>


                    </div>


                </div>
            </div>
        </div>
        <div class="text-xs">


            <!-- Zona de arrastrar y soltar -->
            <div class="drop-zone w-[90%] m-auto border border-gray-300 bg-white  p-4  rounded-2xl"
                :class="{ 'drop-active': isDragging }" @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false" @drop="handleImageUploadmulti">
                <div class="flex justify-between">
                    <h1>Fotografías <span class="text-gray-400">3 fotografías mínimo de tamaño maximo 1100
                            pixeles</span></h1>
                    <!-- <button @click="handleImageUploadmulti"
                        class="bg-[var(--blue-1)] text-white p-1 px-5 rounded-2xl cursor-pointer">Añadir foto</button> -->
                </div>
                <hr class="w-full  my-3" />


                <div class="min-h-64 bg-gray-200 flex items-center justify-center relative p-4 rounded-lg">
                    <!-- Si no hay imágenes, muestra el icono -->
                    <label v-if="photosPanel.length === 0"
                        class="flex flex-col items-center justify-center cursor-pointer text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span class="mt-2 text-sm">Añadir imágenes</span>
                    </label>
                    <input type="file" multiple accept="image/*" @change="handleImageUploadmulti"
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

                    <!-- Galería de imágenes -->
                    <div v-if="photosPanel.length > 0" class="gallery flex flex-wrap gap-2 mt-2 w-full">
                        <div v-for="(image, index) in photosPanel" :key="index" class="relative w-[20%] h-auto">
                            <!-- Imagen -->
                            <img :src="image.url" alt="Imagen seleccionada"
                                class="w-full h-full object-cover rounded-lg shadow-md" />

                            <!-- Botón de eliminar -->
                            <button @click="deleteImgageMulti(image.id)"
                                class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg hover:bg-red-700">
                                <svg fill="#ffffff" class="w-5 h-auto" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z" />
                                </svg>

                            </button>
                        </div>
                    </div>

                </div>


            </div>

            <div class="grid grid-cols-1 gap-6   sm:grid-cols-2   py-12 w-[90%] m-auto">
                <div class=" w-full    ">
                    <div class="flex w-full gap-3 justify-between mb-6  ">
                        <label class="text-gray-700 font-medium" for="emailAddress">Servicios</label>
                        <button
                            class="bg-[var(--blue-1)] text-white px-4 py-2 rounded-md hover:bg-sky-600 cursor-pointer h-fit"
                            @click="set_Modal('add_services')">
                            Nuevo servicio
                        </button>
                    </div>
                    <Modal_Float :model-value="modals.add_services" :width-percent="80" :height-percent="80"
                        @click-outside="() => set_Modal('add_services')" v-if="modals.add_services">
                        <Add_servicess v-if="modals.add_services" @close="reloadUserDetai(); set_Modal('add_services')"
                            @update_user="() => console.log('hola')" />
                    </Modal_Float>
                    <ul class="mt-4 list-disc list-inside mb-10">
                        <li v-for="(service, index) in services" :key="index"
                            class="flex justify-between items-center p-2 bg-gray-200 rounded-md mb-2 ">
                            <p v-if="service.name === 'CONSULTA'" class="mx-2"> Consulta seguimiento {{ `: $
                                ${formatPrice(service.price)}` }}
                            </p>
                            <p v-else-if="service.name === 'PRIMERA_CONSULTA'" class="mx-2"> Primera consulta {{ `:
                                $
                                ${formatPrice(service.price)}` }}</p>
                            <p v-else class="mx-2"> {{ `${service.name}: $ ${formatPrice(service.price)}` }}</p>

                            <button class="text-red-500 hover:text-red-700 cursor-pointer"
                                @click="funtion_select_service(service)">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-auto"
                                    fill="current">
                                    <path
                                        d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
                                </svg>

                            </button>
                        </li>
                    </ul>

                </div>



                <div class="w-full">
                    <label class="text-gray-700  font-normal mb-7 text-base" for="emailAddress">Redes Sociales </label>
                    <div class="w-full  border border-gray-100 rounded-2xl bg-white">
                        <div class="flex items-center  justify-between p-3   space-x-3 ">
                            <h1 class="whitespace-nowrap">Instagram:</h1>
                            <input v-model="social.instagram.value" type="text"
                                class="block min-w-[80%] px-4 py-1 text-gray-700  border  border-gray-200 bg-gray-100 focus:border-[var(--blue-1)] focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                        </div>
                        <h1 v-if="social.instagram.value !== dataEdit.instagram" class="text-[var(--blue-2)] pl-3">*
                            Datos pendientes por guardar.
                        </h1>
                        <div class="flex items-center justify-between p-3  space-x-3">
                            <h1 class="whitespace-nowrap">Linkedin:</h1>
                            <input v-model="social.linkedin.value" type="text"
                                class="block min-w-[80%] px-4 py-1 text-gray-700 bg-gray-100 border border-gray-200 focus:border-[var(--blue-1)] focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                        </div>
                        <h1 v-if="social.linkedin.value !== dataEdit.linkedin" class="text-[var(--blue-2)] pl-3">*
                            Datos pendientes por guardar.
                        </h1>
                        <div class="flex items-center justify-between p-3   space-x-3">
                            <h1 class="whitespace-nowrap">Facebook:</h1>
                            <input v-model="social.facebook.value" type="text"
                                class="block min-w-[80%] px-4 py-1 text-gray-700 bg-gray-100 border border-gray-200 focus:border-[var(--blue-1)] focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                        </div>
                        <h1 v-if="social.facebook.value !== dataEdit.facebook" class="text-[var(--blue-2)] pl-3">*
                            Datos pendientes por guardar.
                        </h1>
                        <div class="flex items-center justify-between p-3   space-x-3">
                            <h1 class="whitespace-nowrap">Youtube:</h1>
                            <input v-model="social.youtube.value" type="text"
                                class="block min-w-[80%] px-4 py-1 text-gray-700 bg-gray-100 border border-gray-200 focus:border-[var(--blue-1)] focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                        </div>
                        <h1 v-if="social.youtube.value !== dataEdit.youtube" class="text-[var(--blue-2)] pl-3">* Datos
                            pendientes por guardar.
                        </h1>
                        <div class="flex items-center justify-between p-3   space-x-3">
                            <h1 class="whitespace-nowrap">Página web:</h1>
                            <input v-model="web" type="text" placeholder="Pagina web"
                                class="block min-w-[80%] px-4 py-1 text-gray-700 bg-gray-100 border border-gray-200 focus:border-[var(--blue-1)] focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                        </div>
                        <h1 v-if="web !== dataEdit.web" class="text-[var(--blue-2)] pl-3 pb-2">* Datos pendientes por
                            guardar.
                        </h1>
                    </div>
                </div>


            </div>
            <!-- vista previa perfil profecional -->
            <div class="w-[90%] m-auto mb-20">
                <div class="w-full flex justify-between mb-3">
                    <h1 class="text-base  ">Vista previa</h1>

                    <div class="flex">
                        <h1 class="mr-2 my-auto">Por favor, dale ACTUALIZAR a cada cambio para que tu información quede
                            guardada.</h1>
                        <div @click="update_user2"
                            class="py-2 bg-[var(--blue-1)] cursor-pointer rounded-2xl w-fit px-2 font-bold text-white">
                            Actualizar</div>
                    </div>
                </div>

                <div class="w-full max-h-[50vh] border border-gray-300 overflow-auto">
                    <SpecialistDetail :id="idUser" @update-data="update_user" :key="componentKey" :modo-vista="true" />
                </div>
            </div>
            <div class="w-[90%] m-auto flex flex-wrap justify-between mt-3 sm:flex-grow mb-10">
                <h1 class="w-fit whitespace-nowrap text-base">Horarios de Agenda</h1>
                <select v-model="select_shedule"
                    class="border border-gray-200 p-2   rounded-xl mx-6   m-auto  text-xs bg-white w-[40%]">
                    <option v-for="(office, index) in offices" :key="index" :value="office">
                        {{ office.title }}
                    </option>
                </select>
                <div v-for="num in 7" :key="num" class="px-2  text-base cursor-pointer  m-auto" @click="day = num"
                    :class="{
                        'text-[var(--blue-1)]': num === day,
                        'text-black': num !== day
                    }">
                    {{ getNamethree(num) }}
                </div>

            </div>

            <div v-if="shedules_datas_office.length"
                class="w-[90%] m-auto flex flex-wrap justify-between gap-5     mt-1 ">
                <div v-for="(data, index) in shedules_datas_office" :key="index"
                    class="w-[15%] p-2 py-4    border-gray-200 mb-3 rounded-2xl cursor-pointer text-[8px] md:text-xs"
                    :class="{ 'bg-[var(--blue-1)] text-white': data.active, 'bg-gray-200 text-white': !data.active }"
                    @click="toggleActive(index)">
                    <h1 class="w-full text-center">{{ data.openTime }}</h1>
                </div>
                <div class="w-full justify-start flex gap-2">
                    <button
                        class=" py-2 px-4  bg-gray-200 text-black rounded-xl cursor-pointer flex   gap-2 justify-items-center items-center"
                        @click="set_Modal('add_shedule_office')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-auto  " viewBox="0 -960 960 960"
                            fill="#000000">
                            <path
                                d="M360-600v-80h360v80H360Zm0 120v-80h360v80H360Zm120 320H200h280Zm0 80H240q-50 0-85-35t-35-85v-120h120v-560h600v361q-20-2-40.5 1.5T760-505v-295H320v480h240l-80 80H200v40q0 17 11.5 28.5T240-160h240v80Zm80 0v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T903-300L683-80H560Zm300-263-37-37 37 37ZM620-140h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
                        </svg>
                        Modificar intervalos de tiempos.

                    </button>
                    <button
                        class="py-2 px-4 border border-[var(--blue-1)]   text-black  rounded-xl  flex   gap-2 justify-items-center items-center cursor-pointer"
                        @click="update_active_schedules">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-auto  " viewBox="0 -960 960 960"
                            fill="#000000">
                            <path
                                d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z" />
                        </svg>
                        Guardar horarios activos
                    </button>
                </div>

            </div>

            <div v-if="shedules_datas_office.length === 0 && select_shedule != null"
                class="w-[90%] m-auto flex flex-wrap justify-center mt-3">
                <div class="w-full border border-gray-200 h-96 rounded-2xl flex items-center justify-center">
                    <button class="flex flex-col items-center text-gray-500 hover:text-[var(--blue-1)]"
                        @click="set_Modal('add_shedule_office')">
                        <!-- Ícono SVG -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" class="w-12 h-12">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span class="mt-2 text-sm font-medium">Agregar horario</span>
                    </button>
                </div>
            </div>

            <div class=" flex justify-end w-[90%] m-auto">
                <button
                    class="border border-[var(--blue-1)]   py-2 px-8   my-8 rounded-xl text-gray-500 flex items-center gap-2 cursor-pointer"
                    @click="delete_user">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-auto w-5 text-gray-500" viewBox="0 -960 960 960"
                        fill="currentColor">
                        <path
                            d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
                    </svg>
                    <h1>Eliminar usuario</h1>
                </button>
                <button class="bg-[var(--blue-1)] py-2 px-8 ml-8 my-8 rounded-xl text-white cursor-pointer"
                    @click="update_user">Guardar</button>
            </div>
        </div>
    </div>
</template>