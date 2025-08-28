<script lang="ts">
import CardOption from "@/common/CardOption.vue"
import { defineComponent, ref } from "vue";
import EspecialistOptometria from '@/assets/images/home/especialistas.webp'
import Oftanilogia from  '@/assets/images/home/oftalmologia.webp'
import TerapiaVisual from "@/assets/images/home/terapiavisual.webp"
import Pediatria from "@/assets/images/home/pediatria.webp"
 
import OptometristaSosteniendo from "@/assets/images/optometrista-sosteniendo.webp";
 
export default defineComponent({
    name: "OptionsHome",
    components: {
        CardOption
    },
    setup() {
        const hoveredCard = ref(0); // El primer elemento está activo por defecto
        
        const setHoveredCard = (index: number) => {
            hoveredCard.value = index;
        };

        const resetToDefault = () => {
            hoveredCard.value = 0; // Vuelve al primero cuando no hay hover
        };

        return {    
            OptometristaSosteniendo,
            EspecialistOptometria,
            Oftanilogia,
            TerapiaVisual,
            Pediatria,
            hoveredCard,
            setHoveredCard,
            resetToDefault
        };
    }
});
</script>

<template>
    <div class="w-full">
        <div class="m-auto py-10">
            <h1 class="w-full text-center font-poppins font-bold text-xl md:text-4xl md:pt-10 pb-5 md:pb-20 text-white">
                Selecciona por especialidad
            </h1>
            <div class="w-full m-auto flex flex-wrap justify-center gap-3 md:justify-between md:gap-3"
                 @mouseleave="resetToDefault">

                <CardOption 
                    :image="EspecialistOptometria" 
                    :option="'Especialistas <br> en optometría'"
                    :link="'/specialists?filter=Optómetra'" 
                    class="w-[48%] md:w-[22%] border-2 transition-all duration-300 overflow-hidden"
                    :class="{
                        'border-white shadow-lg shadow-gray-500/50 rounded-xl': hoveredCard === 0,
                        'border-transparent rounded-xl': hoveredCard !== 0
                    }"
                    @mouseenter="setHoveredCard(0)"
                />

                <CardOption 
                    :image="Oftanilogia" 
                    :option="'Especialistas <br>en oftalmología'" 
                    :link="'/specialists?filter=Oftalmología'"
                    class="w-[48%] md:w-[22%] border-2 transition-all duration-300 overflow-hidden"
                    :class="{
                        'border-white shadow-lg shadow-gray-500/50 rounded-xl': hoveredCard === 1,
                        'border-transparent rounded-xl': hoveredCard !== 1
                    }"
                    @mouseenter="setHoveredCard(1)"
                />

                <CardOption 
                    :image="TerapiaVisual" 
                    :option="'Terapia Visual'"
                    :link="'/specialists?filter=Terapia visual (Ortóptica)'" 
                    class="w-[48%] md:w-[22%] border-2 transition-all duration-300 overflow-hidden"
                    :class="{
                        'border-white shadow-lg shadow-gray-500/50 rounded-xl': hoveredCard === 2,
                        'border-transparent rounded-xl': hoveredCard !== 2
                    }"
                    @mouseenter="setHoveredCard(2)"
                />

                <CardOption 
                    :image="Pediatria" 
                    :option="'Especialistas en<br>optometría pediátrica'"
                    :link="'/specialists?filter=Pediátrica'" 
                    class="w-[48%] md:w-[22%] border-2 transition-all duration-300 overflow-hidden"
                    :class="{
                        'border-white shadow-lg shadow-gray-500/50 rounded-xl': hoveredCard === 3,
                        'border-transparent rounded-xl': hoveredCard !== 3
                    }"
                    @mouseenter="setHoveredCard(3)"
                />

            </div>
        </div>
    </div>
</template>
