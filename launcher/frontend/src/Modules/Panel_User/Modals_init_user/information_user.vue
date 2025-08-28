<script setup lang="ts">
import type { createDataUserDto } from '@/dto/auth';
import { Genre, GenreLabels } from '@/models';
import { useAuthStore, useUserStore } from '@/store';
import Swal from 'sweetalert2';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const storeUser = useUserStore();
const storeAuth = useAuthStore();
const user = computed(() => storeAuth.user);
const name = ref('');
const lastname = ref('');
const optionsGenre = ref(Genre);
const genreLabels = ref(GenreLabels)
// genre: Genre.MEN,
const router = useRouter()
function navigateToEsPecialists() {
    router.push('/specialists')
}
// days: Array.from({ length: 31 }, (_, i) => i + 1),

const { opensearch } = defineProps<{ opensearch: () => void }>();
const llamarBusqueda = () => {
    opensearch(); // ✅ esto ejecutará la función que viene del padre
};
// years: Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i),
const dataUser = computed(() => storeUser.dataUser);
//contact data
const conuntry = ref('')
const cityuser = ref('')
const contactname = ref('');
const contactlastname = ref('');
const contactphone = ref('');
const contactemail = ref('');
const city = ref('');
const familly = ref('');
const checkdatas = ref(false)
// User data
const day = ref(1);
const month = ref(1);
const year = ref(new Date().getFullYear());
const phone = ref('');
const perfilPhoto = ref('https://example.com/profile.jpg');
//
// Fecha
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

const genre = ref(Genre.MEN)



const errors = reactive({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    genre: '',
    contactname: '',
    contactlastname: '',
    contactphone: '',
    contactemail: '',
    familly: '',
    city: '',
});
function validateForm() {
    let valid = true;
    const errorMessages: string[] = [];

    if (name.value.trim() === '') {
        errors.name = 'Nombre requerido';
        errorMessages.push(errors.name);
        valid = false;
    } else {
        errors.name = '';
    }

    if (lastname.value.trim() === '') {
        errors.lastname = 'Apellido requerido';
        errorMessages.push(errors.lastname);
        valid = false;
    } else {
        errors.lastname = '';
    }

    if (familly.value.trim() === '') {
        errors.familly = 'Parentesco requerido';
        errorMessages.push(errors.familly);
        valid = false;
    } else {
        errors.familly = '';
    }

    if (city.value.trim() === '') {
        errors.city = 'Ciudad requerida';
        errorMessages.push(errors.city);
        valid = false;
    } else {
        errors.city = '';
    }

    if (!/^\d{10,}$/.test(phone.value)) {
        errors.phone = 'Teléfono inválido (mínimo 10 números) y solo números';
        errorMessages.push(errors.phone);
        valid = false;
    } else {
        errors.phone = '';
    }

    if (contactphone.value.trim() === '') {
        errors.contactphone = 'No es válido el número de contacto';
        errorMessages.push(errors.contactphone);
        valid = false;
    } else {
        errors.contactphone = '';
    }

    if (contactemail.value.trim() === '') {
        errors.contactemail = 'Correo requerido';
        errorMessages.push(errors.contactemail);
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactemail.value)) {
        errors.contactemail = 'Correo no válido';
        errorMessages.push(errors.contactemail);
        valid = false;
    } else {
        errors.contactemail = '';
    }

    return {
        valid,
        message: errorMessages.join('\n') // Mensajes separados por salto de línea
    };
}



