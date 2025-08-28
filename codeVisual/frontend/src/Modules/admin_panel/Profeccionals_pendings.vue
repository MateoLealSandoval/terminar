<script setup lang="ts">

import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import paginadeComponent from '@/common/paginade.component.vue';
import axios from 'axios';
 


import Swal from 'sweetalert2';
import modal_Float from '@/components/modal_Float.vue';
import iconClose from '@/assets/imageIcons/admin_icons/icons8-close.webp'
import { store_admin_pendings } from '@/store/stores_admin_panel/pendings.store';
/**
 * ! icons 
 * **/
import iconedit from "@/assets/imageIcons/admin_icons/icons8-editar.webp"
import icondatas from "@/assets/imageIcons/admin_icons/documents.webp"
import icon_good from "@/assets/imageIcons/admin_icons/good_document.webp"
import type { userPendingsDto } from '@/models/admin_panel/users_pendings';
type StatusType = 'PENDING' | 'ACCEPTED' | 'REJECTED';
/**
 * @COMPONENTES 
 * **/
import Documents_panel from './components/documents_panel.vue';

const adminProfessioanlStore = store_admin_pendings()
const type = ref<StatusType>('PENDING')
onMounted(() => {
    adminProfessioanlStore.get_all_users(type.value);
});
onUnmounted(() => {
    adminProfessioanlStore.reset();
});
const all_users = computed(() => adminProfessioanlStore.users || null);
const meta = computed(() => adminProfessioanlStore.meta || null);
function formatDate(fechaIso: string): string {
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // los meses van de 0 a 11
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}


const selectItem = ref<userPendingsDto | null>(null);
const statusOptions: { value: StatusType; label: string }[] = [
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'ACCEPTED', label: 'Aceptado' },
    { value: 'REJECTED', label: 'Rechazado' },
];
const panels = ref({
    viewDocuments: false,
    editModal: false,
});

watch(type, (newValue) => {
    if (newValue) {
        adminProfessioanlStore.reset();
        adminProfessioanlStore.get_all_users(newValue);
    }
});
const approve = async (data: userPendingsDto) => {

    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Quieres aprobar a ${data.names} ${data.lastnames}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, aprobar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "var(--blue-1)",
        cancelButtonColor: "#d33"
    });

    if (result.isConfirmed) {
        try {
            // Aquí deberías hacer la petición para aprobar al usuario.
            // Por ejemplo:
            // await axios.post('/admin/approve-user', data);
            const response_axios = await axios.put(`/auth-pending/approve/${data.id}`)
  

            Swal.fire({
                title: "Aprobado",
                text: "El usuario fue aprobado correctamente.",
                icon: "success",
                confirmButtonColor: "var(--blue-1)"
            });

            adminProfessioanlStore.reset();
            adminProfessioanlStore.get_all_users();
        } catch (error) {
            let message = "Ocurrió un error inesperado.";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            Swal.fire({
                title: "Error",
                text: message,
                icon: "error",
                confirmButtonColor: "var(--blue-1)"
            });
        }




    }

}



