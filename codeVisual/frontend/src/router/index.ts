import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home/Home.vue'
import Frecuent_questions from '@/views/Frequent_questions/Frecuent_questions.vue';
import Blog from '@/views/Blogs/Blog.vue';
import Blog_Detail from '@/Modules/Blogs/Blog_Detail.vue';
import Auth from '@/views/Auth/Auth.vue';
import AuthPartner from '@/views/AuthPartner/AuthPartner.vue';
import Specialists from '@/views/specialists/Specialists.vue';
import SpecialistDetail from '@/Modules/Specialists/SpecialistDetail.vue';
import Purpose from '@/views/Purpose/Purpose.vue';
import Price from '@/views/Price/Price.vue';
import panel_user_Professional from '@/views/Panel_User_Professional/panel_user.vue';
import Panel_user from '@/views/Panel_user/My_account.vue';
import Contact from '@/views/contact/Contact.vue';
import { useAuthStore } from '@/store';
import Payment from '@/views/Payment/Payment.vue';
import Token_User from '@/Modules/confirm_tokens/Token_User.vue';
import terms from '@/views/terms/Terms.vue';
import data from '@/views/terms/data.vue';
import Reset_Password from '@/Modules/reset_password/Reset_Password.vue';
import Confirmation from '@/Modules/confirmation/Confirmation.vue';
import PanelAdmin from '@/views/panelAdmin/PanelAdmin.vue';
import Services from '@/views/services/Services.vue';
import adminProfessionals from '@/views/Admin/AdminProfessionals.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = import.meta.env.BASE_URL || "http://localhost:8080";

// Función para verificar estado de pago
async function checkPaymentStatus(userId: string): Promise<boolean> {
  try {
    const response = await axios.get(`/users/payment-status/${userId}`);
    return response.data.hasPaid && response.data.isActive;
  } catch (error) {
    console.error('Error verificando estado de pago:', error);
    return false;
  }
}

const router = createRouter({
  history: createWebHistory(route),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/terms',
      name: 'terms',
      component: terms
    },
    {
      path: '/data',
      name: 'data',
      component: data
    },
    {
      path: '/questions',
      name: 'questions',
      component: Frecuent_questions,
    },
    {
      path: '/createuser/:token',
      name: 'createuser',
      component: Token_User,
    },
    {
      path: '/reset/:token',
      name: 'reset',
      component: Reset_Password,
    },
    {
      path: '/confirmacion',
      name: 'confirmacion',
      component: Confirmation
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: Blog,
    },
    {
      path: '/blogs/:id',
      name: 'BlogDetail',
      component: Blog_Detail,
      props: true
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
    },
    {
      path: '/auth-professional',
      name: 'authParthner',
      component: AuthPartner,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/specialists',
      name: 'specialists',
      component: Specialists,
    },
    {
      path: '/specialist/:id',
      name: 'specialistdetail',
      component: SpecialistDetail,
      props: true
    },
    {
      path: '/planes',
      name: 'planes',
      component: Price
    },
    {
      path: '/purpose',
      name: 'purpose',
      component: Purpose
    },
    {
      path: '/paneluser',
      name: 'paneluser',
      component: panel_user_Professional,
      meta: { requiresAuth: true, requiresPartner: true }
    },
    {
      path: '/paneladmin',
      name: 'paneladmin',
      component: PanelAdmin,
      meta: { requiresAdmin: true, requiresAuth: true }
    },
    {
      path: '/accountuser',
      name: 'accountuser',
      component: Panel_user,
      meta: { requiresAuth: true }
    },
    {
      path: '/payment',
      name: 'payment',
      component: Payment
    },
    {
      path: '/services',
      name: 'services',
      component: Services
    },
    {
      path: '/admin/profesionales',
      name: 'adminProfessionals',
      component: adminProfessionals,
      meta: { requiresAdmin: true, requiresAuth: true }
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;
  const role = authStore.user?.role;

  // Si no está autenticado y la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/auth");
  }

  // Solo ADMIN y SUPER_ADMIN pueden entrar a /paneladmin
  if (to.name === "paneladmin" && !(role === "SUPER_ADMIN" || role === "ADMIN")) {
    return next("/");
  }

  // Verificar pago para profesionales antes de acceder al panel
  if (to.name === "paneluser" && role === "USER_PARTNER") {
    const hasPaid = await checkPaymentStatus(authStore.user?.id || '');
    if (!hasPaid) {
      await Swal.fire({
        icon: 'warning',
        title: 'Plan Requerido',
        text: 'Necesitas adquirir un plan para acceder a tu panel profesional',
        confirmButtonText: 'Ver Planes',
        confirmButtonColor: 'var(--blue-1)'
      });
      return next("/planes");
    }
  }

  // Si va a /auth y ya está autenticado → redirigir al panel según el rol
  if (to.name === "auth" && isAuthenticated) {
    if (role === "USER") return next("/accountuser");
    if (role === "USER_PARTNER") return next("/paneluser");
    if (role === "ADMIN" || role === "SUPER_ADMIN") return next("/paneladmin");
  }

  if (to.name === "authParthner" && isAuthenticated) {
    if (role === "USER") return next("/accountuser");
    if (role === "USER_PARTNER") return next("/paneluser");
    if (role === "ADMIN" || role === "SUPER_ADMIN") return next("/paneladmin");
  }
  
  next();
});

export default router