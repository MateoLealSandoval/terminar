<script setup lang="ts">


defineProps<{
    state: boolean;
    question: string;
    text?: string;
    additionalInfo?: string[];
}>();
// Definir los eventos que el componente puede emitir
const emit = defineEmits(['toggleState']);

// Función para emitir el evento cuando se hace clic
const handleClick = () => {
    emit('toggleState');
};
</script>
<template>
    <div class="w-full border p-3 rounded-2xl border-gray-300 mb-4 font-poppins">
        <div class="w-[95%] m-auto flex items-center   ">
            <h1 class="text-xl font-semibold font-poppins ">{{ question }}</h1>
            <img src="@/assets/svg/arrow.svg" alt="Icono" class="w-8 h-8 transition-transform ml-auto"
                :class="{ 'rotate-90': state }" @click="handleClick">
        </div>
        <transition enter-active-class="transition-opacity duration-500" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-500"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="state" class="w-[95%] m-auto">
                <h2 v-if="text != null" class="  pt-2">{{ text }}</h2>
                <ul  v-if="additionalInfo != null && additionalInfo.length" class="text-sm pt-2 px-3    list-disc pl-5">
                    <li class="mb-3 " v-for="(info, index) in additionalInfo" :key="index">{{ info }}</li>
                </ul>
            </div>
        </transition>
    </div>
</template>