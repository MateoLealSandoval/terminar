<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

// Definimos las propiedades y las almacenamos en una constante
const props = defineProps<{
  text: string;
  data: number;
  item: string;
}>();

const currentNumber = ref(0);
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target); // Deja de observar después de hacerse visible
      }
    });
  });

  const target = document.getElementById('animated-number');
  if (target) observer.observe(target);
});

watch(isVisible, (newVal) => {
  if (newVal) {
    let start = 0;
    const end = props.data;
    const step = Math.ceil(end / 150); // Incrementa más rápido (ajusta el divisor para la velocidad)

    const animate = () => {
      start += step; // Aumenta por 'step' en cada frame
      if (start > end) start = end; // Evita pasar el valor final
      currentNumber.value = start;
      if (start < end) requestAnimationFrame(animate);
    };

    animate();
  }
});
const formattedNumber = computed(() => {
  return new Intl.NumberFormat('es-ES').format(currentNumber.value);
});
</script>

<template>
  <div class="flex font-poppins  text-center justify-center items-center h-full ">
    <div id="animated-number"
      class=" w-full    rounded-3xl opacity-0 transition-opacity duration-700 flex flex-col justify-center items-center text-center py-8 text-white"
      :class="isVisible ? 'opacity-100' : ''" style="background: var(--blue-purple-2);  ">
      <div class="w-fit mx-auto flex gap-2 items-center">
        <div
          class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img src="/src/assets/images/home/calendario.webp" class="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
        </div>

        <div class="text-left">
          <p class="text-[9px] sm:text-base md:text-3xl font-bold w-full">
            {{ formattedNumber }}
            <span class="font-extrabold">
              {{ item }}
            </span>
          </p>
          <p class="text-[7px] md:text-base w-full">
            {{ text }}
          </p>
        </div>
      </div>
    </div>
  </div>

</template>
