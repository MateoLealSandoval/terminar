<script   lang="ts">
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer_Color from '@/common/Footer_Color.vue';
import Header_questions from '../../Modules/Frequent_questions/Header_questions.vue';
import Questions from '@/Modules/Frequent_questions/Questions.vue';
export default{
    name:"Frecuent_questions",
    components:{
        Navbar,
        Footer_Color ,
        Header_questions,
        Questions
    }
}
</script>
<template>
    <Navbar/>
    <Header_questions/>
    <Questions/>
    <Footer_Color color="#FFFFFF"/>
</template>