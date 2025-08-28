<script lang="ts">
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';
import PurposeBody from '@/Modules/Purpose/PurposeBody.vue';
export default{
    name:'Purpose',
    components:{
        Navbar,
        Footer_Color,
        PurposeBody
    }
}
</script>

<template>
<Navbar/>
<PurposeBody/>
<Footer_Color color="#ffffff"/>
</template>