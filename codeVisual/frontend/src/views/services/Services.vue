<script lang="ts">
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';
import BodyService from '@/Modules/services/BodyService.vue';
 
export default  {
    name:'services',
    components:{
        Navbar,
        Footer_Color,
       
        BodyService,
    }
} 
</script>

<template>
    <Navbar/>
    <BodyService/>
    <Footer_Color color="#ffffff"/>
</template>