<script lang="ts">
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';
import Search_Specialists from '@/Modules/Specialists/Search_Specialists.vue';
export default {
    name: "specialists",
    components: {
       Navbar,
       Footer_Color,
       Search_Specialists
    }
}
</script>
<template>
<div class="w-screen">
<Navbar/>
<Search_Specialists :buttons-active="true" />
<Footer_Color color="#FFFFFF"/> 
</div>

</template>