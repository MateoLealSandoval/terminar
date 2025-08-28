import axios from "axios";
import { defineStore } from "pinia";

import type { meta_model } from "@/models/model_commont/meta.model";
import type { notifications, ResponseNotifications } from "@/dto/notifications";

export const useNotificationsStore = defineStore('useNotificationsStore', {
    state: () => ({
        notifications: [] as notifications[],
        meta: null as meta_model | null,
        page: 1,
        limit: 7,
        total: 0,
        totalpage:0
    }),
    actions: {
        async getNotifications() {
            try {
                const response = await axios.get(`/notification?page=${this.page}&limit=${this.limit}`);
                if (response.data.status === 200) {
                    const data = response.data as ResponseNotifications;     
                    this.notifications = data.data;
                    this.meta = data.meta;
                    this.page = data.meta.page;
                    this.total = data.meta.total;
                   
                }
            } catch (error) {
                console.error("Error al cargar notificaciones:", error);
            }
        },
        async goToPage(page: number) {
            this.page = page;
            await this.getNotifications();
        },
        async getNotification(notification: notifications) {
            try {
                const response = await axios.get(`/notification/${notification.id}`);
                if (response.data.status === 200) {
               
                    await this.getNotifications()
                }
            } catch (error) {
                console.error("Error al cargar notificaciones:", error);
            }
        },
        reset() {
            this.notifications = [];
            this.page = 1;
            this.total = 0;
            this.meta = null;
        }
    },

});
