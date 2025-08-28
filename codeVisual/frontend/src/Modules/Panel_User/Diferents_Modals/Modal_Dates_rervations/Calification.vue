<script lang="ts">
import type { datas_List_reservation_user_model } from "@/models/user_reservations";
import { defineComponent, ref } from 'vue';
import CalificationStarts from "./Calification.starts.vue";
import type { CalificationUserDtoBody } from "@/models/Califications";
import { use_reservations_store } from "@/store";
import { calificationStore } from "@/store/calification.store";
export default defineComponent({
    name: 'calification',
    components: {
        CalificationStarts
    },
    props: {
        data_card: {
            type: Object as () => datas_List_reservation_user_model,
            required: true
        },
        onCancel: {
            type: Function,
            required: true
        }
    },

    setup(props ) {

        const store = calificationStore();
        const recommends = ref<number>(0);
        const service_specialist = ref<number>(0);
        const recomendations_specialist = ref<number>(0);
        const personal_attention = ref<number>(0);
        const quality = ref<number>(0);
        const time_service = ref<number>(0);
        const time_waiting = ref<number>(0);
        const site = ref<number>(0);
        const ubication_and_comfort = ref<number>(0);

        // Variable reactiva de texto
        const comment = ref<string>('');
        const create_calification = () => {
            try {
                const sendData: CalificationUserDtoBody = {
                    recommends: recommends.value,
                    service_specialist: service_specialist.value,
                    recomendations_specialist: recomendations_specialist.value,
                    personal_attention: personal_attention.value,
                    quality: quality.value,
                    time_service: time_service.value,
                    time_waiting: time_waiting.value,
                    site: site.value,
                    ubication_and_comfort: ubication_and_comfort.value,
                    comment: comment.value,
                    idProfeccional: props.data_card.data.id,
                    reservationId: props.data_card.id,
                }
                store.Create_Calification(sendData)
                props.onCancel(); // Llama a la función de cancelación pasada desde el padre
            } catch (error: any) {
                alert(error.message);
                return;
            }




        }


        return {
            recommends,
            service_specialist,
            recomendations_specialist,
            personal_attention,
            quality,
            time_service,
            time_waiting,
            site,
            ubication_and_comfort,
            comment,
            create_calification
        }
    }
});
</script>

<template>
    <div class="w-full">
        <div class="w-[90%]  md:w-[80%] bg-white rounded-2xl mx-auto my-10">
            <div class="w-[90%] md:w-[95%] mx-auto py-5">
                <h1 class="text-xl font-bold   my-5">Valora al especialista</h1>

                <CalificationStarts text="Tu opinión general sobre el profesional ¿Lo recomendarías a un amigo?"
                    :score="recommends" @score_action="recommends = $event" />
                <CalificationStarts text="Trato del especialista" :score="service_specialist"
                    @score_action="service_specialist = $event" />
                <CalificationStarts text="Calidad de las explicaciones y recomendaciones ofrecidas por el especialista"
                    :score="recomendations_specialist" @score_action="recomendations_specialist = $event" />
                <CalificationStarts text="Trato del personal de la consulta" :score="personal_attention"
                    @score_action="personal_attention = $event" />
                <CalificationStarts text="Calidad del trato recibido por parte del personal de la consulta"
                    :score="quality" @score_action="quality = $event" />
                <CalificationStarts text="Espera en consulta" :score="time_service"
                    @score_action="time_service = $event" />
                <CalificationStarts text="Tiempo de espera en sala" :score="time_waiting"
                    @score_action="time_waiting = $event" />
                <CalificationStarts text="Estado de las instalaciones" :score="site" @score_action="site = $event" />
                <CalificationStarts text="Ubicación, estado del equipamiento, comfort, comodidad de la sala de espera"
                    :score="ubication_and_comfort" @score_action="ubication_and_comfort = $event" />
                <div class="w-full ">
                    <h1 class="text-xs font-light   my-5">Sugerencias y comentarios</h1>
                    <textarea v-model="comment"
                        class="w-full h-[200px] border border-gray-300 rounded-lg p-2 resize-none"
                        placeholder="Escribe tus comentarios aquí..."></textarea>

                </div>
                <div class="w-[100%] bg-[var(--blue-1)] font-semibold text-center m-auto my-10 mx-auto rounded-xl cursor-pointer"
                    @click="create_calification">
                    <h1 class="py-2 text-white font-bold text-xl">Enviar</h1>

                </div>
            </div>
        </div>
    </div>
</template>
