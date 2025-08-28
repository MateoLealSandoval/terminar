<script lang="ts">

import { usePofessionalStorage } from '@/store';
import type { ServicesDtoBody } from "@/dto/professional/Services-Dto";
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

export default {
    name: 'put_service',
    props: {
        service: {
            type: Object as () => ServicesDtoBody,
            required: true
        }
    },
    setup(props, { emit }) {
        const name = ref('');
        const price = ref(0);
        const closeModal = () => {
            emit("update_user");
            emit("close");

        };
        onMounted(() => {
            name.value = props.service.name;
            price.value = props.service.price;
        });
        const store_professional = usePofessionalStorage()

        const put_service = async () => {
            try {
                if (name && price) {

                    const putservice: ServicesDtoBody = {
                        id: props.service.id,
                        name: name.value,
                        price: price.value
                    }
                    await store_professional.Put_service(putservice)

                    toast.success("Servicio editado");
                    
                    closeModal()
                } else {
                    toast.error("Faltan datos");

                }
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || error.message || "Error desconocido al editar el servicio";
                toast.error(errorMessage);
            }
        }
        return {
            name,
            price,
            closeModal,
            put_service
        }
    }

}
</script>
<template>
    <div class="modal font-poppins ">
        <div class="modal-content text-xs ">

            <div class="mb-5">
                <label class="text-gray-700 font-medium  " for="username">Nombre del Servicio</label>
                <p v-if="name === 'CONSULTA'"> Consulta seguimiento </p>
                <p v-else-if="name === 'PRIMERA_CONSULTA'"> Primera consulta </p>
                <p v-else> {{ `${service.name}: $ ${service.price}` }}</p>

            </div>
            <div class="mb-5">
                <label class="text-gray-700 font-medium  " for="username">Precio</label>

                <input v-model="price" type="number" placeholder="Precio"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring">
            </div>
        </div>
        <div class="w-full flex gap-x-4 mt-auto">
            <div class="w-1/2">
                <button class="w-full p-6 bg-[var(--blue-1)] text-white py-2  rounded-3xl cursor-pointer"
                    @click="put_service">
                    Editar
                </button>
            </div>
            <div class="w-1/2">
                <button @click="closeModal" class="w-full border p-6 border-red-200 py-2 rounded-3xl">
                    Cancelar
                </button>
            </div>
        </div>

    </div>
</template>