<script lang="ts">
import ButtonNumber from "@/common/Button_Number.vue"; // Nombre corregido según la convención
export default {
  name: "StepsItem",
  components: {
    ButtonNumber,
  },
  props: {
    title:String,
    number:{
      type:Number,
      default: "1"
    } , 
    text: {
      type: String,
      required: false, // Opcional
      default: "", // Valor por defecto si no se pasa
    }, 
  },
};
</script>

<template>
  <div class="w-full flex gap-3 bg-white   items-center p-3 my-4 text-gray-500"  >
    <div class="w-fit">
    <ButtonNumber  
      :element="number"
      :size="50" 
      :color="'var(--blue-purple-2)'"
      class="mx-4"
    />
  </div>
    <div>
        <h1 class="font-poppins text-base md:text-xl lg:text-3xl font-light">{{ title }}</h1>
   
        <h1 v-if="text !== ''" class="font-poppins text-sm md:text-xl font-light mt-4">{{ text }}</h1> 
    </div>
  </div>
</template>