</script>
<template>
    <div class="w-full h-full bg-gray-100 ">

        <Documents_panel v-if="selectItem && panels.viewDocuments" :data="selectItem"
            @close="() => { selectItem = null; panels.viewDocuments = false }" />


        <modal_Float :model-value="selectItem && panels.editModal === true" :width-percent="80" :height-percent="80"
            @click-outside="() => selectItem = null" v-if="selectItem && panels.editModal && !panels.viewDocuments">
            <div class="w-[98%] h-full flex flex-col overflow-y-auto ">
                <div class="w-full">
                    <img :src="iconClose" alt="close" class="ml-auto cursor-pointer" @click="() => selectItem = null" />
                </div>
                <div class="w-[90%] m-auto my-2 flex-grow overflow-auto">
                    <!-- Número de teléfono -->
                    <h1 class="font-semibold text-black text-2xl">Nombre</h1>

                    <input v-model="selectItem.names" type="text" placeholder="* Nombre" :class="[
                        'w-full p-2 rounded-md border mb-6',
                        selectItem.names.trim() === '' ? 'border-red-400' : 'border-gray-300'
                    ]" />
                    <h1 class="font-semibold text-black text-2xl">Segundo nombre</h1>

                    <input v-model="selectItem.lastnames" type="text" placeholder="*Segundo nombre" :class="[
                        'w-full p-2 rounded-md border mb-6',
                        selectItem.names.trim() === '' ? 'border-red-400' : 'border-gray-300'
                    ]" />
                    <h1 class="font-semibold text-black text-2xl">Correo</h1>
                    <input v-model="selectItem.email" type="text" placeholder="* Correo" :class="[
                        'w-full p-2 rounded-md border',
                        selectItem.email.trim() === '' ? 'border-red-400' : 'border-gray-300'
                    ]" />

                    <h1 class="font-semibold text-black text-2xl">Celular</h1>

                    <input v-model="selectItem.phone" type="text" placeholder="* Celular" :class="[
                        'w-full p-2 rounded-md border mb-6',
                        selectItem.names.trim() === '' ? 'border-red-400' : 'border-gray-300'
                    ]" />
                    <h1 class="font-semibold text-black text-2xl">Titulo</h1>

                    <input v-model="selectItem.title" type="text" placeholder="* Titulo" :class="[
                        'w-full p-2 rounded-md border mb-6',
                        selectItem.names.trim() === '' ? 'border-red-400' : 'border-gray-300'
                    ]" />
                    <h1 class="font-semibold text-black text-2xl"># Documento</h1>

                    <input v-model="selectItem.document" type="text" placeholder="* Nombre" :class="[
                        'w-full p-2 rounded-md border mb-6',
                        selectItem.names.trim() === '' ? 'border-red-400' : 'border-gray-300'
                    ]" />




                </div>
                <div @click="" class="w-[90%] mx-auto mb-4 bg-[var(--blue-1)] rounded-2xl mt-auto cursor-pointer">
                    <h1 class="py-3 text-center text-white font-semibold">Actualizar</h1>
                </div>
            </div>
        </modal_Float>



        <div class="py-10 w-[90%] mx-auto flex gap-3  items-center">
            <h1 class="text-xl md:text-2xl">Tipo de datos: </h1>
            <select v-model="type" class="border rounded p-2 bg-white">
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </div>

        <div class="w-[90%] mx-auto bg-white rounded-2xl   shadow-gray-400 shadow-2xl  " v-if="all_users.length">
            <div class="min-h-[400px] w-full">
                <table class="min-w-full bg-white shadow-md rounded-xl overflow-hidden  text-[8px] md:text-base">
                    <thead class="bg-gray-200 text-gray-500 text-left">
                        <tr>
                            <th class="px-2  md:px-6 py-3">Nombre</th>
                            <th class="px-2 md:px-6 py-3">Correo</th>
                            <th class="px-2 md:px-6 py-3">Fecha inscripción </th>
                            <th class="px-2 md:px-6 py-3">Acciones</th>

                        </tr>
                    </thead>
                    <tbody class="w-full">
                        <tr v-for="(user, index) in all_users" :key="user.id" class="border-b hover:bg-gray-100  "
                            :class="{ 'bg-green-100': user.status === 'ACCEPTED' }">
                            <td class="px-2  md:px-6 py-3 max-w-[20px] truncate text-ellipsis whitespace-nowrap">
                                {{ user.names }}
                            </td>
                            <td class="px-2  md:px-6 py-3 max-w-[20px] truncate text-ellipsis whitespace-nowrap">
                                {{ user.email }}</td>
                            <td class="px-2  md:px-6 py-3 max-w-[20px] truncate text-ellipsis whitespace-nowrap">{{
                                formatDate(user.createdAt) }}</td>
                            <td class="px-2  md:px-6 py-3">
                                <div class="flex gap-2">

                                    <img :src="icon_good" alt="aprovar" class="w-7 h-7 hover:cursor-pointer"
                                        v-tooltip="'Aprobar perfil'" @click="() => { approve(user) }"
                                        v-if="user.status != 'ACCEPTED'" />

                                    <img :src="icondatas" alt="documents" class="w-7 h-7 hover:cursor-pointer"
                                        v-tooltip="'Ver documentos'"
                                        @click="() => { panels.editModal = false; panels.viewDocuments = true; selectItem = user }" />

                                    <img :src="iconedit" alt="edit view" class="w-7 h-7 hover:cursor-pointer"
                                        v-tooltip="'Editar ,ver'"
                                        @click="() => { panels.viewDocuments = false; panels.editModal = true; selectItem = user }" />
                                </div>
                            </td>
                        </tr>

                    </tbody>

                </table>
            </div>
            <div class="flex justify-center mt-4 pb-4">
                <paginadeComponent v-if="meta" :meta="meta" @change-page="adminProfessioanlStore.goToPage" />
            </div>
        </div>

    </div>

</template>