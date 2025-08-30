<template>
  <div :id="containerId"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, onUnmounted } from 'vue';
import { useSubscriptionStore } from '@/store/subscription.store';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'vue3-toastify';

const props = defineProps<{
  amount: string;
  name: string;
  description: string;
  planType?: string; // Agregar esta prop para el tipo de plan
}>();

const subscriptionStore = useSubscriptionStore();
const authStore = useAuthStore();

// ID único para evitar conflictos si hay varios botones en pantalla
const containerId = `epayco-button-${Math.random().toString(36).substring(2, 10)}`;

// Función para manejar el éxito del pago
const handlePaymentSuccess = async (response: any) => {
  try {
    console.log('Payment Success Response:', response);
    
    // Solo crear suscripción si es un especialista y tiene planType
    if (props.planType && authStore.user?.role === 'USER_PARTNER') {
      
      // Mostrar loading mientras se procesa
      toast.info('Procesando su suscripción...', {
        position: 'top-right',
        autoClose: 5000,
      });

      // Determinar los meses según el plan
      let months = 1; // Por defecto 1 mes
      
      // Puedes ajustar esto según tus reglas de negocio
      switch (props.planType.toUpperCase()) {
        case 'BASIC':
          months = 1;
          break;
        case 'STANDARD':
          months = 1;
          break;
        case 'PREMIUM':
          months = 1;
          break;
        default:
          months = 1;
      }

      // Crear la suscripción
      await subscriptionStore.createSubscription({
        planType: props.planType.toUpperCase(),
        months: months,
        amount: parseFloat(props.amount),
        paymentId: response.transactionId || response.ref_payco || response.x_ref_payco
      });

      toast.success('¡Suscripción creada exitosamente!', {
        position: 'top-right',
        autoClose: 5000,
      });

      // Opcional: redirigir al panel del usuario después de un delay
      setTimeout(() => {
        window.location.href = '/paneluser';
      }, 2000);

    } else {
      // Para pagos que no son suscripciones (servicios, etc.)
      toast.success('¡Pago procesado exitosamente!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  } catch (error: any) {
    console.error('Error creando suscripción:', error);
    toast.error(`Error al procesar la suscripción: ${error.message || 'Error desconocido'}`, {
      position: 'top-right',
      autoClose: 8000,
    });
  }
};

// Función para manejar errores de pago
const handlePaymentError = (error: any) => {
  console.error('Payment Error:', error);
  toast.error('Error en el procesamiento del pago. Por favor intente nuevamente.', {
    position: 'top-right',
    autoClose: 5000,
  });
};

// Función para manejar pagos pendientes
const handlePaymentPending = (response: any) => {
  console.log('Payment Pending:', response);
  toast.warning('Su pago está pendiente de confirmación. Recibirá una notificación cuando se complete.', {
    position: 'top-right',
    autoClose: 8000,
  });
};

// Listener para eventos de ePayco
const handleEPaycoResponse = (event: MessageEvent) => {
  if (event.origin !== window.location.origin) return;
  
  const data = event.data;
  
  if (data && typeof data === 'object') {
    switch (data.type) {
      case 'epayco-payment-success':
        handlePaymentSuccess(data);
        break;
      case 'epayco-payment-error':
        handlePaymentError(data);
        break;
      case 'epayco-payment-pending':
        handlePaymentPending(data);
        break;
      default:
        console.log('Unhandled ePayco event:', data);
    }
  }
};

function insertEpaycoButton() {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''; // limpia cualquier script anterior

  const script = document.createElement('script');
  script.src = 'https://checkout.epayco.co/checkout.js';
  script.className = 'epayco-button';
  script.setAttribute('data-epayco-key', 'da79c01f86155c49f6a698202aa12042');
  script.setAttribute('data-epayco-amount', props.amount);
  script.setAttribute('data-epayco-tax', '0.00');
  script.setAttribute('data-epayco-tax-ico', '0.00');
  script.setAttribute('data-epayco-tax-base', props.amount);
  script.setAttribute('data-epayco-name', props.name);
  script.setAttribute('data-epayco-description', props.description);
  script.setAttribute('data-epayco-currency', 'cop');
  script.setAttribute('data-epayco-country', 'CO');
  script.setAttribute('data-epayco-test', 'false');
  script.setAttribute('data-epayco-external', 'false');
  script.setAttribute('data-epayco-response', '');
  script.setAttribute('data-epayco-confirmation', 'https://www.docvisual.co/confirmacion');
  script.setAttribute('data-epayco-button', 'https://multimedia.epayco.co/dashboard/btns/btn5.png');

  // Agregar información adicional si es una suscripción
  if (props.planType) {
    script.setAttribute('data-epayco-extra1', `plan_type_${props.planType}`);
    script.setAttribute('data-epayco-extra2', `user_id_${authStore.user?.id || ''}`);
  }

  container.appendChild(script);
}

onMounted(() => {
  insertEpaycoButton();
  
  // Agregar listener para eventos de ePayco
  window.addEventListener('message', handleEPaycoResponse);
  
  // También escuchar eventos personalizados de ePayco si los usan
  window.addEventListener('epayco-payment-success', (event: any) => {
    handlePaymentSuccess(event.detail);
  });
  
  window.addEventListener('epayco-payment-error', (event: any) => {
    handlePaymentError(event.detail);
  });
  
  window.addEventListener('epayco-payment-pending', (event: any) => {
    handlePaymentPending(event.detail);
  });
});

onUnmounted(() => {
  // Limpiar listeners al desmontar el componente
  window.removeEventListener('message', handleEPaycoResponse);
  window.removeEventListener('epayco-payment-success', handlePaymentSuccess as any);
  window.removeEventListener('epayco-payment-error', handlePaymentError as any);
  window.removeEventListener('epayco-payment-pending', handlePaymentPending as any);
});

watch(() => [props.amount, props.name, props.description, props.planType], () => {
  insertEpaycoButton();
});
</script>

<style scoped>
/* Estilos para el contenedor del botón de ePayco */
#epayco-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Personalizar el botón de ePayco si es necesario */
:deep(.epayco-button) {
  width: 100%;
  max-width: 200px;
  transition: transform 0.2s ease;
}

:deep(.epayco-button:hover) {
  transform: scale(1.05);
}
</style>