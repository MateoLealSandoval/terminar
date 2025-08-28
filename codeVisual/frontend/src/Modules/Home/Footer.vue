<script lang="ts">
import FooterColor from "@/common/Footer_Color.vue";
import IconsAuth from "@/views/Auth/IconsAuth.vue";
export default {
    name: "Footer",
    components: {
        FooterColor,
        IconsAuth
    },
    methods: {
        goToPQRS() {
            // Guardamos en localStorage que queremos abrir PQRS
            localStorage.setItem('activeTab', 'pqrs');
            this.$router.push('/contact');
        }
    }
}
</script>

<template>
    <footer class="bg-white my-10">
        <div class="flex md:hidden w-full mb-10 justify-center items-center">
            <a href="#">
                <img class="w-auto h-20" src="@/assets/images/LogoPng.webp" alt="Logo">
            </a>
        </div>

        <div class="container pb-18 mx-auto">
            <div class="grid gap-8 grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                <div class="px-6 hidden md:block">
                    <a href="#">
                        <img class="w-auto h-10 md:h-18" src="@/assets/images/LogoPng.webp" alt="">
                    </a>
                </div>
                
                <!-- SERVICIO - Solo 1 Preguntas Frecuentes aquí -->
                <div>
                    <div class="text-xs font-poppins font-semibold uppercase" style="color: var(--blue-1);">
                        Servicio
                    </div>

                    <a href="/purpose"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Propósito
                    </a>
                    
                    <a href="/contact"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Contacto
                    </a>
                    
                    <!-- Link corregido de Habeas Data -->
                    <a href="/data"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Política de Habeas Data
                    </a>
                    
                    <a href="/terms"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Términos y condiciones
                    </a>
                    
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Empleos o Nuevas posiciones
                    </a>

                    <!-- PQRS con función para abrir formulario -->
                    <a @click="goToPQRS"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline cursor-pointer">
                        PQRS
                    </a>

                    <!-- Solo 1 Preguntas frecuentes aquí -->
                    <a href="/questions"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Preguntas frecuentes
                    </a>
                </div>

                <!-- PARA LOS PACIENTES - Sin Preguntas Frecuentes -->
                <div class="">
                    <div class="text-xs font-poppins font-semibold uppercase" style="color: var(--blue-1);">
                        Para los pacientes
                    </div>
                    
                    <router-link to="/specialists"
                        class="bg-[var(--blue-1)] whitespace-nowrap w-fit py-1 rounded-2xl px-2 font-semibold block mt-4 text-xs md:text-sm font-poppins text-white duration-700 hover:text-gray-50 hover:underline">
                        Agenda tu cita
                    </router-link>
                    
                    <router-link to="/specialists"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Especialistas
                    </router-link>
                    
                    <a href="https://wa.me/+573124967421" target="_blank"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Ayuda de un experto
                    </a>
                    
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Productos
                    </a>
                    
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Recursos
                    </a>
                    
                    <a href="/blogs"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Blog
                    </a>
                    <!-- Removido Preguntas frecuentes de aquí -->
                </div>

                <!-- PARA PROFESIONALES - Sin Preguntas Frecuentes -->
                <div class="">
                    <div class="text-xs font-poppins font-semibold uppercase" style="color: var(--blue-1);">
                        Para Profesionales
                    </div>

                    <a href="/planes"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Planes
                    </a>
                    
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Recursos
                    </a>
                    
                    <a href="/services"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Servicios
                    </a>
                    
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Academia
                    </a>
                    
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700 hover:text-gray-400 hover:underline">
                        Condiciones de los planes DOCVISUAL
                    </a>
                    <!-- Removido Preguntas frecuentes de aquí -->
                </div>

                <!-- SÍGUENOS -->
                <div class="">
                    <div class="text-xs font-poppins font-semibold uppercase" style="color: var(--blue-1);">
                        Síguenos
                    </div>
                    <div class="flex items-center gap-5 mt-6">
                        <a href="https://www.facebook.com/docvisual.co" target="_blank" rel="noopener">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                                <path fill="#4568dc"
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/docvisual.co/" target="_blank" rel="noopener">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                                <path fill="#4568dc"
                                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/company/docvisual-co/" target="_blank" rel="noopener">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
                                <path fill="#4568dc"
                                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" />
                            </svg>
                        </a>
                        <a href="https://x.com/docvisual_co" target="_blank" rel="noopener">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#4568dc"
                                    d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@docvisual.co" target="_blank" rel="noopener">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#4568dc"
                                    d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" />
                            </svg>
                        </a>
                    </div>
                </div>

            </div>
        </div>
        
        <FooterColor color="#ffffff" />
    </footer>
</template>