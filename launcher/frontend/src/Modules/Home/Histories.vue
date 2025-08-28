<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

interface comentaries {
    name: string,
    photo: string,
    text: string
}


const items: comentaries[] = [
    { name: "Juan jaramillo", photo: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?semt=ais_hybrid&w=740", text: "Gracias a las nuevas lentes trifocales de Zeiss, puedo ver el mundo de una forma totalmente nueva, por ejemplo, el titilar de las estrellas, los colores, todo se me muestra con unos colores mucho más vivos" },
    { name: "John Javier Méndez", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY-ujmoG583_gV8r9yUh6PTMcAXqilZkZ-FA&s", text: "Después de la operación es como si mi cirugía ocular fue un éxito total. Ya estaba casi ciega de un ojo y no podía dar un paso sin gafas durante más de 30 años" },
    { name: "Pedro Hernández", photo: "https://plus.unsplash.com/premium_photo-1689568158814-3b8e9c1a9618?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyc29uYXxlbnwwfHwwfHx8MA%3D%3D", text: "Hace más o menos 15 años que estoy en consulta con la Dra. Carolina Uribe... Ella me recetó lentes gas permeable y he estado muy satisfecha desde que los he estado utilizando" },
    { name: "Marcela Rojas", photo: "https://img.freepik.com/foto-gratis/estilo-vida-emociones-gente-concepto-casual-confiado-agradable-sonriente-mujer-asiatica-brazos-cruzados-pecho-seguro-listo-ayudar-escuchando-companeros-trabajo-participando-conversacion_1258-59335.jpg?semt=ais_hybrid&w=740", text: "Todo el equipo fué extremadamente eficaz, amables y considerados y se tomaron todo el tiempo del mundo para explicar el procedimiento y las diferentes opciones" },
]

</script>

<template>
    <div class="w-full py-20 ">
        <div class="w-full mb-20">
            <h1 class="w-full   text-center font-poppins font-bold text-xl md:text-4xl    text-gray-500">Testimonios que
                reafirman nuestro</h1>
            <h1 class="w-full   text-center font-poppins font-bold text-xl md:text-4xl       text-gray-500">
                compromiso con la Salud Visual</h1>
        </div>
        <div class="flex justify-center w-[90%] mx-auto ">
            <Swiper :loop="true" :space-between="30" :autoplay="{ delay: 2500, disableOnInteraction: false }"
                :speed="1000" :modules="[Autoplay]" class="w-full  " :breakpoints="{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }">
                <SwiperSlide v-for="(item, index) in items" :key="index" class="w-[90%] sm:w-[45%] lg:w-[30%]">
                    <div class="w-full flex justify-center items-center">
                        <div class="p-6 py-8 bg-white lg:text-lg rounded-3xl font-poppins min-h-[350px] flex flex-col justify-between shadow"
                            style="border: 2px solid var(--gray-1);">
                            <div class="flex-1 text-gray-400">
                                "{{ item.text }}"
                            </div>
                            <div class="w-full flex items-center gap-3 text-2xl font-medium text-[var(--blue-3)] mt-10">
                                <img :src="item.photo" alt="image"
                                    class="w-[60px] h-[60px] rounded-full object-cover" />
                                <h1>{{ item.name }}</h1>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

        </div>
    </div>
</template>
