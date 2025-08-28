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
                        <img class="w-auto  h-10 md:h-18  " src="@/assets/images/LogoPng.webp" alt="">
                    </a>

                    <!-- <p class="max-w-sm mt-2   " style="color: var(--blue-1);">+ 57 300 4555666</p>
                    <p class="max-w-sm mt-2   " style="color: var(--blue-1);">hola@docvisual.co</p>   -->

                </div>
                <div>
                    <div class="text-xs font-poppins font-semibold  uppercase" style="color: var(--blue-1);">
                        Servicio
                    </div>

                    <a href="/purpose"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Propósito
                    </a>
                    <a href="/contact" target="_blank"
                        class="block mt-4  text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Contacto
                    </a>
                    <a href="/data"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Política de Habeas Data

                    </a>
                    <a href="/terms"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">

                        Términos y condiciones

                    </a>
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">

                        Empleos o Nuevas posiciones
                    </a>

		    <a @click="goToPQRS"
   			class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline cursor-pointer">
   			PQRS
		    </a>

		    <a href="/questions"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Preguntas frecuentes
                    </a>

                </div>




                <div class="  ">

                    <div class="text-xs font-poppins font-semibold  uppercase " style="color: var(--blue-1);">
                        Para los pacientes
                    </div>
                    <router-link to="/specialists"
                        class="bg-[var(--blue-1)] whitespace-nowrap w-fit py-1 rounded-2xl px-2 font-semibold block mt-4 text-xs md:text-sm font-poppins text-white duration-700  hover:text-gray-50  hover:underline">
                        Agenda tu cita
                    </router-link>
                    <router-link to="/specialists"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Especialistas

                    </router-link>
                    <a href="https://wa.me/+573124967421" target="_blank"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Ayuda de un experto
                    </a>
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Productos
                    </a>
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Recursos
                    </a>
                    <a href="/blogs"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Blog
                    </a>

                </div>

                <div class="   ">
                    <div class="text-xs font-poppins font-semibold  uppercase" style="color: var(--blue-1);">
                        Para profesionales
                    </div>

                    <a href="/planes"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Planes
                    </a>
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Recursos
                    </a>
                    <a href="/services"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Servicios
                    </a>
                    <a href="#"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Academia
                    </a>
                    <a href="/planes"
                        class="block mt-4 text-xs md:text-sm font-poppins text-black duration-700  hover:text-gray-400  hover:underline">
                        Condiciones de los planes
                        DOCVISUAL
                    </a>
                </div>
                <div class="hidden md:block">
                    <IconsAuth :icon-size="'w-10 h-10'" />
                </div>
            </div>
        </div>

    </footer>




</template>
