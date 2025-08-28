<script lang="ts">
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';
import Blogs_items from '@/Modules/Blogs/Blogs_items.vue';

export default {
    name: "blogs",
    components: {
        Navbar,
        Footer_Color,
        Blogs_items
    }
}
</script>
<template>
    <Navbar />
    <Blogs_items />
    <Footer_Color color="#ffffff"/>
</template>