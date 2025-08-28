<script setup lang="ts">
import Navbar from '../Home/Navbar.vue';
import Footer from '../Home/Footer.vue';
import HeaderPrice from '../price/HeaderPrice.vue';
</script>
<template>
    <div class="w-screen ">
        <Navbar />
        <HeaderPrice />
        <div class="font-poppins w-screen bg-gray-200 py-10 flex flex-col justify-center items-center">
            <div class="text-center">
                <h1 class="font-bold text-2xl text-[var(--blue-1)] mb-5">Bienvenido a Doc visual</h1>
                <h1 class="text-[var(--blue-1)] mb-5">Gracias por adquirir tu plan</h1>
            </div>
            <router-link to="/auth-professional" class="bg-[var(--blue-1)] cursor-pointer w-fit py-1 px-2 rounded-xl text-white">
                <div class="bg-[var(--blue-1)] cursor-pointer w-fit py-1 px-2 rounded-xl text-white">
                    <h1>Crea tu cuenta</h1>
                </div>
            </router-link>
        </div>

        <Footer />
    </div>
</template>