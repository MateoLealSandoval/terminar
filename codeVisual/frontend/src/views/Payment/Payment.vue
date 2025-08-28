<script setup lang="ts">
import Colors from '@/common/Colors.vue';
import Navbar from '@/Modules/Home/Navbar.vue';
import { useAuthStore, useProfesionalDetailStore, useUserStore } from '@/store';
import { usePaymentStore } from '@/store/payment.store';
import { formatTwoDigits, getMonthNameEs } from '@/utils/DateUtils';
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect } from 'vue';
import { toast } from 'vue3-toastify';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import Phones_contry from '@/common/phones_contry.json'
import type { create_reservation_dto } from '@/dto/payment/create_reservation.dto';
import { formatDateTimeEs } from '@/utils/DateUtils';
const store_pay = usePaymentStore();

const idProfeccional = computed(() => store_pay.id_profeccional);
const auth_store = useAuthStore();
const user_store = useUserStore();
const user_professional_detail_store = useProfesionalDetailStore();

const router = useRouter();
const service = computed(() => store_pay.select_service);
const phone = ref('');
const names = ref('');
const email = ref('');
const shedule = computed(() => store_pay.select_shedule);
const date_user = ref('');
const payment_eps = computed(() => store_pay.select_payment)
const formatDate = (
    year: number | null | undefined,
    month: number | null | undefined,
    day: number | null | undefined
): string => {
    if (year == null || month == null || day == null) return "";

    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`; // ← CAMBIO: guiones en lugar de slashes
};

onMounted(async () => {
    await user_store.getDataUser();
    console.log("papapa", "asasass");
    date_user.value = formatDate(
        user_store.dataUser?.birthYear ?? null,
        user_store.dataUser?.birthMonth ?? null,
        user_store.dataUser?.birthDay ?? null
    );

    // Solo validamos y redirigimos si no hay usuario válido
    console.log("user_store.dataUser", user_store.dataUser);

    if (!auth_store.user || auth_store.user.role !== "USER" || auth_store.user === null) {
        Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: "Debes iniciar sesión como usuario para hacer reservas.",
            confirmButtonText: "OK",
        }).then(() => {
            router.push("/auth");
        });
    }

});

watchEffect(() => {
    // 👉 Datos del usuario
    const dataUser = user_store.dataUser;
    const user = auth_store.user;

    if (dataUser) {

        phone.value = dataUser.phone || '';
        date_user.value = formatDate(
            dataUser.birthYear ?? null,
            dataUser.birthMonth ?? null,
            dataUser.birthDay ?? null
        );

    }

    if (user) {
        names.value = user.names || '';
        email.value = user.email || '';
        if (user.role !== "USER") {
            Swal.fire({
                icon: "warning",
                title: "Acceso denegado",
                text: "Debes iniciar sesión como usuario para hacer reservas.",
                confirmButtonText: "OK",
            }).then(() => {
                router.push("/auth");
            });
        }
    }

    // 👉 Datos del profesional
    if (idProfeccional.value !== '') {
        user_professional_detail_store.getProfessional(idProfeccional.value);
    }
});


const selectedCountry = computed(() =>
    countryList.value.find(c => c.phoneCode === selectedPhoneCode.value)
);


const countryList = ref(Phones_contry);
const selectedPhoneCode = ref('+57');
const lastnames = computed(() => auth_store.user?.lastnames || '');


const confirmEmail = ref('');


onUnmounted(() => {

    user_professional_detail_store.clear_data();
});

const data_user = computed(() => user_professional_detail_store.profesional_detail);
const eps = computed(() => store_pay.select_payment);
const office = computed(() => store_pay.select_office);


const otherText = ref('');
const firstTimeVisit = ref<boolean | null>(null); // Estado de la selección
const coment = ref('');
const textConfirm =  ref('');
const set_reservation_state = (number: number) => {
    state_resevation.value = number
}

const check_data_shedule = async () => {
    const errorMessages: string[] = [];

    if (firstTimeVisit.value === null) {
        errors.firstvisit = 'Requiere confirmar si es tu primera visita';
        errorMessages.push(errors.firstvisit);
        errors.active = true;
    } else {
        errors.firstvisit = '';
    }


    if (errors.firstvisit === '') {

        set_reservation_state(1)
    } else {

        await Swal.fire({
            icon: 'error',
            title: 'Datos incompletos',
            text: errorMessages.join('\n') + ' Por favor, completa todos los campos obligatorios correctamente.',
            confirmButtonText: 'OK',
            confirmButtonColor: "var(--blue-1)"
        });
        return
    }
}
const confirmToken = async () => {
    const code = Number(inputs.value.map((input) => input.value).join(''));

    const result = await store_pay.confirm_reservation(code)
    textConfirm.value = result;
    console.log(textConfirm.value)
    if (result) {
         await Swal.fire({
            icon: 'success',
            title: 'Cita confirmada',
            text: "Cita confirmada exitosamente se te envio un resumen a tu correo electronico",
            confirmButtonText: 'OK',
            confirmButtonColor: "var(--blue-1)"
        });
       
        set_reservation_state(3)
    } else {
           await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "El código de confirmación es incorrecto.",
            confirmButtonText: 'OK',
            confirmButtonColor: "var(--blue-1)"
        });
       
    }
}
const check_data_user = () => {
    const checkedForm = validateForm();
    const { valid, message } = checkedForm;
    if (!valid) {
        return Swal.fire({
            icon: 'error',
            title: 'Datos incompletos',
            text: message + ' Por favor, completa todos los campos obligatorios correctamente.',
            confirmButtonText: 'OK',
            confirmButtonColor: "var(--blue-1)"
        });
    }


    create_reservation()

}
const state_resevation = ref<number>(0);
const set_state_reservation = (Element: number) => {
    state_resevation.value = Element
}
const button_preview = () => {
    if (state_resevation.value === 0) {
        router.back();
    } else {
        state_resevation.value--;
    }
}
const filterPhoneInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    phone.value = input.value.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
};
const add_google_calendar = () => {
    if (shedule?.value?.date && office.value?.latitude && office.value.longitude) {
        const { day, month, nameday, year } = shedule.value.date;
        const openTime = shedule.value.openTime;
        const closeTime = shedule.value.closeTime
        const startTimeEND = openTime.replace(":", "") + "00"; // 063000
        const endTimeEND = closeTime.replace(":", "") + "00";
        const dateStr = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
        const startDateTime = `${dateStr}T${startTimeEND}`;
        const endDateTime = `${dateStr}T${endTimeEND}`;

        const title = encodeURIComponent(`Doc visual reserva ${office.value.title}`);
        const details = encodeURIComponent(`${textConfirm.value}`);
        const coordinates = `${office.value.latitude},${office.value.longitude}`;
        const location = encodeURIComponent(coordinates);
        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
        window.open(calendarUrl, "_blank");
    }


}
const create_reservation = async () => {

    if (
        !shedule.value?.date ||
        !shedule.value?.openTime ||
        !service.value?.price ||
        !office.value?.id ||
        !idProfeccional.value ||
        !shedule.value?.id
    ) {

        return
    }

    const [hourStr, minuteStr] = shedule.value.openTime.split(":")
    const hour = parseInt(hourStr)
    const minute = parseInt(minuteStr)

    const dateObj = new Date(Date.UTC(
        shedule.value.date.year,
        shedule.value.date.month - 1,
        shedule.value.date.day,
        hour,
        minute,
        0
    ))

    const create_reservation_dto: create_reservation_dto = {
        price: service.value.price,
        officeId: office.value.id,
        profecionalId: idProfeccional.value,
        scheduleId: shedule.value.id,
        payment: payment_eps.value?.type,
        date: dateObj.toISOString()
    }

    await store_pay.save_reservation(create_reservation_dto)
    toast.success("Reservaste tu cita exitosamente.", {
        position: 'top-center'
    })
    set_reservation_state(2)

}
const inputs = ref<HTMLInputElement[]>([]);

const handleInput = (event: Event, index: number) => {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, ''); // Permitir solo números

    if (input.value.length === 1 && inputs.value[index + 1]) {
        (inputs.value[index + 1] as HTMLInputElement).focus(); // Mover al siguiente input
    }
};

const errors = reactive({
    email: '',
    phone: '',
    date: '',
    active: false,
    firstvisit: ''
});
function validateForm() {
    let valid = true;
    const errorMessages: string[] = [];

    if (email.value.trim() === '') {
        errors.email = 'Requiere email';
        errorMessages.push(errors.email);
        valid = false;
        errors.active = true;
    } else {
        errors.email = '';
    }

    if (confirmEmail.value.trim() === '' || confirmEmail.value !== email.value) {
        errors.email = 'El correo no coincide con el confirmar correo.';
        errorMessages.push(errors.email);
        errors.active = true;
        valid = false;
    } else {
        errors.email = '';
    }
    if (!/^\d{10,}$/.test(phone.value)) {
        errors.phone = 'Teléfono inválido (mínimo 10 números) y solo números';
        errorMessages.push(errors.phone);
        errors.active = true;
        valid = false;
    } else {
        errors.phone = '';
    }

    return {
        valid,
        message: errorMessages.join('\n') // Mensajes separados por salto de línea
    };
}

</script>

<template>
    <div class="w-full">
        <Navbar />
        <div class="w-screen font font-poppins bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen"
            v-if="state_resevation === 1 || state_resevation === 0">
            <div class="w-[90%] md:w-[80%] m-auto py-20 text-base md:flex">
                <div class="w-full  md:w-1/2 " v-if="state_resevation === 0">
                    <h1 class="text-2xl mb-7 font-medium">Resumen de la Cita</h1>

                    <h2 class="font-bold mb-1">Motivo de la visita</h2>
                    <div class="w-full border border-gray-200 rounded-md mb-10 bg-white">
                        <p v-if="service?.name === 'PRIMERA_CONSULTA'" class="mx-3 p-2">Primera consulta</p>
                        <p v-else-if="service?.name === 'CONSULTA'" class="mx-3 p-2"> Consulta </p>
                        <p v-else class="mx-3 p-2">{{ service?.name }}</p>
                    </div>

                    <h2 class="font-bold mb-1">Aseguradora</h2>
                    <div class="w-full border border-gray-200 rounded-md   bg-white mb-10">
                        <p class="mx-3 p-2">{{ eps?.name }}</p>
                    </div>

                    <!-- Checkbox -->
                    <!-- <label class="font-bold   flex items-center my-10">
                        <input type="checkbox" id="myCheckbox" class="mr-2">
                        Agendo cita sin Medicina Prepagada
                    </label> -->

                    <h2 class="font-bold mb-1" v-if="eps?.type === 'SITE'">Otros</h2>
                    <input v-model="otherText" v-if="eps?.type === 'SITE'" type="text" placeholder="Otros"
                        class="block w-full px-4  py-2    text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring mb-10">

                    <!-- Radio buttons en flex -->
                    <h2 class="font-bold mb-6">¿Tienes acompañante disponible para tu
                        cita?</h2>
                    <h2 class="font-bold mb-6 text-red-400">{{ errors.firstvisit }}</h2>
                    <div class="flex items-center space-x-4">
                        <label class="flex items-center space-x-2 cursor-pointer mr-20">
                            <input type="radio" v-model="firstTimeVisit" :value="true" class="hidden">
                            <div class="w-6 h-6 border-2 border-gray-500 rounded-full flex items-center justify-center transition duration-300"
                                :class="firstTimeVisit === true ? 'border-blue-500' : ''">
                                <div v-if="firstTimeVisit === true" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                            <span class="text-gray-700">Sí</span>
                        </label>

                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" v-model="firstTimeVisit" :value="false" class="hidden">
                            <div class="w-6 h-6 border-2 border-gray-500 rounded-full flex items-center justify-center transition duration-300"
                                :class="firstTimeVisit === false ? 'border-blue-500' : ''">
                                <div v-if="firstTimeVisit === false" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                            <span class="text-gray-700">No</span>
                        </label>
                    </div>
                    <div
                        class="flex gap-2 items-center bg-[var(--blue-1)] py-2 px-8   w-fit text-white rounded-xl shadow cursor-pointer m-auto my-8">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                            fill="#ffffff">
                            <path
                                d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                        </svg>
                        <h1 class="font-bold" @click="check_data_shedule">Continuar</h1>
                    </div>

                </div>
                <div v-if="state_resevation === 1" class="w-full  md:w-1/2">
                    <h1 class="text-2xl mb-6 font-medium">Reserve Cita</h1>
                    <h2 class="font-bold mb-1">Información personal.</h2>
                    <input v-model="names" readonly type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                    <input v-model="lastnames" readonly type="text"
                        class="block w-full mb-6 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                    <h2 class="font-bold mb-1">Fecha de nacimiento</h2>
                    <input v-if="date_user" v-model="date_user" type="date" class="block w-full px-4 py-2 mt-2 mb-6 text-gray-700 bg-white border border-gray-200 rounded-md 
                           focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 
                           focus:outline-none focus:ring">
                    <div class="w-full flex">
                        <div class="w-[30%]">
                            <div class="w-[80%]   border border-gray-200 bg-white ml-0 rounded-xl">
                                <div class="w-[30%] flex items-center gap-2">

                                    <select v-model="selectedPhoneCode"
                                        class="flex-1    bg-white rounded-xl px-4 py-3 text-sm">
                                        <option v-for="country in countryList" :key="country.code"
                                            :value="country.phoneCode">
                                            {{ country.phoneCode }}
                                        </option>
                                    </select>
                                    <span class="text-xl">{{ selectedCountry?.flagEmoji }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="w-[70%]">
                            <div class="w-[100%]    ml-auto">
                                <input v-model="phone" placeholder="Número de Celular" type="text"
                                    @input="filterPhoneInput"
                                    class="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                            </div>
                        </div>
                    </div>
                     <h2 v-if="errors.active" class="  mb-1 text-red-400">{{errors.phone}}</h2>
                    <input v-model="email" type="text" placeholder="Email"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                    <input v-model="confirmEmail" type="text" placeholder="Verifica tu Email"
                        class="block w-full px-4 py-2 mt-2  text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
                    <h2 v-if="errors.active" class=" mb-1 text-red-400">{{errors.email}}</h2>
                    <h2 class="font-bold mb-1">Comentario para el especialista</h2>
                    <textarea v-model="coment" rows="2"
                        class="w-full p-2 border border-gray-300 rounded bg-white resize-none appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent">
                 </textarea>
                    <div class="flex items-center justify-center w-full gap-4 my-8">
                        <div
                            class="flex gap-2 items-center border border-gray-300 py-2 px-8 mb-10 w-fit text-gray-500 rounded-xl shadow cursor-pointer">
                            <h1 class="font-bold" @click="button_preview">Regresar</h1>
                        </div>
                        <div
                            class="flex gap-2 items-center bg-[var(--blue-1)] py-2 px-8 mb-10 w-fit text-white rounded-xl shadow cursor-pointer">
                            <h1 class="font-bold" @click="check_data_user">Agendar</h1>
                        </div>
                    </div>
                </div>
                <div class="w-full  md:w-1/2 " v-if="state_resevation === 1 || state_resevation === 0">
                    <div class="w-[95%]  md:[90%] lg:w-[80%] border border-gray-300 bg-white rounded-2xl m-auto">
                        <div class=" flex w-[95%] md:w-[80%] m-auto py-6">
                            <div
                                class="w-16 h-16 md:w-20 md:h-20  lg:w-32 lg:h-32  mr-1  border border-white shadow-[2px_0px_0px_3px_var(--blue-1)]  rounded-full   overflow-hidden">
                                <img :src="data_user?.perfilPhoto" alt="Avatar" class="  object-cover">
                            </div>
                            <div class="w-[60%] m-auto text-[14px] ">
                                <h1 class="text-xl lg:text-2xl ">{{ data_user?.name }}</h1>
                                <h1 class="mb-5" v-if="data_user?.specialists?.[0]?.name">
                                    {{ data_user.specialists[0].name }}
                                </h1>


                                <div class="flex mb-3 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                                        class="mr-2" width="20px" fill="var(--blue-1)">
                                        <path
                                            d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                                    </svg>
                                    <div>
                                        <div>
                                            <div class="flex items-center">
                                                <h1 v-if="shedule?.date">
                                                    {{ formatDateTimeEs(shedule?.date.year, shedule?.date.month,
                                                        shedule?.date.day,
                                                        Number(shedule?.openTime?.split(':')[0]),
                                                        Number(shedule?.openTime?.split(':')[1])) }}
                                                </h1>

                                            </div>
                                            <h1 class="text-[var(--blue-1)] cursor-pointer " @click="button_preview()">
                                                Cambiar
                                                fecha / hora</h1>
                                        </div>

                                    </div>

                                </div>
                                <div class="flex mb-5 items-center">
                                    <img src="../../assets/images/iconconsultorio.webp" class="    w-8 h-8 p-1"
                                        alt="Icono">
                                    <div>
                                        <h1>{{ office?.description }}</h1>
                                    </div>

                                </div>
                                <div class="flex mb-5 items-center">
                                    <img src="../../assets/images/icopnprepagada.webp" class="    w-8 h-8 p-1"
                                        alt="Icono">
                                    <div>
                                        <h1>{{ eps?.name }}</h1>

                                    </div>

                                </div>

                                <!-- condicional para mensaje -->
                                <h1 v-if="eps?.type !== 'ANTICIPATED' && eps?.type !== 'SITE'" class="w-[90%] m-auto mb-3">En caso
                                    de aplicacion con alguna medicina prepagada , el costo del bono se cancela en el
                                    momento de la cita</h1>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="w-full font  bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen " v-if="state_resevation === 2">
            <div class="pt-20 w-screen">
                <div class="w-[90%] lg:w-[40%] border border-gray-200 rounded-2xl bg-white font-poppins m-auto mt-20">
                    <div class="w-[90%] m-auto py-4">
                        <h2 class="font-bold   text-2xl mb-10  mt-5">Confirma tu cita</h2>
                        <p class="mb-16">Tu código de confirmación se envio al Email registrado.
                        </p>
                        <h2 class="font-medium mb-2">Inserta el código de 4 cifras</h2>
                        <div class="w-full   py-2 rounded-2xl flex justify-center gap-2">
                            <input v-for="(digit, index) in 4" :key="index" type="text" maxlength="1"
                                class="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                @input="handleInput($event, index)" ref="inputs" />
                        </div>
                        <h2 class="mt-10 font-medium">¿El mensaje no te ha llegado en 2 minutos?</h2>
                        <h2 class="text-[var(--blue-1)] font-medium cursor-pointer" @click="create_reservation">Enviar
                            el mensaje otra vez.</h2>
                    </div>
                    <div class="bg-[var(--blue-1)] w-fit m-auto text-white font-bold p-3 rounded-xl mb-10 mt-15 cursor-pointer"
                        @click="confirmToken">
                        Confirmar mi cita >
                    </div>
                </div>
            </div>
        </div>


        <div class="w-full font bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen flex items-center justify-center"
            v-if="state_resevation === 3">

            <div class="w-[90%] lg:w-[40%] border border-gray-200 bg-white rounded-2xl py-8">
                <h1 class="w-[90%] text-center m-auto font-bold mb-3 text-3xl">¡Listo! reservaste tu cita</h1>
                <h2 class="w-[80%] mx-auto text-center  m-auto mb-6">Recibirás un email de confirmación ahora y un recordatorio el
                    día antes de la cita.</h2>
                <div class=" flex w-[80%] m-auto">
                    <div
                        class="w-16 h-16 md:w-32 md:h-32  mr-1  border border-white shadow-[2px_0px_0px_3px_var(--blue-1)]  rounded-full   overflow-hidden">
                        <img :src="data_user?.perfilPhoto" alt="Avatar" class="  object-cover">
                    </div>
                    <div class="w-[60%] m-auto text-[14px] ">
                        <h1 class="text-3xl font-medium">{{ data_user?.name }}</h1>


                        <div class="flex mb-3 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" class="mr-2"
                                width="20px" fill="var(--blue-1)">
                                <path
                                    d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                            </svg>
                            <div>
                                <div>
                                    <div class="flex items-center">
                                        <h1 v-if="shedule?.date.day">{{
                                            formatTwoDigits(shedule?.date.day) }}
                                        </h1>
                                        <h1 v-if="shedule?.date.month" class="ml-2">{{
                                            getMonthNameEs(shedule?.date.month)
                                            }}</h1>
                                        <h1 class="ml-2">{{ shedule?.date.year }},</h1>
                                        <h1>{{ shedule?.openTime }}</h1>
                                    </div>

                                </div>

                            </div>

                        </div>
                        <div class="flex mb-5 items-center">
                            <img src="../../assets/images/iconconsultorio.webp" class="    w-8 h-8 pl-1" alt="Icono">
                            <div>
                                <h1>{{ office?.description }}</h1>

                            </div>

                        </div>
                        <div class="flex mb-5 items-center">
                            <img src="../../assets/images/icopnprepagada.webp" class="    w-8 h-8 p-1" alt="Icono">
                            <div>
                              <h1>{{ eps?.type === 'SITE' ? 'Pago en el sitio' : eps?.type === 'ANTICIPATED' ? 'Pago anticipado' : '' }}</h1>


                            </div>

                        </div>

                    </div>
                </div>
                <div class="w-fit px-3 py-2 bg-[var(--blue-1)] text-white font-bold rounded-xl m-auto cursor-pointer"
                    @click="add_google_calendar">
                    <h1 class="w-full text-center">+ Añadir al calendario</h1>
                </div>
            </div>
        </div>
        <Colors class="fixed bottom-0 left-0 w-full   shadow-md" />
    </div>
</template>
