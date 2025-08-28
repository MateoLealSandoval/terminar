<script setup lang="ts">
import { useRouter } from 'vue-router';
const props = defineProps<{
    image: string;
    option: string;
    link: string;
}>();
const router = useRouter();

const navigate = () => {
    router.push(props.link);
};
</script>
<template>

    <div class="w-[23%] card-container  overflow-hidden   rounded-3xl flex flex-col cursor-pointer">

        <div
            class="mt-10 flex items-center justify-center p-5 md:p-6 lg:p-8 m-auto bg-white rounded-full w-[50%] aspect-square overflow-hidden z-10 relative">
            <img class="object-contain object-center w-full h-full" :src="image" :alt="option" />
        </div>

        <div class="py-6 text-center min-h-[50px] md:min-h-[150px] z-10 relative">
            <a href="#"
                class="break-words text text-[10px] md:text-2xl font-poppins font-bold text-gray-800 leading-[1.2]">
                <div class="text-[10px] md:text-2xl font-poppins font-bold text-gray-100 leading-[1.3]" v-html="option">
                </div>
            </a>
        </div>

        <button
            class="rounded-3xl w-[80%] m-auto mb-4 md:mb-8 cursor-pointer px-1 bg-white font-poppins font-semibold text-[9px] md:text-xl py-1 md:py-2 tracking-wide text-[var(--blue-3)] transition-colors duration-300 transform hover:bg-gray-500 focus:outline-none hover:text-white focus:ring focus:ring-blue-300 focus:ring-opacity-80 z-20 relative"
            @click="navigate">
            Agenda ahora
        </button>
    </div>

</template>
<style scoped>
.card-container {
  position: relative;
  overflow: hidden;
}

.card-container::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  background: var(--blue-purple-2); /* tu gradiente o color */
  opacity: 0;
  z-index: 1; /* Cambiado de 0 a 1 */
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.card-container:hover::before {
  opacity: 1;
}
</style>