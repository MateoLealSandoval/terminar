<script setup lang="ts">
import type { list_favorites_model } from "@/models/Favorites/listFavorites.dto";

import { useRouter } from "vue-router";
import notUserIcon from "@/assets/imageIcons/notUser.webp"
const router = useRouter();
// Recibes los props
const props = defineProps<{
    data_card: list_favorites_model;
}>();
const { description, id, name, perfilPhoto, title ,first} = props.data_card;
const goToProfile = () => {
    router.push(`/specialist/${id}`);
};
// Desestructuras si lo deseas

const emit = defineEmits<{
    (e: 'delete', id: string): void;
}>();

const handleDelete = () => {

    emit('delete', props.data_card.id);
};
</script>


<template>
    <div class="boder shadow md:max-w-[600px] mt-10 border-gray-200 rounded-2xl  bg-white py-3 w-full">
        <div class="w-full flex justify-end pr-10">
            <div @click="handleDelete">
            
                    <svg class="w-10 h-auto cursor-pointer  *: text-gray-500 " viewBox="0 0 24 24" fill="currentcolor"  
                        xmlns="http://www.w3.org/2000/svg"
                          >
                        <path
                            d="M7 3C4.23858 3 2 5.21619 2 7.95C2 10.157 2.87466 15.3947 11.4875 20.6903C11.7994 20.8821 12.2006 20.8821 12.5125 20.6903C21.1253 15.3947 22 10.157 22 7.95C22 5.21619 19.7614 3 17 3C14.2386 3 12 6 12 6C12 6 9.76142 3 7 3Z"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

          
                <!-- <svg class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                    width="24px" fill="#5f6368">
                    <path
                        d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg> -->
            </div>
        </div>
        <h1 class="text-2xl font-bold w-full text-center mt-10">{{ `${name}` }}</h1>
        <h1 class="text-xl   w-full text-center  mb-10" v-if="first">{{first}}</h1>
        <div class="flex w-[90%] m-auto">
            <div v-if="perfilPhoto"
                class="w-18 h-18 sm:w-26 sm:h-26 lg:w-32 lg:h-32  mr-1 border border-white shadow-[2px_0px_0px_3px_var(--blue-1)] rounded-full overflow-hidden">
                <img :src="perfilPhoto" alt="Avatar" class="w-full h-full object-cover" />
            </div>
        
            <div v-else
                class="w-18 h-18 sm:w-26 sm:h-26 lg:w-32 lg:h-32  mr-1 border border-white shadow-[2px_0px_0px_3px_var(--blue-1)] rounded-full overflow-hidden">
                <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1742425056/fidungtrcbetkco1tqqz.png" alt="Avatar" class="w-full h-full object-cover" />
            </div>

            <div class="w-[70%] text-[14px] ml-auto    ">
                <h1 class=" font-medium mb-3">{{ description }}</h1>


                <div class="flex mb-4 items-center">

                    <div>
                        <div>


                        </div>

                    </div>

                </div>



            </div>

        </div>
        <div class="w-fit px-10 py-2 bg-[var(--blue-1)] text-white font-bold rounded-xl m-auto cursor-pointer mt-10 mb-5 "
            @click="goToProfile">
            <h1 class="w-full text-center">+ Ver perfil</h1>
        </div>

    </div>
</template>
