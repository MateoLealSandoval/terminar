<script setup lang="ts">
import { ref } from 'vue';
import image1 from '@/assets/images/home/icinoagenda.webp'
import image2 from '@/assets/images/home/iconolupaazul.webp'
import image3 from '@/assets/images/home/lupaverde.webp'
interface CardItem {
  titulo: string
  description: string
  textButton: string
  icono: string // puedes usar nombres de íconos (ej: FontAwesome) o rutas
  color: string
  buttonColor: string
  linck: string
}





const items = ref<CardItem[]>([
  { titulo: 'Agenda tu cita', description: 'Elige el día y la hora que necesites desde cualquier lugar, sin necesidad de llamar', icono: image1, color: 'text-[var(--blue-3)]', textButton: 'Agenda ahora', buttonColor: 'var(--blue-purple-2)', linck: '/auth' },
  { titulo: 'Encuentra <br> tu especialista', description: 'Elige el día y la hora que necesites desde cualquier lugar, sin necesidad de llamar', icono: image2, color: 'text-[var(--blue-3)]', textButton: 'Buscar un especialista', buttonColor: 'var(--blue-purple-2)', linck: '/specialists' },
  { titulo: 'Para especialistas <br> en salud visual', description: 'Elige el día y la hora que necesites desde cualquier lugar, sin necesidad de llamar', icono: image3, color: 'text-[var(--green-1)]', textButton: '¿Quieres saber más?', buttonColor: 'var(--green-1)', linck: '/auth-professional' }
])

</script>
<template>
  <div class="w-full my-20">
    <div class="w-full text-center text-gray-500 font-bold text-base md:text-3xl lg:text-4xl my-10">
      <h1>Directorio especializado en Optometría,</h1>
      <h1>Oftalmología y demás áreas de Salud Visual.</h1>
    </div>

    <div class="w-full flex flex-wrap justify-center gap-6">
      <div v-for="(item, index) in items" :key="index"
        class="bg-white shadow-lg rounded-2xl p-6 border border-gray-300 w-full sm:w-[48%] lg:w-[31%]">
        <div class="flex gap-3 items-center mb-4">
          <img :src="item.icono" class="w-12 h-12 md:w-14 md:h-14 object-contain" />
          <h2 :class="`font-bold ${item.color} text-lg md:text-xl lg:text-2xl leading-tight`" v-html="item.titulo"></h2>
        </div>

        <p class="text-gray-400 text-sm md:text-base lg:text-lg mb-6">
          {{ item.description }}
        </p>

        <router-link :to="item.linck"
          class="block w-full rounded-3xl text-white font-semibold text-center py-2 text-sm md:text-base"
          :style="`background: ${item.buttonColor}`">
          {{ item.textButton }}
        </router-link>
      </div>
    </div>
  </div>
</template>
