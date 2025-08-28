<script lang="ts">
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';
import PriceModule from '@/Modules/price/PriceModule.vue';
export default  {
    name:'price',
    components:{
        Navbar,
        Footer_Color,
        PriceModule
    }
} 
</script>

<template>
    <Navbar/>
    <PriceModule/>
    <Footer_Color color="#ffffff"/>
</template>