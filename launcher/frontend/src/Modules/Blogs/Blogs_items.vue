<script lang="ts">
import Mock_data from "./Mocks/data.json"
import Card_Blog from "./Card_Blog.vue";
export default {
    name: "Blogs_items",
    components: {
        Card_Blog
    },
    data() {
        return {
            items: Mock_data
        }
    }
}

</script>
<template>
    <div class="w-screen">

        <div 
        class="container m-auto flex flex-wrap gap-8 mt-20 w-full my-6 justify-center md:justify-between"
        
      >
        <Card_Blog 
          v-for="(item, index) in items" 
          :key="index" 
          :name="item.name" 
          :photo="item.photo"
          :description="item.description" 
          :id="item.id" 
          class=" "
        />
      </div>
      
        <div class="flex justify-center">
            <button
                class="my-10 cursor-pointer px-6 py-2 mt-2 font-medium tracking-wide text-white   transition-colors duration-300 transform   rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                style="background-color: var(--blue-1);">
                Mostrar más
            </button>
        </div>
    </div>


</template>