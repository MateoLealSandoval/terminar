<script lang="ts">
import Search_Specialists from '@/Modules/Specialists/Search_Specialists.vue';
export default{
    name:'Modal_Specialists',
    components:{
        Search_Specialists
    }
}
</script>
<template>
    <div class="w-full h-full overflow-y-auto">
        <Search_Specialists :buttons-active="false" />
    </div>
</template>