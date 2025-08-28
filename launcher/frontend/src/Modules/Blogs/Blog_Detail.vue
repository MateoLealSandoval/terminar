<script setup lang="ts">
import Navbar from '../Home/Navbar.vue';
import { useRoute } from 'vue-router';
import Data_Mock from './Mocks/data.json';
import 'github-markdown-css';
import { marked } from 'marked';
import Footer_Color from '@/common/Footer_Color.vue';
const route = useRoute();
const id = Number(route.params.id);
const blogDetail = Data_Mock.find(item => item.id === id);
const markdownHtml = blogDetail ? marked(blogDetail.text) : '';
 
</script>
<template>
    <div class="w-screen ">
        <Navbar />
        <div v-if="blogDetail" class="container m-auto ">
            <div class="w-full px-8 md:px-0  md:w-1/2 m-auto my-10">
                <img :src="blogDetail.photo" alt="Image" class="w-full object-cover rounded-3xl mb-4" />
               
                <div v-html="markdownHtml" class="markdown-body"></div>
            </div>

        </div>
        <div class="flex justify-center">
            <button
                class="my-10 cursor-pointer px-6 py-2 mt-2 font-medium tracking-wide text-white   transition-colors duration-300 transform   rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                style="background-color: var(--blue-1);">
                Mostrar más
            </button>
        </div>
        
    </div>
    <Footer_Color color="#ffffff"/>
</template>
<style scoped>
.markdown-body {
  background-color: white !important;
  color: black !important;
}
 
</style>
