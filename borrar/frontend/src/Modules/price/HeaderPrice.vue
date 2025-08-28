<script setup lang="ts">
 
import Rellax from 'rellax'
 var rellax = new Rellax('.rellax', {
    center:true
  });
</script>

<template>
  <div class="w-screen font-poppins" :class="rellax">
    <div class="w-full h-auto relative rellax max-h-[450px] overflow-hidden" data-rellax-speed="-50" >
      <img src="@/assets/images/fotopagos.webp"
           alt="Imagen 1"
           class="parallax w-full h-full object-cover object-top" />
    </div>
  </div>
</template>
