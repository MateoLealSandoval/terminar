<script setup lang="ts">
 import { useRouter  } from 'vue-router';
defineProps<{
    id:number
    name: string;
    photo: string;
    description: string;
}>();
const router = useRouter();
const goToAbout = (id: number) => {
    router.push(`/blogs/${id.toString()}`);
}
</script>
<template>
    <div class="w-sm  lg:w-sm cursor-pointer" @click="goToAbout(id)">
        <img :src="photo" alt="Image" class="w-full h-72 object-cover rounded-3xl mb-4" />
        <h1 class="mt-2 font-semibold">{{ description }}</h1>
        <div class=" text-[var(--blue-1)] w-fit px-5 e rounded-xl mx-auto font-bold">
            <h1 class="py-1">Ver mas</h1>
        </div>
    </div>

</template>