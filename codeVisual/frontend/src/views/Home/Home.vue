<template>
    <NavBar class="w-full" />
    <div class="w-[85%]  mx-auto lg:w-[90%] mt-10">
        <Slider />
    </div>
    <div class="w-[85%]  mx-auto lg:w-[90%] ">
        <DirectoryAndSpecialities />
    </div>
    <div class="w-full" style=" background: var(--blue-gradientPurple)">
        <div class="w-[85%]  mx-auto lg:w-[90%] ">
            <OptionsHome />
        </div>
    </div>
    <div class="w-[85%] mx-auto lg:w-[90%] ">
        <Steps_Home />
    </div>
    <div class="w-full  relative">
        <div class="w-[85%] mx-auto lg:w-[90%] ">
            <ProfesionalTop />
        </div>
    </div>
    <div class="mx-auto lg:w-full ">
        <Histories />
    </div>
    <div class="w-[85%] mx-auto lg:w-[90%] ">
        <Figures />
    </div>

    <Bulleting />
    <div class="w-[85%] mx-auto lg:w-full ">
        <Footer />
    </div>
    
    <div class="fixed bottom-4 right-4 w-18 h-auto    cursor-pointer  rounded-full z-30 shadow-lg  ">
        <a href="https://wa.me/+573124967421" target="_blank"
            class="fixed bottom-4 right-4 w-16 h-auto   cursor-pointer rounded-full z-30  ">
            <img src="@/assets/images/logowhatsaap.webp" alt="WhatsApp" class="w-16 h-16 object-contain" />
        </a>

    </div>
</template>
<script setup lang="ts">
import Swal from 'sweetalert2';
import { onMounted } from "vue";
import DirectoryAndSpecialities from '@/Modules/Home/DirectoryAndSpecialities.vue';
import NavBar from "@/Modules/Home/Navbar.vue";
import Slider from "@/Modules/Home/Slider.vue";
import OptionsHome from "@/Modules/Home/OptionsHome.vue";
import Steps_Home from "@/Modules/Home/StepsHome.vue";
import ProfesionalTop from "@/Modules/Home/ProfesionalsTop.vue";
import Histories from "@/Modules/Home/Histories.vue";
import Figures from "@/Modules/Home/Figures.vue";
import Footer from "@/Modules/Home/Footer.vue";
import Bulleting from "@/Modules/Home/Bulletin.vue";
import Footer_Color from '@/common/Footer_Color.vue';
onMounted(() => {
    Swal.fire({
        title: 'Estamos ajustando algunos detalles',
        text: 'Volveremos pronto',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: 'var(--blue-1)' // Cambia este color según tu diseño
    });
});
</script>
