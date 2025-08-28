<script setup lang="ts">
import { use_adminPanel_information } from '@/store/stores_admin_panel';
import { computed, onMounted } from 'vue';

const props = defineProps<{
  changePanel: (option: AdminPanelOptionEnum) => void;
}>();
const adminInformation = use_adminPanel_information();
/** 
 * Todo import images
 * **/
import ProfessionalRegisters from "@/assets/imageIcons/profesionalesreg.png"
import ImageRegistersUser from "@/assets/imageIcons/usuarioreg.png"
import ImageAppointment from "@/assets/imageIcons/citasprog.png"
import ImageSuscripts from "@/assets/imageIcons/suscripciones.png"
import ImageRating from "@/assets/imageIcons/ratingprofe.png"
import ImageDeleteUsers from "@/assets/imageIcons/usuarioseliminados.png"
import ImageDeleteProfessionals from "@/assets/imageIcons/profesionaleliminado.png"
import ImageProfeccioanlsConfirm from "@/assets/imageIcons/perfilesporaprobar.png"
/** 
 * Todo import components
 * **/
import itemInformation from './itemInformation.vue';
import { AdminPanelOptionEnum } from './Admin_types_panels';
 

onMounted(() => {
  adminInformation.getInformation();
});
const shedules_datas_office = computed(() => adminInformation.informationdata || null);
</script>
<template>
  <div class="w-full bg-gray-100" v-if="shedules_datas_office != null">
    <h1 class="py-10 w-[90%] mx-auto">Bienvenido a Doc Visual Administrador</h1>
    <div class="w-[90%] mx-auto bg-white rounded-2xl">
      <div class="flex flex-wrap gap-4 w-[95%] mx-auto py-10">
        <itemInformation :image="ProfessionalRegisters" :value="shedules_datas_office.numberProfessionals"
          :label="'Profesionales Registrados'"
          :gotoPanel="() => changePanel(AdminPanelOptionEnum.PROFESSIONAL_REGISTER)" class="min-w-[23%]" />
        <itemInformation :image="ImageRegistersUser" :value="shedules_datas_office.countUsers"
          :label="'Pacientes Registrados'" :gotoPanel="() => changePanel(AdminPanelOptionEnum.USER_REGISTER)"
          class="min-w-[23%]" />
        <itemInformation :image="ImageAppointment" :value="shedules_datas_office.reservations"
          :label="'Citas Programadas'" :gotoPanel="() => changePanel(AdminPanelOptionEnum.QUOTES)"
          class="min-w-[23%]" />
        <itemInformation :image="ImageSuscripts" :value="shedules_datas_office.numberProfessionals"
          :label="'Suscripciones'" :gotoPanel="() => changePanel(AdminPanelOptionEnum.SUBSCRIPTIONS)"
          class="min-w-[23%]" />
        <itemInformation :image="ImageRating" :value="shedules_datas_office.numberProfessionals"
          :label="'Rating Profesionales'" :gotoPanel="() => changePanel(AdminPanelOptionEnum.PROFESSIONAL_RATING)"
          class="min-w-[23%]" />
        <itemInformation :image="ImageDeleteUsers" :value="shedules_datas_office.deleteUsers"
          :label="'Pacientes Eliminados'" :gotoPanel="() => changePanel(AdminPanelOptionEnum.DELETION_REQUESTS)"
          class="min-w-[23%]" />
        <itemInformation :image="ImageDeleteProfessionals" :value="shedules_datas_office.deleteUsersPartner"
          :label="'Profesionales Eliminados'" :gotoPanel="() => changePanel(AdminPanelOptionEnum.DELETION_REQUESTS)"
          class="min-w-[23%]" />
        <itemInformation :image="ImageProfeccioanlsConfirm" :value="shedules_datas_office.pendingPartner"
          :label="'Profesionales Por aprobar'" :gotoPanel="() => changePanel(AdminPanelOptionEnum.PROFESSIONALS_PENDINGS)"
          class="min-w-[23%]" />
      </div>
    </div>
  </div>
</template>