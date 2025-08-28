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
</script>
<template>
    <div class="w-full border rounded-3xl  p-5 font-poppins bg-white">
        <h1 class="font-bold mb-4">Valora tu especialista</h1>
        <h1>Valoración global</h1>
        <div class="flex ">
            <div v-for="n in 5" :key="n" class="w-6">
                <svg class="ml-1 w-3 h-3 md:h-5 md:w-5" viewBox="0 0 32 32" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                    <title>start-favorite</title>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                        <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                            transform="translate(-154.000000, -881.000000)">
                            <path :fill="n <= averageScore ? '#e89f20' : '#d1d5db'" d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 
                      L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244" id="start-favorite"
                                sketch:type="MSShapeGroup">
                            </path>
                        </g>
                    </g>
                </svg>
            </div>

        </div>
        <hr class="my-5"/>
        <h1 class="font-bold">{{ data.name }}</h1>
        <div class="flex">
            <div v-for="n in 5" :key="n" class="w-4">
                <svg class="ml-1 w-3 h-3 md:h-3 md:w-3" viewBox="0 0 32 32" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                    <title>start-favorite</title>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                        <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                            transform="translate(-154.000000, -881.000000)">
                            <path :fill="n <= averageScore ? '#e89f20' : '#d1d5db'" d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 
                  L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244" id="start-favorite"
                                sketch:type="MSShapeGroup">
                            </path>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
        <h2>{{data.date}}</h2>
        <ul class="list-disc pl-5">
            <li>
              <h2>{{  `Localización: ${data?.location ?? 'Ubicación no disponible'} `}}</h2>
            </li>
          </ul>
        
        <h2>{{data.text}}</h2>
    </div>
</template>
