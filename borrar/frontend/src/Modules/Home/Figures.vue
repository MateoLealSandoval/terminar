<script lang="ts">
import Card_Text from "@/common/Card_Text.vue";

export default {
    name: "Figures",
    components: {
        Card_Text
    },
}
</script>

<template>
    <div class="w-full  my-20   ">
        <h1 class="w-full      text-center font-poppins  font-medium  text-2xl md:text-4xl mt-20  "
            style="color: var(--blue-3); ">Cifras que nos enorgullecen</h1>
        <div class="flex flex-wrap justify-between my-16">
            <Card_Text :text="'Citas realizadas'" item="+" :data="50000"
                class="w-[47%] md:w-[23%] mb-6 flex flex-col justify-between" />
            <Card_Text :text="'Personas atendidas'" item="+" :data="100000"
                class="w-[47%] md:w-[23%] mb-6 flex flex-col justify-between" />
            <Card_Text :text="'Satisfacción'" item="%" :data="98"
                class="w-[47%] md:w-[23%] mb-6 flex flex-col justify-between" />
            <Card_Text :text="'Comunidad Instagram'" item="+" :data="500"
                class="w-[47%] md:w-[23%] mb-6 flex flex-col justify-between" />
        </div>




        <h1 class="w-full   font-poppins font-medium text-center text-2xl md:text-4xl mb-10"
            style="color: var(--blue-3);">
            Nuestros aliados</h1>
        <div class="w-full flex flex-wrap justify-center gap-4  ">


            <img class="w-[21%] h-auto object-contain" src="@/assets/images/partner_logos/logoiconica.jpg" />
            <img class="w-[21%] h-auto object-contain" src="@/assets/images/partner_logos/LogoSantotomasjpg.jpeg" />
            <img class="w-[15%] h-auto object-contain" src="@/assets/images/partner_logos/franjalogo.png" />
            <img class="w-[14%] h-auto object-contain" src="@/assets/images/partner_logos/logoSivit.jpg" />

        </div>

    </div>

</template>
