<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../Home/Navbar.vue';
import Footer from '../Home/Footer.vue';
import HeaderPrice from '../price/HeaderPrice.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const router = useRouter();
const isProcessing = ref(false);
const paymentVerified = ref(false);

onMounted(async () => {
  // Verificar si viene de Epayco con parámetros
  const urlParams = new URLSearchParams(window.location.search);
  const ref_payco = urlParams.get('ref_payco');
  const userId = urlParams.get('x_extra1');
  const planType = urlParams.get('x_extra2');
  const userEmail = urlParams.get('x_extra3');
  const userRole = urlParams.get('x_extra4');
  
  if (ref_payco && userId && userRole === 'USER_PARTNER') {
    isProcessing.value = true;
    
    try {
      // Verificar el pago con el backend
      const response = await axios.post('/users/verify-payment', {
        ref_payco,
        userId,
        planType
      });
      
      if (response.data.success) {
        paymentVerified.value = true;
        
        // Activar cuenta del especialista
        await axios.post('/users/activate-professional', {
          userId,
          planType,
          transactionRef: ref_payco
        });
        
        // Enviar email de confirmación
        await axios.post('/emails/payment-confirmation', {
          email: userEmail,
          planType,
          userName: response.data.userName
        });
        
        await Swal.fire({
          icon: 'success',
          title: '¡Pago Exitoso!',
          text: 'Tu plan ha sido activado. Ya puedes crear tu perfil profesional.',
          confirmButtonText: 'Continuar',
          confirmButtonColor: 'var(--blue-1)'
        });
      } else {
        throw new Error('El pago no fue aprobado');
      }
    } catch (error) {
      console.error('Error verificando pago:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Error en el Pago',
        text: 'Hubo un problema verificando tu pago. Por favor contacta soporte.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: 'var(--blue-1)'
      });
      
      router.push('/planes');
    } finally {
      isProcessing.value = false;
    }
  }
});

const goToCreateAccount = () => {
  router.push('/auth-professional');
};
</script>

<template>
  <div class="w-screen">
    <Navbar />
    <HeaderPrice />
    
    <div class="font-poppins w-screen bg-gray-200 py-10 flex flex-col justify-center items-center min-h-[60vh]">
      
      <!-- Procesando pago -->
      <div v-if="isProcessing" class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--blue-1)] mx-auto mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-700">Verificando tu pago...</h2>
        <p class="mt-2 text-gray-500">Por favor espera un momento</p>
      </div>
      
      <!-- Pago verificado o vista por defecto -->
      <div v-else class="text-center">
        <h1 class="font-bold text-2xl text-[var(--blue-1)] mb-5">
          Bienvenido a DocVisual
        </h1>
        
        <h1 v-if="paymentVerified" class="text-[var(--blue-1)] mb-5">
          ¡Tu pago ha sido procesado exitosamente!
        </h1>
        <h1 v-else class="text-[var(--blue-1)] mb-5">
          Gracias por adquirir tu plan
        </h1>
        
        <p v-if="paymentVerified" class="text-gray-600 mb-8 max-w-md mx-auto">
          Tu cuenta profesional ha sido activada. Ahora puedes crear tu perfil y empezar a recibir pacientes.
        </p>
        
        <button 
          @click="goToCreateAccount"
          class="bg-[var(--blue-1)] cursor-pointer py-2 px-6 rounded-xl text-white hover:opacity-90 transition-opacity"
        >
          <h1 v-if="paymentVerified">Ir a mi cuenta</h1>
          <h1 v-else>Crea tu cuenta</h1>
        </button>
      </div>
      
    </div>

    <Footer />
  </div>
</template>