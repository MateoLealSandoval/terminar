<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Navbar from "../Home/Navbar.vue";
import Colors from "@/common/Colors.vue";
import { useAuthStore } from "@/store/auth.store";
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";
const store = useAuthStore();
const route = useRoute();

const router = useRouter();
const registerUserToken = async (token: string) => {
    try {
        await store.registerUserToken(token);
        tokenStatus.value = true;
        await Swal.fire({
            icon: 'success',
            title: 'Usuario confirmado',
            text: 'Tu cuenta ha sido confirmada exitosamente.',
            timer: 2000,
            showConfirmButton: false,
        });
        setTimeout(() => {
            router.push('/accountuser'); // reemplaza '/ruta-destino' con la ruta deseada
        }, 1000);
    } catch (error) {
        console.error("Error registering token:", error);
        tokenStatus.value = false; // Error

        await Swal.fire({
            icon: 'error',
            title: 'Error al confirmar',
            text: 'No se pudo confirmar tu cuenta. Intenta nuevamente.',
        });
    }
};
const tokenStatus = ref<boolean>(false);

onMounted(() => {
    const token = route.query.token || route.params.token || null;

    if (token && typeof token === 'string') {

        registerUserToken(token);
    }
});

</script>

<template>
    <div class="w-screen h-min-screen">
        <Navbar />
        <div v-if="tokenStatus"
            style="font-family: Arial, sans-serif; line-height: 1.6; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center;">

            <!-- <div
            style="width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; padding: 20px;">
            <p style="font-size: xx-large; font-weight: bold;">Cuidar de tu salud visual nunca ha sido
                tan fácil</p>
            <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746055258/tjmtqw8awfczaycthqco.png" alt="Logo"
                style="height: auto; margin-bottom: 20px;">

        </div>
        <h1  class="py-3 text-2xl" style="font-weight: bold;">¡Hola!</h1>
        <p>Gracias por registrarte en DocVisual – Directorio Online de Salud Visual.
            Accede a tu cuenta desde docvisual.co y:
        </p>
     


        <hr style="width: 100%; border: 1px solid #ccc; margin: 20px 0;">
        <div>
            <p style="font-size: 12px; color: #888;">Has recibido este email porque utilizas nuestros servicios. Este es
                email transaccional, lo que significa que está vinculado a alguna de las acciones que hayas realizado en
                DocVisual. Si necesitas más información, puedes contactarnos a través del email: hola@docvisual.co</p>
            <p style="font-size: 12px; color: #888; text-align: left;">DocVisual S.A.S
                Bogotá, Colombia
            </p>
            <p style="font-size: 12px; color: #888; text-align: left;">Bogotá, Colombia.</p>
        </div> -->

        </div>
        <div v-else>
            <!-- <div
            style="font-family: Arial, sans-serif; line-height: 1.6; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center;">
            <div
                style="background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 20px; border-radius: 5px; text-align: center;">
                <h1 style="font-size: xx-large; font-weight: bold;">¡Error!</h1>
                <p style="font-size: large;">El token proporcionado no es válido o ha expirado.</p>
                <p style="font-size: medium;">Por favor, verifica el enlace o solicita un nuevo token.</p>
            </div>
        </div> -->
        </div>
        <!-- <Colors /> -->
    </div>
</template>