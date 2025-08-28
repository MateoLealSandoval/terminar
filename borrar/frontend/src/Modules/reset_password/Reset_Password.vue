<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Navbar from "../Home/Navbar.vue";
import Colors from "@/common/Colors.vue";
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();

const token = ref<string | null>(null);
const showPassword = ref(false);

// Modelo de registro
const register = ref({
    password: '',
    confirmPassword: ''
});

// Validación de la contraseña
const passwordValid = ref({
    minLength: false,
    hasLowerCase: false,
    hasUpperCase: false,
    hasSpecialChar: false,
    allValid: false,
});

const checkPassword = () => {
    const password = register.value.password;
    passwordValid.value.minLength = password.length >= 8;
    passwordValid.value.hasLowerCase = /[a-z]/.test(password);
    passwordValid.value.hasUpperCase = /[A-Z]/.test(password);
    passwordValid.value.hasSpecialChar = /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    passwordValid.value.allValid =
        passwordValid.value.minLength &&
        passwordValid.value.hasLowerCase &&
        passwordValid.value.hasUpperCase &&
        passwordValid.value.hasSpecialChar;
};
const isFormValid = computed(() => {
    return (
        register.value.password === register.value.confirmPassword &&
        register.value.password.trim() !== '' &&
        register.value.confirmPassword.trim() !== '' &&
        passwordValid.value.allValid
    );
});

const updatePassword = async () => {
    try {
        const response = await axios.put('/emails/reset-password/confirmtoken', { token: token.value, password: register.value.password });
        if (response.data.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada',
                text: 'Contraseña actualizada correctamente.',
            }).then(() => {
                router.push('/auth'); // O redirige a la página de login después del éxito
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al actualizar la contraseña.',
            });
        }
    } catch (error) {
        const err = error as any;
        Swal.fire({
            icon: 'error',
            title: 'Error al enviar',
            text: err.response?.data?.message || 'Hubo un problema al enviar el correo.',
        });
    }
};

const passwordRequirements = computed(() => {
    return [
        {
            message: "Mínimo 8 caracteres",
            valid: passwordValid.value.minLength,
        },
        {
            message: "Al menos una letra minúscula",
            valid: passwordValid.value.hasLowerCase,
        },
        {
            message: "Al menos una letra mayúscula",
            valid: passwordValid.value.hasUpperCase,
        },
        {
            message: "Al menos un carácter especial (!@#$%^&...)",
            valid: passwordValid.value.hasSpecialChar,
        },
    ];
});
onMounted(() => {
    token.value = (route.query.token as string) || (route.params.token as string) || null;

});
</script>


<template>
    <div class="w-screen h-min-screen">
        <Navbar />
        <div class="w-[90%] mx-auto  pt-20 min-h-[90svh]">
            <div class="relative w-full mb-3">
                <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña" v-model="register.password"
                    @input="checkPassword"
                    class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                <button type="button" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    @click="showPassword = !showPassword">

                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                        width="24px" fill="#5f6368">
                        <path
                            d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                    </svg>


                    <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#5f6368">
                        <path
                            d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                    </svg>
                </button>
            </div>
            <div class="relative w-full mb-3">
                <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
                    v-model="register.confirmPassword" @input="checkPassword"
                    class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                <button type="button" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    @click="showPassword = !showPassword">

                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                        width="24px" fill="#5f6368">
                        <path
                            d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                    </svg>


                    <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#5f6368">
                        <path
                            d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                    </svg>
                </button>
            </div>
            <button :class="{
                'bg-gray-200 text-gray-500 cursor-not-allowed': !isFormValid,
                'bg-[var(--blue-1)] text-white  cursor-pointer': isFormValid
            }" class="transition duration-500 w-full py-4 font-bold rounded-xl  mt-4 text-base"
                :disabled="!isFormValid" @click="updatePassword">
                Registrarme
            </button>
            <ul class="text-sm mt-2 ml-1 space-y-1">
                <li v-for="(req, index) in passwordRequirements" :key="index"
                    :class="req.valid ? 'text-green-600' : 'var(--blue-1)'">
                    <span v-if="!req.valid">• {{ req.message }}</span>
                </li>
            </ul>

        </div>



        <Colors />
    </div>
</template>