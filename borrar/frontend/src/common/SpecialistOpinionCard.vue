<script setup lang="ts">
import { computed } from 'vue';

interface ScoreItem {
    type: string;
    score: number;
}

interface Opinion {
    user: string;
    fecha: string;
    lugar?: string;
    text?: string;
    score?: ScoreItem[];
}

const props = defineProps<{
    opinion: Opinion;
}>();

// Función para obtener las iniciales del nombre
const getInitials = computed(() => {
    const name = props.opinion.user;
    if (!name) return '??';
    
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

// Calcular el promedio de las calificaciones
const averageScore = computed(() => {
    if (!props.opinion.score || props.opinion.score.length === 0) return 0;
    const sum = props.opinion.score.reduce((acc, item) => acc + item.score, 0);
    return sum / props.opinion.score.length;
});

// Mapeo de tipos a etiquetas en español
const getScoreLabel = (type: string): string => {
    const labels: Record<string, string> = {
        'RECOMENDATION': '¿Recomendarías a este doctora?',
        'TREATMENT': 'Trato del doctor',
        'PERSONAL': 'Trato del personal en consulta',
        'WAITING': 'Espera en consulta',
        'INTALATION': 'Estado de las instalaciones'
    };
    return labels[type] || type;
};
</script>

<template>
    <div class="w-full bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <div class="flex items-start gap-4">
            <!-- Avatar con iniciales -->
            <div class="flex-shrink-0">
                <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--blue-1)] flex items-center justify-center text-white font-bold text-sm md:text-lg">
                    {{ getInitials }}
                </div>
            </div>
            
            <!-- Contenido de la opinión -->
            <div class="flex-1">
                <!-- Header con nombre, fecha y lugar -->
                <div class="mb-2">
                    <div class="flex flex-wrap items-center gap-2">
                        <h3 class="font-semibold text-gray-900">{{ opinion.user }}</h3>
                        <span class="text-xs md:text-sm text-gray-500">{{ opinion.fecha }}</span>
                    </div>
                    <p v-if="opinion.lugar" class="text-xs md:text-sm text-gray-500 mt-1">
                        📍 {{ opinion.lugar }}
                    </p>
                </div>
                
                <!-- Calificación general con estrellas -->
                <div class="flex items-center gap-1 mb-3">
                    <svg v-for="n in 5" :key="n" 
                         class="w-3 h-3 md:w-4 md:h-4"
                         :class="{
                           'text-amber-400': n <= Math.round(averageScore),
                           'text-gray-300': n > Math.round(averageScore)
                         }"
                         fill="currentColor"
                         viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-xs md:text-sm text-gray-600 ml-1">{{ averageScore.toFixed(1) }}</span>
                </div>
                
                <!-- Texto del comentario -->
                <p v-if="opinion.text" class="text-sm md:text-base text-gray-700 mb-3">
                    {{ opinion.text }}
                </p>
                
                <!-- Desglose de calificaciones (colapsable) -->
                <details v-if="opinion.score && opinion.score.length > 0" class="cursor-pointer">
                    <summary class="text-xs md:text-sm text-[var(--blue-1)] hover:text-blue-700 select-none font-medium">
                        Ver calificaciones detalladas
                    </summary>
                    <div class="mt-3 space-y-2 pl-2 border-l-2 border-gray-200">
                        <div v-for="item in opinion.score" :key="item.type" 
                             class="flex items-center justify-between text-xs md:text-sm">
                            <span class="text-gray-600 flex-1 mr-2">{{ getScoreLabel(item.type) }}</span>
                            <div class="flex items-center gap-0.5">
                                <svg v-for="n in 5" :key="n" 
                                     class="w-2.5 h-2.5 md:w-3 md:h-3"
                                     :class="{
                                       'text-amber-400': n <= item.score,
                                       'text-gray-300': n > item.score
                                     }"
                                     fill="currentColor"
                                     viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                <span class="text-xs text-gray-500 ml-1">({{ item.score }})</span>
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    </div>
</template>

<style scoped>
details summary::-webkit-details-marker {
    display: none;
}

details summary::before {
    content: '▶';
    display: inline-block;
    margin-right: 0.5rem;
    transition: transform 0.2s;
}

details[open] summary::before {
    transform: rotate(90deg);
}
</style>