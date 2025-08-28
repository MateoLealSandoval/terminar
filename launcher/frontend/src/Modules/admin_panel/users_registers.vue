<script setup lang="ts">

import type { UsersPanelAdminDtos} from '@/dto/AdminPanel';
import { store_admin_get_all_users } from '@/store/stores_admin_panel';
import Swal from 'sweetalert2';
import { computed, onMounted, onUnmounted } from 'vue';


const adminProfessioanlStore =  store_admin_get_all_users()
/** 
 * Todo import images
 * **/

/** 
 * Todo import components
 * **/

async function updateUserRole(user: UsersPanelAdminDtos, checked: boolean) {
  if (user.role === "DELETED_USER") {
    const result = await Swal.fire({
      title: "¡Alerta!",
      text: `¿Quieres habilitar al paciente ${user.names} ${user.lastnames}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--blue-1)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, habilitar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await adminProfessioanlStore.setState_users(user.id, user.role);
      user.role = "USER";
    }
    return;
  }

  if (user.role === "USER" && !checked) {
    const result = await Swal.fire({
      title: "¡Alerta!",
      text: `¿Quieres bloquear al usuario ${user.names} ${user.lastnames}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--blue-1)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bloquear",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      await adminProfessioanlStore.setState_users(user.id,  user.role);
      user.role = "DELETED_USER";
    }
    return;
  }

}
onMounted(() => {
  adminProfessioanlStore.get_all_users();
});
onUnmounted(() => {
  adminProfessioanlStore.reset();
});
const all_users = computed(() => adminProfessioanlStore.users || null);
// const shedules_datas_office = computed(() => adminInformation.informationdata || null);
</script>
<template>
  <div class="w-full bg-gray-100 ">
    <h1 class="py-10 w-[90%] mx-auto">Bienvenido a Doc Visual Administrador</h1>
    <div class="w-[90%] mx-auto bg-white rounded-2xl   shadow-gray-300 shadow-2xl min-h-[500px]"
      v-if="all_users.length">
      <table class="min-w-full bg-white shadow-md rounded-xl overflow-hidden  ">
        <thead class="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th class="px-6 py-3">Nombre</th>
            <th class="px-6 py-3">Documento</th>
            <th class="px-6 py-3">Celular </th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in all_users" :key="user.id" class="border-b hover:bg-gray-50  ">
            <td class="px-6 py-3">{{ user.names + " " + user.lastnames }}</td>
            <td class="px-6 py-3">{{ user.names }}</td>
            <td class="px-6 py-3">{{ user.lastnames }}</td>
            <td class="px-6 py-3">{{ user.email }}</td>
            <td class="px-6 py-3">
              <label class="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" :checked="user.role === 'USER'"
                  @click.prevent="(event) => updateUserRole(user, !(user.role === 'USER'))" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-green-500 transition-all">
                </div>
                <div
                  class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 peer-checked:translate-x-full">
                </div>
              </label>
            </td>

            <td class="px-6 py-3">—</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>