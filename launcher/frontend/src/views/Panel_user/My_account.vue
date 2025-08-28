<script setup lang="ts">
import { onMounted } from 'vue';


import Navbar from '@/Modules/Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';
import Module_Myaccount from '@/Modules/Panel_User/Module_Myaccount.vue';

 
</script>

<template>
    <div class="w-full h-screen  bg-white flex flex-col font-poppins ">
        <Navbar />
        <div class="flex-1 overflow-auto">
            <Module_Myaccount />
        </div>
        <Footer_Color color="#ffffff" />
    </div>
</template>