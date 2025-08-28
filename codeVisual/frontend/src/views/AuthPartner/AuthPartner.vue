<script lang="ts">

import type { authdto } from '@/dto/auth/auth.tdo';

import IconsAuth from '../Auth/IconsAuth.vue'
import Colors from '@/common/Colors.vue';
import { useAuthStore } from '@/store';
import { toast } from "vue3-toastify";
import type { registerPartnerDto } from '@/dto/auth';
import Swal from "sweetalert2";
import { http_status } from '@/models';
import Navbar from '@/Modules/Home/Navbar.vue';
import axios from 'axios';
export default {
    components: {
        IconsAuth,
        Colors,
        Navbar
    },
    name: 'authParthner',
    data() {
        return {
            showPassword: false,
            store: useAuthStore(),
            panels: {
                register: false,
                login: false
            },
            loginInput: {
                gmail: '',
                password: ''
            },
            register: {
                gmail: '',
                password: '',
                confirmpassword: '',
                names: '',
                lastnames: '',
                phone: '',
                document: '',
                title: '',
                acept: false,
                frontImage: '',
                backImage: '',
                terms: false

            },
            passwordValid: {
                minLength: false,
                hasLowerCase: false,
                hasUpperCase: false,
                hasSpecialChar: false,
                allValid: false,
            },
        }
    },
    methods: {
        async resetPassword() {
            const email = this.loginInput.gmail.trim();

            // Validar formato de cualquier email
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!isValidEmail) {
                Swal.fire({
                    icon: 'error',
                    title: 'Correo no válido',
                    text: 'Por favor, ingresa un correo electrónico válido.',
                });
                return;
            }

            try {
                await axios.post('emails/reset-password', { email });

                Swal.fire({
                    icon: 'success',
                    title: 'Correo enviado',
                    text: 'Te hemos enviado un correo para restablecer tu contraseña.',
                });
            } catch (error) {
                const err = error as any; // puedes usar AxiosError si tienes el tipo importado
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar',
                    text: err.response?.data?.message || 'Hubo un problema al enviar el correo.',
                });
            }

        },
        goToTerms() {
            window.open('/terms', '_blank');
        },
        goToData() {
            window.open('/data', '_blank');
        },
        handleFileUpload(event: Event, type: 'front' | 'back'): void {
            const input = event.target as HTMLInputElement;
            if (!input.files || input.files.length === 0) return;

            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    if (type === 'front') {
                        this.register.frontImage = e.target.result as string;
                    } else {
                        this.register.backImage = e.target.result as string;
                    }
                }
            };

            reader.readAsDataURL(file);
        },
        async submitForm(): Promise<void> {
            // 🚨 NUEVA VALIDACIÓN: Mostrar popup antes de crear cuenta
            const shouldProceed = await this.showPaymentWarningPopup();
            if (!shouldProceed) {
                return; // Salir si el usuario fue a planes
            }

            // TODO EL CÓDIGO ORIGINAL SIN CAMBIOS:
            try {
                const formData = new FormData();
                const frontFile = this.base64ToFile(this.register.frontImage, 'front.png');
                const backFile = this.base64ToFile(this.register.backImage, 'back.png');
                //files 
                formData.append('side_front', frontFile);
                formData.append('side_back', backFile);

                // Agregar datos del body
                formData.append('document', this.register.document);
                formData.append('email', this.register.gmail);
                formData.append('lastnames', this.register.lastnames);
                formData.append('names', this.register.names);
                formData.append('password', this.register.password);
                formData.append('phone', this.register.phone);
                formData.append('title', this.register.title);
                const response = axios.post('/files-privates/create-user-pending', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                Swal.fire({
                    icon: 'success',
                    title: 'Inscripción enviada',
                    text: 'Un administrador revisará tus datos. Cuando tu perfil sea aprobado, recibirás una confirmación por correo electrónico.',
                });
                console.log(response)
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error inesperado',
                    text: 'Ocurrió un error inesperado al procesar el formulario.',
                });
            }
        },

        base64ToFile(dataUrl: string, filename: string): File {
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)![1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, { type: mime });
        },

        triggerFileInput(type: 'front' | 'back'): void {
            const element = document.getElementById(type === 'front' ? 'front-card' : 'back-card') as HTMLInputElement;
            if (element) {
                element.click();
            }
        },
        handleEnter(event: any) {
            if (event.key === "Enter") {
                this.loginComponent()
            }
        },
        gotoRute(rute: string) {
            this.$router.push(rute);
        },
        checkPassword() {
            const password = this.register.password;
            this.passwordValid.minLength = password.length >= 8;
            this.passwordValid.hasLowerCase = /[a-z]/.test(password);
            this.passwordValid.hasUpperCase = /[A-Z]/.test(password);
            this.passwordValid.hasSpecialChar = /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

            // Solo se considera válida si cumple con todos los criterios
            this.passwordValid.allValid =
                this.passwordValid.minLength &&
                this.passwordValid.hasLowerCase &&
                this.passwordValid.hasUpperCase &&
                this.passwordValid.hasSpecialChar;
        },
        togglePanel(panelName: 'register' | 'login') {
            Object.keys(this.panels).forEach(key => {
                this.panels[key as keyof typeof this.panels] = key === panelName;
            });
        },

        // 🆕 NUEVO MÉTODO: Popup para crear cuenta
        async showPaymentWarningPopup() {
            const result = await Swal.fire({
                title: '¡Atención!',
                html: 'Para poder crear el perfil, debes adquirir previamente un plan con DocVisual, accede <a href="/planes" style="color: var(--blue-1); text-decoration: underline; font-weight: bold;">AQUÍ</a> a los planes.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: 'var(--blue-1)',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Ir a planes',
                cancelButtonText: 'Continuar sin plan',
                reverseButtons: true
            });

            if (result.isConfirmed) {
                this.$router.push('/planes');
                return false; // No continuar con el registro
            }
            
            return true; // Continuar con el registro
        },

        // 🆕 NUEVO MÉTODO: Popup para login sin pago
        async showPaymentRequiredPopup() {
            const result = await Swal.fire({
                title: 'Acceso Restringido',
                html: 'Tu cuenta no tiene un plan activo. Para acceder necesitas adquirir uno de nuestros planes. <a href="/planes" style="color: var(--blue-1); text-decoration: underline; font-weight: bold;">Ir a planes</a>',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--blue-1)',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Adquirir Plan',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            });

            if (result.isConfirmed) {
                this.$router.push('/planes');
            }
        },

        async registerComponent() {
        // 🚨 NUEVA VALIDACIÓN: Mostrar popup antes de registrarse
            const shouldProceed = await this.showPaymentWarningPopup();
            if (!shouldProceed) {
                return; // Salir si el usuario fue a planes
            }

            // TODO EL CÓDIGO ORIGINAL SIN CAMBIOS:
            if (this.isFormValid) {
                const newRegister: registerPartnerDto = {
                    email: this.register.gmail,
                    names: this.register.names,
                    lastnames: this.register.lastnames,
                    password: this.register.password,
                    document: this.register.document,
                    phone: this.register.phone,
                    title: this.register.title
                }
                try {
                    await this.store.registerParthner(newRegister);
                    toast.success("(Gracias por se parte de Docvisual, tu perfil entra en aprobacion y validación, en 24 a 48 horas máximo, tendrás acceso a tu cuenta", {
                        position: 'top-center',
                        autoClose: 2000
                    });
                } catch (error: any) {
                    toast.error(error.message, {
                        position: 'top-center',
                        autoClose: 2000,
                    });
                }

            } else {
                throw new Error("Faltan datos o no son válidos");
            }
        },

        async loginComponent() {
            const blueColor = getComputedStyle(document.documentElement).getPropertyValue('--blue-1').trim();
            if (this.loginInput.gmail != "" && this.loginInput.password != "") {
                const logindata: authdto = {
                    email: this.loginInput.gmail,
                    password: this.loginInput.password
                };
                try {
                    await this.store.userAuth(logindata);

                    // ✅ Si el login fue exitoso, verificar si es paciente (USER)
            if (this.store.user?.role === 'USER') {
                // 🚫 Si es paciente, cerrar sesión inmediatamente y mostrar mensaje
                await this.store.close_session();
                
                await Swal.fire({
                    icon: 'warning',
                    title: 'Acceso Restringido',
                    html: 'Este tipo de usuario debe acceder desde:<br><strong>Acceso a Pacientes</strong>',
                    confirmButtonColor: blueColor,
                    confirmButtonText: 'Ir a Pacientes',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.$router.push('/auth');
                    }
                });
                return;
            }
            
            // ✅ Si no es paciente (es especialista o admin), continuar normal
                    await Swal.fire({
                        icon: 'success',
                        title: 'Autenticación Completada',
                        confirmButtonColor: blueColor,
                        confirmButtonText: 'OK'
                    });
                } catch (error: any) {
                // 🚨 NUEVA VALIDACIÓN: Verificar si es error de pago
                    if (error.message && (
                        error.message.includes('plan') || 
                        error.message.includes('pago') || 
                        error.message.includes('suscripción') ||
                        error.message.includes('payment')
                    )) {
                        // Mostrar mensaje específico para falta de pago
                        await this.showPaymentRequiredPopup();
                        return;
                    }
                    
                    // CÓDIGO ORIGINAL PARA OTROS ERRORES:
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message,
                        confirmButtonColor: blueColor,
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Faltan datos',
                    confirmButtonColor: blueColor,
                    text: 'Por favor, completa todos los campos',
                    confirmButtonText: 'OK'
                });
            }
        },

        closepanels() {
            this.panels.login = false;
            this.panels.register = false;
        },
        isValidPhone(phone: string) {

            return /^\d{10}$/.test(phone);
        },
        isValidDocument(document: string) {
            return /^\d{6,10}$/.test(document);
        }
    },
    computed: {
        token() {
            return this.store.token;
        },
        user() {
            return this.store.user;
        },
        state(newState: http_status) {
            if (newState === http_status.LOADING) {
                Swal.fire({
                    title: "Processing...",
                    html: "Please wait...",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
            } else {
                Swal.close();
            }
        },
        isFormValid() {
            return (
                this.register.acept &&
                this.register.terms &&
                this.passwordValid.allValid &&
                this.register.gmail.trim() !== '' &&
                this.register.lastnames.trim() !== '' &&
                this.register.names.trim() !== '' &&

                this.register.confirmpassword === this.register.password &&
                this.register.frontImage.trim() !== '' &&
                this.register.backImage.trim() !== '' &&
                this.isValidDocument(this.register.document) &&
                this.isValidPhone(this.register.phone) &&
                this.isValidPhone(this.register.phone) &&
                this.register.title.trim() !== ''

            );
        }

    },
    watch: {
        user(newUser: any) {

            if (newUser.role === 'USER') {
                this.$router.push('/accountuser'); // Redirigir a '/dashboard' o la ruta que necesites
            }
            if (newUser.role === 'USER_PARTNER') {
                this.$router.push('/paneluser');
            }
            if (newUser.role === 'ADMIN') {
                this.$router.push('/paneladmin');
            }
            if (newUser.role === 'SUPER_ADMIN') {
                this.$router.push('/paneladmin');
            }
        },
        state(newState: http_status) {
            if (newState === http_status.LOADING) {
                Swal.fire({
                    title: "Processing...",
                    html: "Please wait...",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
            } else {
                Swal.close();
            }
        }

    }, beforeUnmount() {
        document.removeEventListener("keyup", this.handleEnter);
    },
    mounted() {
        document.addEventListener("keyup", this.handleEnter);
    },

    created() {
        // Verificar si ya hay un token al cargar el componente
        if (this.token && this.token !== '') {
            this.$router.push('/paneluser');
        }
    },


}
</script>

<template>
    <Navbar />
    <div class="w-screen  flex flex-col justify-between bg-gray-100 font-poppins ">
        <!-- Contenido de autenticación aquí -->
        <div class="w-full lg:flex-grow    lg:flex  bg-gray-100   text-sm ">
            <div class="hidden lg:block lg:w-[45%] h-screen sticky top-0">
                <img src="@/assets/images/letters.webp" alt="Image" class="w-full h-full object-cover" />
            </div>




            <div class="w-full  lg:w-1/2   flex justify-center  ">
                <div class="w-[90%] sm:w-[60%] flex flex-col h-fit mx-3 m-auto ">
                    <img src="@/assets/images/LogoPng.webp" alt="image"
                        class="h-16 w-auto  pt-5 m-auto mb-7 cursor-pointer " @click="gotoRute('/')" />
                    <h1 class="text-center font-poppins  font-bold pt-6 text-base" style="color: var(--blue-1);"
                        v-if="panels.login === false && panels.register === false">Hacemos
                        visibles a los expertos</h1>
                    <h2 class=" font-poppins      font-semibold  m-auto text-center pt-8 "
                        v-if="panels.login === false && panels.register === false">Crea tu cuenta y haz parte de la
                        comunidad de especialistas en salud visual
                    </h2>
                    <div class="w-full   flex flex-col items-center px-4 mt-7"
                        v-if="panels.login === false && panels.register === false">

                        <button
                            class="w-full  mb-3 mt-5 rounded-xl font-poppins  cursor-pointer   py-4   font-medium tracking-wide text-white   transition-colors duration-300 transform    hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                            style="background-color: var(--blue-1);" @click="togglePanel('register')">
                            Crear una cuenta
                        </button>
                        <button
                            class="w-full  mb-5 mt-2 rounded-xl font-poppins  cursor-pointer   py-4   font-medium tracking-wide text-white   transition-colors duration-300 transform      focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                            style="border: 2px solid var(--blue-1); color: var(--blue-1);"
                            @click="togglePanel('login')">
                            Iniciar sesión
                        </button>
                    </div>
                    <!-- login -->
                    <div class="w-full   flex flex-col items-center px-4" v-if="panels.login">
                        <h1 class="text-3xl font-semibold mb-3">Iniciar sesión</h1>
                        <h1 class="mb-5">¿No tienes cuenta? <span class="text-[var(--blue-1)] cursor-pointer"
                                @click="togglePanel('register')">Registrarme</span></h1>

                        <input type="text" placeholder="Correo" v-model="loginInput.gmail"
                            class="w-full   px-4 py-5 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />

                        <div class="relative w-full">
                            <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
                                v-model="loginInput.password"
                                class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            <button type="button"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                @click="showPassword = !showPassword">

                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" height="24px"
                                    viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path
                                        d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                </svg>


                                <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#5f6368">
                                    <path
                                        d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                </svg>
                            </button>
                        </div>
                        <h1 class="ml-auto py-5 cursor-pointer hover:text-[var(--blue-1)]" @click="resetPassword">
                            ¿Olvidaste tu contraseña?</h1>
                        <button
                            class="transition duration-500  w-full py-4 bg-gray-200 text-gray-500 font-semibold   rounded-xl mt-4 cursor-pointer text-base   hover:bg-[var(--blue-1)] hover:text-white"
                            @click="loginComponent">
                            Ingresar
                        </button>
                        <button
                            class="bg-gray-200 text-gray-500 transition duration-700 w-full py-4 font-bold rounded-xl my-4 text-base cursor-pointer hover:bg-[var(--blue-1)] hover:text-white"
                            @click="gotoRute('/')">
                            Cancelar volver
                        </button>
                        <!-- <div class="w-full flex items-center space-x-2">
                            <hr class="flex-1 border-t border-gray-300">
                            <h1 class="text-sm text-gray-500 whitespace-nowrap">O continúa con</h1>
                            <hr class="flex-1 border-t border-gray-300">
                        </div>
                        <div
                            class="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-400 bg-white cursor-pointer my-4 ">
                            <svg class="w-7 h-auto" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="xMidYMid">
                                <path
                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                    fill="#4285F4" />
                                <path
                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                    fill="#34A853" />
                                <path
                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                    fill="#FBBC05" />
                                <path
                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                    fill="#EB4335" />
                            </svg>
                        </div> -->




                    </div>
                    <!-- REGISTER NEW USER -->

                    <div class="w-full   flex flex-col items-center px-4" v-if="panels.register">
                        <h1 class="text-3xl font-semibold mb-2">Registrarme</h1>
                        <h1 class="mb-9">¿Ya tienes cuenta? <span class="text-[var(--blue-1)] cursor-pointer"
                                @click="togglePanel('login')">Iniciar sesión</span></h1>
                        <div class="w-full flex gap-2">
                            <div class="w-1/2 mb-3">

                                <input type="text" placeholder="Nombre" v-model="register.names"
                                    class="w-full   px-4 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            </div>
                            <div class="w-1/2 mb-3">

                                <input type="text" placeholder="Apellido" v-model="register.lastnames"
                                    class="w-full   px-4 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            </div>
                        </div>
                        <div class="w-full mb-3">

                            <input type="text" placeholder="Correo" v-model="register.gmail"
                                class="w-full   px-4 py-5  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>




                        <!-- newData -->

                        <div class="w-full mb-3">

                            <input type="text" placeholder="Cédula" v-model="register.document"
                                class="w-full   px-4 py-5  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>
                        <div class="w-full mb-3">

                            <input type="text" placeholder="Celular" v-model="register.phone"
                                class="w-full   px-4 py-5  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>
                        <div class="w-full mb-3">

                            <input type="text" placeholder="Tarjeta profesional" v-model="register.title"
                                class="w-full   px-4 py-5  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                        </div>
                        <div class="w-full flex flex-col md:flex-row gap-4">
                            <!-- Frontal de la tarjeta profesional -->
                            <div
                                class="w-full md:w-1/2 flex flex-col items-center border border-gray-300 rounded-lg p-4">
                                <label for="front-card" class="text-gray-600 mb-2">Foto Tarjeta Profesional
                                    (Frontal) tamaño 1080x700, en formato webp o jpg</label>
                                <input type="file" id="front-card" class="hidden"
                                    @change="handleFileUpload($event, 'front')">
                                <div class="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-[var(--blue-1)]"
                                    @click="triggerFileInput('front')">
                                    <img v-if="register.frontImage" :src="register.frontImage"
                                        class="w-full h-full object-cover rounded-lg" />
                                    <span v-else class="text-gray-500">Cargar Imagen</span>
                                </div>
                            </div>

                            <!-- Reverso de la tarjeta profesional -->
                            <div
                                class="w-full md:w-1/2 flex flex-col items-center border border-gray-300 rounded-lg p-4">
                                <label for="back-card" class="text-gray-600 mb-2">Foto Tarjeta Profesional
                                    (Reverso)tamaño 1080x700, en formato webp o jpg</label>
                                <input type="file" id="back-card" class="hidden"
                                    @change="handleFileUpload($event, 'back')">
                                <div class="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-[var(--blue-1)]"
                                    @click="triggerFileInput('back')">
                                    <img v-if="register.backImage" :src="register.backImage"
                                        class="w-full h-full object-cover rounded-lg" />
                                    <span v-else class="text-gray-500">Cargar Imagen</span>
                                </div>
                            </div>
                        </div>






                        <div class="relative w-full mb-3">
                            <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
                                v-model="register.password" @input="checkPassword"
                                class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            <button type="button"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                @click="showPassword = !showPassword">

                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" height="24px"
                                    viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path
                                        d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                </svg>


                                <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#5f6368">
                                    <path
                                        d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                </svg>
                            </button>
                        </div>
                        <div class="relative w-full mb-3">
                            <input :type="showPassword ? 'text' : 'password'" placeholder="Confirmar contraseña"
                                v-model="register.confirmpassword" @input="checkPassword"
                                class="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue-1)]" />
                            <button type="button"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                @click="showPassword = !showPassword">

                                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" height="24px"
                                    viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                                    <path
                                        d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                </svg>


                                <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="#5f6368">
                                    <path
                                        d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                </svg>
                            </button>
                        </div>




                        <div class="flex items-center   w-full   mb-3">
                            <input type="checkbox" id="habeasData" v-model="register.acept"
                                class="w-5 h-5 cursor-pointer accent-[var(--blue-1)]">
                            <label for="habeasData" class="ml-2 text-gray-700 cursor-pointer" @click="goToData">
                                Acepto <strong class="text-[var(--blue-1)]">Política de Habeas DATA</strong>
                            </label>

                        </div>


                        <div class="flex items-center   w-full   mb-6">
                            <input type="checkbox" id="habeasData" v-model="register.terms"
                                class="w-5 h-5 cursor-pointer accent-[var(--blue-1)]">
                            <label for="habeasData" class="ml-2 text-gray-700 cursor-pointer">
                                Acepto <strong class="text-[var(--blue-1)]" @click="goToTerms">Términos y
                                    condiciones.</strong>

                            </label>

                        </div>

                        <div class="w-full">
                            <h1 class="font-bold" v-if="!passwordValid.allValid">Elige una que no hayas usado y recuerda
                                incluir</h1>
                            <ul class="list-disc pl-5 text-[var(--blue-1)]" v-if="!passwordValid.allValid">
                                <li v-if="!passwordValid.minLength">Mínimo 8 caracteres</li>
                                <li v-if="!passwordValid.hasLowerCase">Al menos una letra minúscula</li>
                                <li v-if="!passwordValid.hasUpperCase">Al menos una letra mayúscula</li>
                                <li v-if="!passwordValid.hasSpecialChar">Al menos un carácter especial (ejemplo:
                                    <strong>! @ # $ % & *</strong>)
                                </li>
                            </ul>
                        </div>



                        <button :class="{
                            'bg-gray-200 text-gray-500 cursor-not-allowed': !isFormValid,
                            'bg-[var(--blue-1)] text-white  cursor-pointer': isFormValid
                        }" class="transition duration-500 w-full py-4 font-bold rounded-xl mt-4 text-base"
                            :disabled="!passwordValid.allValid" @click="submitForm">
                            Registrarme
                        </button>

                        <button @click="gotoRute('/')"
                            class="text-base bg-gray-200 text-gray-500 transition duration-700 w-full py-4 font-bold rounded-xl my-4 cursor-pointer hover:bg-[var(--blue-1)] hover:text-white">
                            Cancelar volver
                        </button>

                        <!-- <div class="w-full flex items-center space-x-2">
                            <hr class="flex-1 border-t border-gray-300">
                            <h1 class="text-sm text-gray-500 whitespace-nowrap">O continúa con</h1>
                            <hr class="flex-1 border-t border-gray-300">
                        </div> -->
                        <!-- <div
                            class="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-400 bg-white cursor-pointer my-4 ">
                            <svg class="w-7 h-auto" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="xMidYMid">
                                <path
                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                                    fill="#4285F4" />
                                <path
                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                                    fill="#34A853" />
                                <path
                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                                    fill="#FBBC05" />
                                <path
                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                                    fill="#EB4335" />
                            </svg>
                        </div> -->

                        <h1 class="text-center font-extralight text-[9px] text-gray-400 w-[50%]">Al registrarte, aceptas
                            automáticamente todos los <span class="text-[var(--blue-1)]">términos y Condiciones de
                                DocVisual.</span> Te invitamos a leerlos detenidamente antes de continuar.</h1>

                    </div>

                    <div class="flex-grow py-10">
                        <IconsAuth />
                    </div>

                </div>
            </div>
        </div>

        <Colors class="fixed bottom-0 left-0 w-full" />
    </div>
</template>
<style>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
}
</style>