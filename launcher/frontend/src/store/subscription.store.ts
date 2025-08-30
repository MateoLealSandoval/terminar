import { defineStore } from 'pinia';
import axios from 'axios';

export interface Subscription {
  id: string;
  userId: string;
  planType: 'BASIC' | 'STANDARD' | 'PREMIUM';
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  startDate: string;
  endDate: string;
  amount: number;
}

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscription: null as Subscription | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isSubscriptionActive: (state) => {
      if (!state.subscription) return false;
      return state.subscription.status === 'ACTIVE' && new Date(state.subscription.endDate) > new Date();
    },
    
    isSubscriptionExpired: (state) => {
      if (!state.subscription) return true;
      return state.subscription.status === 'EXPIRED' || new Date(state.subscription.endDate) <= new Date();
    },
    
    hasSubscription: (state) => {
      return !!state.subscription;
    }
  },

  actions: {
    async fetchUserSubscription() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/subscription');
        this.subscription = response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar suscripción';
        this.subscription = null;
      } finally {
        this.loading = false;
      }
    },

    async createSubscription(data: { planType: string; months: number; amount: number; paymentId?: string }) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/subscription/create', data);
        this.subscription = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear suscripción';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async renewSubscription(data: { months: number; amount: number; paymentId?: string }) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/subscription/renew', data);
        this.subscription = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al renovar suscripción';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearSubscription() {
      this.subscription = null;
      this.error = null;
    }
  }
});