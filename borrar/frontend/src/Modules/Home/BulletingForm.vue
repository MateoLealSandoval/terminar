<script setup lang="ts">
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref } from 'vue';

const acceptedDataPolicy = ref(true);
const acceptedTerms = ref(true);

const nombre = ref('');
const correo = ref('');

const goToTerms = () => {
    window.open('/terms', '_blank');
};
const supcript = async () => {
    try {
        if (
            nombre.value.length === 0 ||
            correo.value.length === 0 ||
            acceptedDataPolicy.value === false ||
            acceptedTerms.value === false
        ) {
            throw new Error('Faltan datos por completar');
        }

        const response = await axios.post('/supcription', {
            name: nombre.value,
            email: correo.value
        });
        
        // Puedes mostrar un mensaje de éxito si quieres
        Swal.fire({
            title: "¡Éxito!",
            text: "Suscripción realizada correctamente.",
            icon: "success",
            confirmButtonColor: "var(--blue-1)",
            confirmButtonText: "OK"
        });

    } catch (error) {
        let message = "Ocurrió un error inesperado.";

        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            message = error.message;
        }
        Swal.fire({
            title: "Error",
            text: message ,
            icon: "error",
            confirmButtonColor: "var(--blue-1)",
            confirmButtonText: "OK"
        });
    }
};


const goToData = () => {
    window.open('/data', '_blank');
};

const updateDataPolicy = () => {
    acceptedDataPolicy.value = !acceptedDataPolicy.value;

};

const updateTerms = () => {
    acceptedTerms.value = !acceptedTerms.value;
  
};
</script>


<template>
    <div class="w-full h-full flex items-center justify-center text-white"
        >
        <div class="w-fit mx-auto">
            <h1 class="max-w-max font-poppins text-center text-2xl md:text-3xl   lg:text-3xl font-light   mx-auto"
                 >
                Suscríbete a nuestro boletín
            </h1>
            <div class="flex flex-col gap-4 items-center   mt-7">
                <input type="text" v-model="nombre" placeholder="Nombre"
                    class="w-full max-w-3xl p-3 border bg-white rounded-2xl font-poppins text-gray-400  text-base md:text-xl border-gray-400 font-semibold"
                     />
                <input type="email" v-model="correo" placeholder="Email"
                    class="mt-1 w-full max-w-3xl p-3 rounded-2xl font-poppins text-base md:text-xl border text-gray-400 bg-white border-gray-400 font-semibold"
                     />
            </div>
            <div class="w-full flex text-xs font-poppins">
                <div class="w-1/2 flex flex-col space-y-2 p-3">

                    <label class="flex items-center space-x-2" @click="updateDataPolicy">
                        <input type="checkbox" class="form-checkbox text-blue-500" v-model="acceptedDataPolicy">
                        <span @click="goToData">Política de Habeas Data</span>
                    </label>
                    <label class="flex items-center space-x-2" @click="updateTerms">
                        <input type="checkbox" v-model="acceptedTerms" class="form-checkbox text-blue-500">
                        <span @click="goToTerms">Términos y condiciones</span>
                    </label>
                </div>
                <div class="w-1/2 px-3   mt-1">
                    <div class="bg-yellow-300 text-[var(--blue-3)]  py-2 rounded-3xl mt-3 shadow shadow-lg">
                        <h2 class="  font-poppins text-sm md:text-lg  font-semibold    text-center" @click="supcript">
                            Suscribirme
                        </h2>
                    </div>

                </div>
            </div>


        </div>

    </div>
</template>