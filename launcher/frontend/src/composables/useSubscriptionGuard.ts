import { ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth.store';
import { useSubscriptionStore } from '@/store/subscription.store';
import { useRouter } from 'vue-router';

export function useSubscriptionGuard() {
  const authStore = useAuthStore();
  const subscriptionStore = useSubscriptionStore();
  const router = useRouter();
  
  const showModal = ref(false);
  const modalData = ref({
    title: '',
    message: '',
    buttonText: ''
  });

  const checkSubscriptionAccess = async () => {
    const user = authStore.user;
    
    // Solo aplicar restricción a especialistas (USER_PARTNER)
    if (!user || user.role !== 'USER_PARTNER') {
      return true;
    }

    try {
      await subscriptionStore.fetchUserSubscription();
      
      // Si no tiene suscripción
      if (!subscriptionStore.hasSubscription) {
        modalData.value = {
          title: 'Adquiere tu Plan',
          message: 'Usted aún no ha adquirido su plan. Por favor adquiéralo para acceder a todas las funcionalidades.',
          buttonText: 'Ver Planes'
        };
        showModal.value = true;
        return false;
      }
      
      // Si la suscripción está vencida
      if (subscriptionStore.isSubscriptionExpired) {
        modalData.value = {
          title: 'Plan Vencido',
          message: 'Su plan se ha vencido. Por favor renueve o cambie de plan para continuar accediendo a las funcionalidades.',
          buttonText: 'Renovar Plan'
        };
        showModal.value = true;
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error verificando suscripción:', error);
      // En caso de error, mostrar modal de plan no adquirido
      modalData.value = {
        title: 'Verificación Requerida',
        message: 'No se pudo verificar su suscripción. Por favor verifique su plan.',
        buttonText: 'Ver Planes'
      };
      showModal.value = true;
      return false;
    }
  };

  const closeModal = () => {
    showModal.value = false;
    // Redirigir a home o página anterior
    router.push('/');
  };

  return {
    showModal,
    modalData,
    checkSubscriptionAccess,
    closeModal
  };
}