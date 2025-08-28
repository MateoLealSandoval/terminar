<script lang="ts">
import { useRouter } from "vue-router";
import StepsItem from "./StepsItem.vue"

export default {
    name: "StepHome",
    components: {
        StepsItem
    }, setup() {
        const router = useRouter();
        const navigate = () => {
            router.push('/specialists');
        };
        return {
            navigate
        }

    }
}

</script>

<template>
    <div class="w-full my-9  ">
        <div class="w-full mx-auto pt-10 flex flex-col lg:flex-row  ">
            <div class="w-full  lg:w-[50%]    ">
                <h1 class="font-poppins font-semibold  text-xl md:text-4xl text-gray-600">Cómo agendar tu cita y
                    encontrar un especialista</h1>

                <StepsItem :title='"Busca por especialista o especialidad."' :number='1' />
                <StepsItem :title='"Selecciona el especialista, consulta su disponibilidad."' :number='2' />
                <StepsItem :title='"Escoge el día y horario de tu preferencia y haz clic en agendar."' :number='3' />
                <StepsItem :title='"Ingresa o crea tu cuenta, para que tu cita quede agendada."' :number='4' />

            </div>
            <div class="lg:w-[50%] flex justify-center items-stretch">
                <div class="w-full px-3 flex">
                    <iframe class="w-full rounded-lg" style="height: 100%;"
                        src="https://www.youtube.com/embed/D_cp_gARIFQ" title="Video de YouTube" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                </div>
            </div>


        </div>
    </div>

</template>