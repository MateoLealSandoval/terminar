<script setup lang="ts">
defineProps<{
    gotoPanel: () => void;
    image: string;
    label: string;
    value: number;
}>();
</script>

<template>
    <div 
        @click="gotoPanel"
        class="bg-white rounded-md px-6 py-5 hover:shadow-sm transition-shadow cursor-pointer"
    >
        <div class="flex items-center">
            <!-- Imagen del icono PNG -->
            <div class="flex-shrink-0 mr-4">
                <img :src="image" alt="icon" class="w-10 h-10 object-contain" />
            </div>
            
            <!-- Texto -->
            <div class="flex-1">
                <p class="text-sm text-gray-700">
                    {{ label }}
                </p>
            </div>
            
            <!-- Número -->
            <div class="flex-shrink-0">
                <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
            </div>
        </div>
    </div>
</template>