onMounted(() => {
    storeUser.getDataUser();


});
watch(dataUser, (newData) => {
    if (newData) {

        contactname.value = newData.contactNames || '';
        contactlastname.value = newData.contactLastnames || '';
        contactphone.value = newData.contactPhone || '';
        contactemail.value = newData.contactEmail || '';
        city.value = newData.city || '';
        cityuser.value = newData.cityuser || '';
        conuntry.value = newData.country || '';
        familly.value = newData.contactFamilly || '';
        day.value = newData.birthDay ?? day.value;
        month.value = newData.birthMonth ?? month.value;
        year.value = newData.birthYear ?? year.value;
        phone.value = newData.phone ?? phone.value;
        if (newData.sex === "woman") {
            genre.value = Genre.WOMAN
        }
        if (newData.sex === "men") {
            genre.value = Genre.MEN
        }
        if (newData.sex === "others") {
            genre.value = Genre.OTHERS
        }


    }
}, { immediate: true });
watch(user, (newUser) => {
    if (newUser) {
        name.value = newUser.names || '';
        lastname.value = newUser.lastnames || '';
    }
}, { immediate: true });
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
const panelsActives = reactive({
    basic: false,
    contact: false
})
function togglePanel(panel: keyof typeof panelsActives) {

    panelsActives[panel] = !panelsActives[panel]
    if (panelsActives[panel] === false) {
        savedata()
    }

}
function redirectToWhatsApp() {
    window.location.href = 'https://wa.me/573124967421';
}
//actions 
const savedata = async () => {
    try {
        if (day.value && year.value) {
            const  isValid = await validateForm();
            const { valid, message } = isValid;
            if (!valid) {
                Swal.fire({
                    icon: 'error',
                    title: 'Datos no guardados',
                    text: message +'Por favor, completa todos los campos obligatorios correctamente.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: "var(--blue-1)"
                });

                checkdatas.value = true
                return;
            }

            const sendData: createDataUserDto = {
                names: name.value,
                lastnames: lastname.value,
                birthDay: day.value,
                birthMonth: month.value,
                birthYear: year.value,
                perfilPhoto: perfilPhoto.value,
                phone: phone.value,
                contactEmail: contactemail.value,
                contactNames: contactname.value,
                contactLastnames: contactlastname.value,
                contactPhone: contactphone.value,
                sex: genre.value,
                familly: familly.value,
                city: city.value,
                cityuser: cityuser.value,
                country: conuntry.value
            }
            await storeUser.createDataContact(sendData);
            Swal.fire({
                icon: 'success',
                title: 'Datos guardados',
                text: 'Guardaste tus datos exitosamente, ahora te invitamos a que AGENDES TU CITA',
                confirmButtonText: 'OK',
                confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-1').trim()
            }).then(() => {
                llamarBusqueda();
                storeAuth.refreshToken();
            });
            checkdatas.value = true

        } else {
            toast.error("Error al actualizar datos", {
                position: "top-center"
            })
        }
    } catch (error) {
        toast.error("Error al actualizar datos", {
            position: "top-center"
        })
    }

};
</script>
<template>
    <div class=" w-full  ">
        <div class="w-full flex mt-10">
            <button class="cursor-pointer font-semibold  ml-auto" @click="togglePanel('basic')"
                :class="panelsActives.basic ? 'text-[var(--blue-1)]' : 'text-[var(--blue-1)]'">
                {{ panelsActives.basic ? 'Guardar información' : 'Editar información' }}
            </button>
        </div>
        <div class="md:flex items-stretch  min-h-[90%]  ">
            <div class="w-full md:w-[50%]   flex ">
                <div class="w-[95%] h-full mr-auto bg-white py-10   text-gray-400 ">
                    <div class="w-full m-auto flex justify-between">
                        <h1 class="font-semibold  text-black text-xl ">Información personal </h1>

                    </div>
                    <div class="w-full flex flex-col gap-3">
                        <div class="w-full m-auto flex  gap-2    my-1   ">
                            <div class="w-1/2">
                                <h1 class="w-full m-auto   text-gray-400 mb-1">Nombre(s) </h1>
                                <input v-model="name" type="text" placeholder="Nombre" :disabled="!panelsActives.basic"
                                    class="w-full p-2 border border-gray-200 rounded-md me-1">
                            </div>
                            <div class="w-1/2">
                                <h1 class="w-full m-auto   text-gray-400 mb-1">Apellido(s)</h1>
                                <input v-model="lastname" type="text" placeholder="apellido"
                                    :disabled="!panelsActives.basic"
                                    class="w-full p-2 border border-gray-200 rounded-md">
                            </div>
                        </div>
                        <div class="w-full flex gap-2">
                            <div class="w-1/2">
                                <h1 class="w-full m-auto   text-gray-400">Sexo </h1>
                                <div class="w-full m-auto flex     ">
                                    <select v-model="genre" class="w-full p-2 border border-gray-200 rounded-md"
                                        :disabled="!panelsActives.basic">
                                        <option v-for="num in Object.values(optionsGenre)" :key="num" :value="num">
                                            {{ genreLabels[num] }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="w-1/2">
                                <h1 class="w-full m-auto text-gray-400  ">Fecha de nacimiento *</h1>
                                <div class="w-full m-auto flex   gap-1">
                                    <!-- Select para día -->
                                    <select v-model="day" class="w-1/3 p-2 border border-gray-200 rounded-md"
                                        :disabled="!panelsActives.basic">
                                        <option v-for="d in days" :key="d" :value="d">
                                            {{ d }}
                                        </option>
                                    </select>
                                    <!-- Select para mes -->
                                    <select v-model="month" class="w-1/3 p-2 border border-gray-200 rounded-md"
                                        :disabled="!panelsActives.basic">
                                        <option v-for="(m, index) in months" :key="index" :value="index + 1">
                                            {{ m }}
                                        </option>
                                    </select>
                                    <select v-model="year" class="w-1/3 p-2 border border-gray-200 rounded-md"
                                        :disabled="!panelsActives.basic">
                                        <option v-for="y in years" :key="y" :value="y">
                                            {{ y }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="w-full flex gap-2">
                            <div class="w-1/2">
                                <h1 class="w-full m-auto text-gray-400  ">Número de teléfono *</h1>
                                <div class="w-full m-auto  ">
                                    <input v-model="phone" type="tel" placeholder="* Número de teléfono"
                                        @input="contactphone = contactphone.replace(/\D/g, '')"
                                        :disabled="!panelsActives.basic" :class="[
                                            'w-full p-2 rounded-md border',
                                            checkdatas && phone.trim() === '' ? 'border-red-400' : 'border-gray-300'
                                        ]" />
                                    <h1 v-if="checkdatas && phone.trim() === ''" class="text-red-400 mt-1">* Campo
                                        obligatorio
                                    </h1>
                                </div>
                            </div>
                            <div class="w-1/2">
                                <h1 class="w-full m-auto text-gray-400  ">Correo electronico</h1>
                                <div v-if="user" class="w-full m-auto not-[]:">
                                    <input v-model="user.email" type="tel" placeholder="Correo electronico"
                                        class="w-full p-2 border border-gray-300 rounded-md" readonly />
                                </div>
                            </div>
                        </div>
                        <div class="w-full flex gap-2">
                            <div class="w-1/2">
                                <h1 class="w-full m-auto text-gray-400  ">Pais</h1>
                                <div class="w-full m-auto  ">
                                    <input v-model="conuntry" type="tel" placeholder="* Pais"
                                        :disabled="!panelsActives.basic" :class="[
                                            'w-full p-2 rounded-md border',
                                            checkdatas && conuntry.trim() === '' ? 'border-red-400' : 'border-gray-300'
                                        ]" />
                                    <h1 v-if="checkdatas && conuntry.trim() === ''" class="text-red-400 mt-1">* Campo
                                        obligatorio
                                    </h1>
                                </div>
                            </div>
                            <div class="w-1/2">
                                <h1 class="w-full m-auto text-gray-400  ">Ciudad de residencia</h1>
                                <div class="w-full m-auto  ">
                                    <input v-model="cityuser" type="tel" placeholder="* Ciudad de residencia"
                                        :disabled="!panelsActives.basic" :class="[
                                            'w-full p-2 rounded-md border',
                                            checkdatas && cityuser.trim() === '' ? 'border-red-400' : 'border-gray-300'
                                        ]" />
                                    <h1 v-if="checkdatas && cityuser.trim() === ''" class="text-red-400 mt-1">* Campo
                                        obligatorio
                                    </h1>
                                </div>
                            </div>

                        </div>
                        <div class="w-full m-auto  ">
                            <h1 class="  text-gray-500">* Campos obligatorios</h1>
                        </div>


                    </div>
                </div>

            </div>
            <!-- -------------------------------------- -->
            <div class="w-full md:w-[50%]   flex">
                <div class="w-full  h-full ml-auto bg-white py-10     text-gray-400  ">

                    <div class="w-full m-auto flex justify-between mb-5">
                        <h1 class="font-semibold text-black text-xl">Contacto de emergencia </h1>


                    </div>
                    <h1 class="w-full m-auto text-gray-400 mb-3 ">
                        Importante: La información de ‘Contacto de emergencia’ se utilizará,
                        solo en caso de requerirse ayuda durante tu cita médica.
                    </h1>
                    <div class="w-full flex flex-col gap-3">
                        <div class="w-full m-auto flex  gap-2  ">
                            <div class="w-1/2 me-1">
                                <h1 class="  text-gray-400 mb-1">Nombre(s) *</h1>
                                <input v-model="contactname" type="text" placeholder="* Nombre"
                                    :disabled="!panelsActives.basic" :class="[
                                        'w-full p-2 rounded-md border',
                                        checkdatas && contactname.trim() === '' ? 'border-red-400' : 'border-gray-300'
                                    ]">
                                <h1 v-if="checkdatas && contactname.trim() === ''" class="text-red-400">* Campo
                                    obligatorio
                                </h1>
                            </div>

                            <div class="w-1/2 me-1">
                                <h1 class="  text-gray-400 mb-1">Apellido(s) *</h1>
                                <input v-model="contactlastname" type="text" placeholder="* Apellido"
                                    :disabled="!panelsActives.basic" :class="[
                                        'w-full p-2 rounded-md border',
                                        checkdatas && contactlastname.trim() === '' ? 'border-red-400' : 'border-gray-300'
                                    ]">
                                <h1 v-if="checkdatas && contactlastname.trim() === ''" class="text-red-400">* Campo
                                    obligatorio</h1>
                            </div>
                        </div>
                        <div class="w-full m-auto flex  gap-2  ">
                            <div class="w-1/2 me-1">
                                <h1 class="  text-gray-400 mb-1">Parentesco *</h1>
                                <input v-model="familly" type="text" placeholder="* Parentesco"
                                    :disabled="!panelsActives.basic" :class="[
                                        'w-full p-2 rounded-md border',
                                        familly && familly.trim() === '' ? 'border-red-400' : 'border-gray-300'
                                    ]">
                                <h1 v-if="familly && familly.trim() === ''" class="text-red-400">* Campo
                                    obligatorio
                                </h1>
                            </div>

                            <div class="w-1/2 me-1">
                                <h1 class="  text-gray-400 mb-1">Ciudad de residencia *</h1>
                                <input v-model="city" type="text" placeholder="* Ciudad de residencia"
                                    :disabled="!panelsActives.basic" :class="[
                                        'w-full p-2 rounded-md border',
                                        city && city.trim() === '' ? 'border-red-400' : 'border-gray-300'
                                    ]">
                                <h1 v-if="city && city.trim() === ''" class="text-red-400">* Campo
                                    obligatorio</h1>
                            </div>
                        </div>
                        <div class="w-full m-auto flex  gap-2  ">
                            <div class="w-1/2    ">
                                <!-- Número de teléfono -->
                                <h1 class="  text-gray-400 mb-1">Número de teléfono *</h1>
                                <input v-model="contactphone" @input="contactphone = contactphone.replace(/\D/g, '')"
                                    type="tel" placeholder="* Número de teléfono" :disabled="!panelsActives.basic"
                                    :class="[
                                        'w-full p-2 rounded-md border mb-1',
                                        checkdatas && contactphone.trim() === '' ? 'border-red-400' : 'border-gray-300'
                                    ]" />
                                <h1 v-if="checkdatas && contactphone.trim() === ''" class="text-red-400 mb-2">* Campo
                                    obligatorio
                                </h1>
                            </div>
                            <div class="w-1/2">
                                <h1 class="  text-gray-400 mb-1">Correo contacto *</h1>
                                <input v-model="contactemail" type="email" placeholder="* Correo contacto"
                                    :disabled="!panelsActives.basic" :class="[
                                        'w-full p-2 rounded-md border',
                                        checkdatas && contactemail.trim() === '' ? 'border-red-400' : 'border-gray-300'
                                    ]" />
                                <h1 v-if="checkdatas && contactemail.trim() === ''" class="text-red-400">* Campo
                                    obligatorio
                                </h1>
                            </div>

                        </div>
                        <div class="w-full m-auto  ">
                            <h1 class="  text-gray-500">* Campos obligatorios</h1>
                        </div>
                        <!-- Correo contacto -->


                    </div>
                    <div class="w-[90%] m-auto mt-5 flex items-center justify-between gap-4">

                        <!-- <div class="py-2 px-4  border flex gap-3 text-gray-500    border-gray-400   font-bold text-center rounded-2xl cursor-pointer"
                            @click="showAlert">
                            <svg class="h-5 w-5 text-gray-500" version="1.1" id="Icons"
                                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 32 32" xml:space="preserve">
                                <path d="M30.9,13.6c-0.1-0.1-0.1-0.2-0.2-0.3l-4-4c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l2.3,2.3H22v-3V3c0-0.6-0.4-1-1-1H4
	c0,0,0,0,0,0C3.9,2,3.7,2,3.6,2.1c0,0,0,0-0.1,0c0,0-0.1,0-0.1,0.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0,0,0C3.2,2.4,3.1,2.5,3.1,2.6
	c0,0,0,0,0,0.1C3,2.8,3,2.9,3,3v22c0,0.4,0.2,0.8,0.6,0.9l9,4C12.7,30,12.9,30,13,30c0.2,0,0.4-0.1,0.5-0.2c0.3-0.2,0.5-0.5,0.5-0.8
	v-3h7c0.6,0,1-0.4,1-1V15h5.6l-2.3,2.3c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l4-4c0.1-0.1,0.2-0.2,0.2-0.3
	C31,14.1,31,13.9,30.9,13.6z M10,21c0,0.6-0.4,1-1,1s-1-0.4-1-1v-4c0-0.6,0.4-1,1-1s1,0.4,1,1V21z M20,10v14h-6V7
	c0-0.4-0.2-0.8-0.6-0.9L8.7,4H20V10z" />
                            </svg>
                            <h1 class="my-auto"> Cerrar sesión</h1>
                           
                        </div> -->
                    </div>




                </div>


            </div>

        </div>
        <div class="w-full flex justify-center items-center gap-5 mt-10">
            <div class="flex items-center gap-3  py-2 px-4   font-bold text-center rounded-2xl cursor-pointer text-gray-400 hover:text-[var(--blue-1)]"
                @click="delete_user">

                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 -960 960 960"
                    fill="currentColor">
                    <path
                        d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Z" />
                </svg>
                <h1>Eliminar usuario</h1>

            </div>
            <div class="flex py-2 px-4   font-bold text-center rounded-2xl cursor-pointer text-gray-400 hover:text-[var(--blue-1)]"
                @click="redirectToWhatsApp">

                <h1>Soporte</h1>
            </div>
            <div class="py-2 px-4 bg-[var(--blue-1)] text-white font-bold text-center rounded-2xl cursor-pointer"
                @click="savedata">
                Guardar datos
            </div>
        </div>

    </div>
</template>