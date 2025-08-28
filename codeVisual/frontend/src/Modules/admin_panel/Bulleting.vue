<script setup lang="ts">
import { store_admin_bulleting } from '@/store/stores_admin_panel/Bulleting.admin.store';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import paginadeComponent from '@/common/paginade.component.vue';
import axios from 'axios';
import excelIcon from "@/assets/imageIcons/admin_icons/excel-icon.webp"
import iconedit from "@/assets/imageIcons/admin_icons/icons8-editar.webp"
import icondelete from "@/assets/imageIcons/admin_icons/icons8-basura-llena.webp"
import Swal from 'sweetalert2';
import modal_Float from '@/components/modal_Float.vue';
import iconClose from '@/assets/imageIcons/admin_icons/icons8-close.webp'
import type { userBulletingDto } from '@/dto/AdminPanel/UsersBulleting.dto';
const adminProfessioanlStore = store_admin_bulleting()
onMounted(() => {
    adminProfessioanlStore.get_all_users();
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


const selectItem = ref<userBulletingDto | null>(null);
async function dowloadExcel() {
    try {
        const response = await axios.post('/supcription/excel', {}, {
            responseType: 'blob', // 👈 importante para manejar archivos binarios
        });
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'usuarios.xlsx'); // 👈 nombre del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar el archivo:', error);
    }
}

const update_item = async () => {
    try {
        if (selectItem) {

            const response = await axios.put(`/supcription/${selectItem.value?.id}`, {
                name: selectItem.value?.name,
                email: selectItem.value?.email
            })
            Swal.fire({
                title: "¡Éxito!",
                text: "El usuario ha sido actualizado correctamente.",
                icon: "success",
                confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-1').trim(),
                confirmButtonText: "OK",

            });
            adminProfessioanlStore.reset()
            adminProfessioanlStore.get_all_users()
            selectItem.value = null

        } else {
            throw new Error('No se ha seleccionado un item')
        }
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

async function deleteUser(id: string, name: string) {
    const result = await Swal.fire({
        title: "¡Alerta!",
        text: `¿Estás seguro de borrar al usuario ${name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--blue-1)",

        confirmButtonText: "Si",
        cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    try {
        await axios.delete(`/supcription/${id}`);
        adminProfessioanlStore.reset()
        await adminProfessioanlStore.get_all_users()

        Swal.fire({
            title: "Eliminado",
            text: "El usuario ha sido eliminado correctamente.",
            icon: "success",
            confirmButtonColor: "var(--blue-1)"
        });
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



</script>
<template>
    <div class="w-full h-full bg-gray-100 ">
        <!-- edit modal -->
        <modal_Float :model-value="selectItem != null" :width-percent="80" :height-percent="80"
            @click-outside="() => selectItem = null" v-if="selectItem">
            <div class="w-[98%] h-full flex flex-col">
                <div class="w-full">
                    <img :src="iconClose" alt="close" class="ml-auto cursor-pointer" @click="() => selectItem = null" />
                </div>
                <div class="w-[90%] m-auto my-2 flex-grow overflow-auto">
                    <!-- Número de teléfono -->
                    <h1 class="font-semibold text-black text-2xl">Nombre</h1>

                    <input v-model="selectItem.name" type="text" placeholder="* Nombre" :class="[
                        'w-full p-2 rounded-md border mb-6',
                        selectItem.name.trim() === '' ? 'border-red-400' : 'border-gray-300'
                    ]" />
                    <h1 class="font-semibold text-black text-2xl">Correo</h1>
                    <input v-model="selectItem.email" type="text" placeholder="* Correo" :class="[
                        'w-full p-2 rounded-md border',
                        selectItem.email.trim() === '' ? 'border-red-400' : 'border-gray-300'
                    ]" />
                </div>
                <div @click="update_item"
                    class="w-[90%] mx-auto mb-4 bg-[var(--blue-1)] rounded-2xl mt-auto cursor-pointer">
                    <h1 class="py-3 text-center text-white font-semibold">Actualizar</h1>
                </div>
            </div>
        </modal_Float>


        <div class="py-10 w-[90%] mx-auto flex justify-between items-center">
            <h1>Bienvenido a Doc Visual Administrador</h1>
            <div @click="dowloadExcel" class="mr-5 cursor-pointer">
                <img :src="excelIcon" alt="excel" class="mx-auto w-10 h-auto" />
                <h1 class="md:text-base text-[10px] text-center">Descargar datos</h1>
            </div>
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
                        <tr v-for="(user, index) in all_users" :key="user.id" class="border-b hover:bg-gray-50  ">
                            <td class="px-2  md:px-6 py-3 max-w-[20px] truncate text-ellipsis whitespace-nowrap">
                                {{ user.name }}
                            </td>
                            <td class="px-2  md:px-6 py-3 max-w-[20px] truncate text-ellipsis whitespace-nowrap">
                                {{ user.email }}</td>
                            <td class="px-2  md:px-6 py-3 max-w-[20px] truncate text-ellipsis whitespace-nowrap">{{
                                formatDate(user.createdAt) }}</td>
                            <td class="px-2  md:px-6 py-3">
                                <div class="flex gap-2">
                                    <img :src="iconedit" alt="edit" class="cursor-pointer w-5 h-5 md:w-10 md:h-10"
                                        @click="() => selectItem = user" />

                                    <img :src="icondelete" alt="delete" class="cursor-pointer w-5 h-5 md:w-10 md:h-10"
                                        @click="deleteUser(user.id, user.name)" />

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