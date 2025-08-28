<script lang="ts">
import BulletingForm from "./BulletingForm.vue";
export default {
    name: "Bulletin",
    components: {
        BulletingForm
    }
}

</script>

<template>
    <div class="w-screen h-96 relative flex flex-col md:flex-row">
        <!-- Imagen como fondo -->
        <img src="@/assets/images/optica1.jpg" alt="Fondo" class="absolute inset-0 w-[70%] h-full object-cover z-0" />

        <!-- Capa semitransparente (opcional para oscurecer) -->
        <div class="absolute inset-0 bg-black/30 z-5"></div>

        <!-- Gradiente desde la derecha que se desvanece hacia la izquierda -->
        <div class="absolute inset-0 z-10"
            style="background: linear-gradient(to left, var(--blue-3) 50%, transparent 100%);"></div>

        <!-- Contenido en columnas -->
        <div class="relative w-full h-full flex flex-col md:flex-row z-20">
            <div class="w-full md:w-1/2 h-full flex items-center justify-center">
                <!-- Puedes poner texto u otro contenido -->

            </div>
            <div class="w-full md:w-1/2 h-full flex items-center justify-center">
                <BulletingForm />
            </div>
        </div>
    </div>




</template>