<script setup lang="ts">
import { defineProps } from "vue";

// Definir las props que recibe el componente
defineProps<{
    color: string; // Recibirá un array de colores
}>();
</script>
<template>
    <div class="w-screen">
        <div class="w-full flex justify-center"  :style="{background:color }">
            <div class="container">
                <p class="py-6 mx-3   font-poppins text-sm md:text-base font-medium" style="color: var(--blue-1); ">2025
                    DocVisual® Todos los
                    derechos reservados</p>
            </div>

        </div>
        <div class="w-full flex justify-between  ">

            <div class="w-1/12 h-6  " style="background-color: #e6311e;"></div>
            <div class="w-1/12 h-6  " style="background-color: #ec661f;"></div>
            <div class="w-1/12 h-6  " style="background-color: #f59f26;"></div>

            <div class="w-1/12 h-6 " style="background-color: #fac61a;"></div>
            <div class="w-1/12 h-6 " style="background-color: #f7e924;"></div>
            <div class="w-1/12 h-6 " style="background-color: #8fc239;"></div>
            <div class="w-1/12 h-6 " style="background-color: #47b145;"></div>
            <div class="w-1/12 h-6 " style="background-color: #2bb5a8;"></div>
            <div class="w-1/12 h-6 " style="background-color: #116db6;"></div>
            <div class="w-1/12 h-6 " style="background-color: #3c4f9c;"></div>
            <div class="w-1/12 h-6 " style="background-color: #643a8e;"></div>
            <div class="w-1/12 h-6 " style="background-color: #ce2d8a;"></div>
        </div>
    </div>


</template>
