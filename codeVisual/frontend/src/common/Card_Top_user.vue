<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps<{
    id: string;
    image?: string | null;
    option: string;
    Description?: string;
    name: string;
    experiece: number;
    rol?: string;
}>();
const router = useRouter();
const showFullDescription = ref(false);
const goToProfile = () => {
    router.push(`/specialist/${props.id}`);
};
const maxWords = 30;
const getShortDescription = (text: string) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
};
</script>
<template>
    <div class="p-[2px] rounded-4xl z-10" style="background: var(--blue-purple-2);">

        <!-- Contenido interno con fondo sólido -->
        <div class="w-full max-w-md h-full rounded-4xl overflow-hidden flex flex-col justify-between z-10 bg-white"
            style="background-color: white;">
            <div class="  w-[90%] m-auto pt-6">
                <div class="flex items-center">
                    <div class="flex items-center   gap-2  my-6 ">
                        <div class="w-32 aspect-square overflow-hidden rounded-full">
                            <img class="w-full h-full object-cover" :src="image" alt="Avatar" v-if="image">
                        </div>
                        <div class="text-left mx-2">
                            <h1 class="mx-2 font-semibold   font-poppins text-lg text-gray-600  " tabindex="0" role="link">{{ name
                            }}</h1>
                            <h2 class="mx-2 font-light   font-poppins text-lg  text-gray-500" tabindex="0" role="link">{{ rol }}
                            </h2>
                            <div class="container p-2 text-left">
                                <h3 class=" font-poppins text-lg  text-gray-500">{{ `Experiencia ${experiece} años` }}</h3>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="px-5 mb-3">
                <div style="background: var(--gray-2); border-radius: 10px;" class="p-3">
                    <p v-if="Description"
                        class="m-3 text-sm md:text-lg text-left font-poppins font-light text-gray-400 dark:text-gray-400 min-h-[100px]">
                        {{ showFullDescription ? Description : getShortDescription(Description) }}
                    </p>
                    <button v-if="Description && Description.split(' ').length > maxWords"
                        @click="showFullDescription = !showFullDescription"
                        class="text-blue-500 underline text-sm mt-1 ml-3">
                        {{ showFullDescription ? 'Ver menos' : 'Ver más' }}
                    </button>
                </div>
            </div>
            <div class="flex justify-center my-5">
                <button @click="goToProfile"
                    class="text-[var(--blue-3)] cursor-pointer font-medium text-base md:text-xl font-poppins my-4    w-3/5 px-6 py-2   tracking-wide  capitalize transition-colors duration-300 transform     focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 rounded-[10px]">
                    Ir al perfil
                </button>
            </div>
        </div>

    </div>

</template>