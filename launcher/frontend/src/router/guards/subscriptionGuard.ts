import { useAuthStore } from '@/store/auth.store';
import { useSubscriptionStore } from '@/store/subscription.store';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const subscriptionGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  const subscriptionStore = useSubscriptionStore();
  
  const user = authStore.user;
  
  // Solo aplicar a usuarios USER_PARTNER (especialistas)
  if (!user || user.role !== 'USER_PARTNER') {
    return next();
  }

  try {
    await subscriptionStore.fetchUserSubscription();
    
    // Si no tiene suscripción o está vencida, permitir acceso pero mostrar modal
    // El modal se mostrará en el componente de la página
    next();
  } catch (error) {
    // En caso de error, permitir acceso pero el modal se mostrará
    next();
  }
};