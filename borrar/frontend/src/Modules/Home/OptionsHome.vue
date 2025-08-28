<script lang="ts">
import CardOption from "@/common/CardOption.vue"
import { defineComponent } from "vue";
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
        return {    OptometristaSosteniendo,EspecialistOptometria,Oftanilogia,TerapiaVisual,Pediatria };
    }
});

</script>
<template>
    <div class=" w-full  ">
        <div class="   m-auto  py-10">
            <h1 class="w-full text-center font-poppins font-bold text-xl md:text-4xl  md:pt-10 pb-5 md:pb-20" style="color:white"
                 >Selecciona por especialidad</h1>
            <div class="w-full m-auto flex flex-wrap justify-center gap-3   md:justify-between   md:gap-3    ">

                <CardOption :image="EspecialistOptometria" :option="'Especialistas <br> en optometría'"
                    :link="'/specialists?filter=Optómetra'" class="w-[48%] md:w-[22%]" />


                <CardOption :image="Oftanilogia" :option="'Especialistas <br>en oftalmología'" :link="'/specialists?filter=Oftalmología'"
                    class="w-[48%] md:w-[22%]" />

                <CardOption :image="TerapiaVisual" :option="'Terapia Visual'"
                    :link="'/specialists?filter=Terapia visual (Ortóptica)'" class="w-[48%] md:w-[22%]" />


                <CardOption :image="Pediatria" :option="'Especialistas en<br>optometría pediátrica'"
                    :link="'/specialists?filter=Pediátrica'" class="w-[48%] md:w-[22%]" />


            </div>
        </div>
    </div>
</template>
