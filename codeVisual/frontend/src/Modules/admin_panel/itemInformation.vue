<script setup lang="ts">
 
defineProps<{
    gotoPanel: () => void;
    image: string
    label: string
    value: number
}>()

</script>
<template>
    <div class="flex items-center gap-4 bg-gray-100 rounded-2xl shadow p-4  mb-5 cursor-pointer"  @click="gotoPanel" >
        <img :src="image" alt="icon" class="w-12 h-12 object-contain" />

        <div>
            <p class="text-gray-600 text-sm leading-tight" v-for="(word, index) in label.split(' ')" :key="index">
                {{ word }}
            </p>
        </div>
        <p class="text-2xl font-bold text-[var(--blue-1)]">{{ value }}</p>
    </div>
</template>