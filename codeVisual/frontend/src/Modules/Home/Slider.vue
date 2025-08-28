<script setup lang="ts" >
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { Autoplay,Pagination } from "swiper/modules"; 
import { useRouter } from 'vue-router';
const router = useRouter();
const goToPlanes = () => {
  router.push('/planes');
};
const goToCitas = () => {
  router.push('/specialists');
};
</script>

<template>
  <div class="relative w-full h-fit mt-10 md:h-[300px] lg:h-[300px] rounded-2xl overflow-hidden ">
    <Swiper 
    :slides-per-view="1" 
    :autoplay="{ delay: 3000 }" 
    :modules="[Autoplay, Pagination]"
    :pagination="{ clickable: true }" 
    loop
    class="  lg:w-full  h-full lg:h-full  "
    >
      <SwiperSlide @click="goToPlanes" >
        <img 
          src="@/assets/images/bannersuscribete.webp" 
          alt="suscribete" 
            class="w-full h-full object-contain md:object-cover object-center"
        />
      </SwiperSlide>
      <SwiperSlide @click="goToCitas">
        <img 
        src="@/assets/images/banernuevo2.webp" 
          alt="agenda tu cita" 
      class="w-full h-full object-contain md:object-cover object-center"
        />
      </SwiperSlide>
   
    
    </Swiper>
  </div>
</template>
<style>
/* Cambiar color de los puntos de paginación */
.swiper-pagination-bullet {
  background-color: transparent !important; /* Color de los puntos */
  width: 20px; /* Tamaño de los puntos */
  height: 20px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  border:2px solid white;
}

/* Color del punto activo */
.swiper-pagination-bullet-active {
  background-color: #769bd2 !important; /* Color del punto activo */
  opacity: 1;
}
</style>