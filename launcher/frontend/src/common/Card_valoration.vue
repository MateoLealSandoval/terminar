<script setup lang="ts">
import type { Review } from '@/models/Model_review';
import { computed } from 'vue';

const props = defineProps<{
    data: Review;
}>();

const averageScore = computed(() => {
    if (!props.data.scores.length) return 0; // Evita división por 0
    const total = props.data.scores.reduce((sum, score) => sum + score.point, 0);
    return Math.round(total / props.data.scores.length); // Redondea al entero más cercano
});

// Función para obtener las iniciales del nombre
const getInitials = computed(() => {
    const name = props.data.name;
    if (!name) return '?';
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        // Si solo hay un nombre, tomar las primeras dos letras
        return parts[0].substring(0, 2).toUpperCase();
    } else {
        // Si hay más de un nombre, tomar la primera letra de los dos primeros
        const firstInitial = parts[0].charAt(0);
        const secondInitial = parts[1].charAt(0);
        return (firstInitial + secondInitial).toUpperCase();
    }
});
</script>

<template>
    <div class="w-full border rounded-3xl p-5 font-poppins bg-white">
        <!-- Header con avatar de iniciales -->
        <div class="flex items-start gap-4 mb-4">
            <!-- Avatar con iniciales -->
            <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-[var(--blue-1)] flex items-center justify-center text-white font-bold text-lg">
                    {{ getInitials }}
                </div>
            </div>
            
            <!-- Contenido principal -->
            <div class="flex-1">
                <h1 class="font-bold mb-2">Valora tu especialista</h1>
                <h2 class="text-gray-600">Valoración global</h2>
                <div class="flex items-center mb-2">
                    <div v-for="n in 5" :key="n" class="w-6">
                        <svg class="ml-1 w-3 h-3 md:h-5 md:w-5" viewBox="0 0 32 32" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                            <title>start-favorite</title>
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                    transform="translate(-154.000000, -881.000000)">
                                    <path :fill="n <= averageScore ? '#e89f20' : '#d1d5db'" 
                                        d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244" 
                                        id="start-favorite" sketch:type="MSShapeGroup">
                                    </path>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <span class="ml-2 text-sm text-gray-600">{{ averageScore.toFixed(1) }}</span>
                </div>
            </div>
        </div>

        <hr class="my-4"/>
        
        <!-- Información del usuario y fecha -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <h2 class="font-bold text-gray-900">{{ data.name }}</h2>
                <span class="text-sm text-gray-500">{{ data.date }}</span>
            </div>
            
            <!-- Ubicación si existe -->
            <div v-if="data.location" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{{ data.location }}</span>
            </div>
            
            <!-- Comentario -->
            <p class="text-gray-700 mt-3">{{ data.text }}</p>
        </div>
    </div>
</template>