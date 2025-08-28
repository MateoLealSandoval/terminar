<script setup lang="ts">
 
import information_user from './information_user.vue';
const { opensearch } = defineProps<{ opensearch: () => void }>();
</script>

<template>
    <div class="w-full">
       <information_user :opensearch="() => opensearch()"/>
    </div>
</template>