<script setup lang="ts">
import Navbar from '@/Modules/Home/Navbar.vue';
import Footer from '@/Modules/Home/Footer.vue';
import Footer_Color from '@/common/Footer_Color.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from "sweetalert2";

const formType = ref<'contact' | 'pqrs'>('contact');

const fullName = ref('');
const email = ref('');
const subject = ref('');
const message = ref('');

interface SendEmailsDto {
    names: string;
    email: string;
    subject: string;
    text: string;
}

// Al montar, verificar si venimos del footer con PQRS
onMounted(() => {
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab === 'pqrs') {
        formType.value = 'pqrs';
        localStorage.removeItem('activeTab'); // Limpiar después de usar
    }
});

async function sendContact() {
    try {
        const type = formType.value === 'contact' ? '#contacto ' : '#pqrs ';
        const sendData: SendEmailsDto = {
            names: fullName.value,
            email: email.value,
            subject: type + subject.value,
            text: message.value
        };
        
        const response = await axios.post('/emails/send-email-all', sendData);

        Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Correo enviado correctamente. Nos pondremos en contacto contigo pronto.',
            confirmButtonText: 'OK',
            confirmButtonColor: "var(--blue-1)"
        });
        
        // Resetear los campos después de enviar
        fullName.value = '';
        email.value = '';
        subject.value = '';
        message.value = '';
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el formulario. Por favor, inténtalo de nuevo más tarde.',
            confirmButtonText: 'OK',
            confirmButtonColor: "var(--blue-1)"
        });
    }
}
</script>

<template>
    <div class="w-screen font-poppins bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <div class="w-screen h-auto">
            <img src="@/assets/images/bannercontacto.webp" class="w-full object-cover" />
        </div>
        
        <!-- Contenido principal con flex-grow para ocupar el espacio disponible -->
        <div class="flex-grow">
            <div class="container flex mx-auto py-20">
                <div class="w-[20%]">
                    <div class="rounded-xl mt-8 mb-5 cursor-pointer" @click="formType = 'contact'"
                        :style="{ backgroundColor: formType === 'contact' ? 'var(--blue-1)' : '#b2b2b2' }">
                        <h1 class="w-full text-center py-2 font-semibold text-white">CONTÁCTENOS</h1>
                    </div>

                    <div class="rounded-xl cursor-pointer" @click="formType = 'pqrs'"
                        :style="{ backgroundColor: formType === 'pqrs' ? 'var(--blue-1)' : '#b2b2b2' }">
                        <h1 class="w-full text-center py-2 font-semibold text-white">PQRS</h1>
                    </div>
                </div>
                
                <div class="w-[75%]">
                    <div class="w-[90%] mx-auto bg-white rounded-2xl">
                        <div class="w-[90%] mx-auto">
                            <h1 class="text-3xl text-[var(--blue-1)] font-bold my-3 pt-10">
                                {{ formType === 'contact' ? "Contáctenos" : "PQRS" }}
                            </h1>
                            <p>Uno de nuestros agentes responderá su solicitud en el menor tiempo posible</p>
                            
                            <div class="flex w-full mt-3">
                                <div class="w-[50%]">
                                    <div class="mb-3 w-[95%] mr-auto">
                                        <input v-model="fullName" type="text" placeholder="Nombre completo"
                                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                                    </div>
                                </div>
                                <div class="w-[50%]">
                                    <div class="mb-3 w-[90%] ml-auto">
                                        <input v-model="email" type="email" placeholder="Email"
                                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mb-5 w-full">
                                <input v-model="subject" type="text" placeholder="Asunto"
                                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                            </div>
                            
                            <div class="mb-5 w-full pb-10">
                                <textarea v-model="message" placeholder="Tu mensaje" rows="4"
                                    class="resize-none block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"></textarea>
                            </div>
                            
                            <div class="w-full pb-3">
                                <div class="w-[90%] bg-[var(--blue-1)] rounded-lg mx-auto mb-10">
                                    <button @click="sendContact"
                                        class="w-full text-white font-semibold py-3 rounded-lg hover:bg-cyan-600 transition duration-300">
                                        Enviar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
    <div class="w-[85%] mx-auto lg:w-full ">
        <Footer />
    </div>
    <Footer_Color color="#f3f4f6" />
    <div class="fixed bottom-4 right-4 w-18 h-auto    cursor-pointer  rounded-full z-30 shadow-lg  ">
        <a href="https://wa.me/+573124967421" target="_blank"
            class="fixed bottom-4 right-4 w-16 h-auto   cursor-pointer rounded-full z-30  ">
            <img src="@/assets/images/logowhatsaap.webp" alt="WhatsApp" class="w-16 h-16 object-contain" />
        </a>

    </div>
</template>