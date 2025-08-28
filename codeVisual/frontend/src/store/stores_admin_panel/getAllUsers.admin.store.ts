
import type { UsersPanelAdminDtos } from "@/dto/AdminPanel";
import type { meta_model } from "@/models/model_commont/meta.model";
import axios from "axios";
import { defineStore } from "pinia";

export const store_admin_get_all_users = defineStore('store_admin_get_all_users', {
    state: () => ({
        users: [] as UsersPanelAdminDtos[] | [],
        meta: null as meta_model | null,
        page: 1,
        limit: 5,
        total: 0,
    }),
    actions: {
        async get_all_users() {
            try {
                const response = await axios.get(`/auth/get-all-users?page=${this.page}&limit=${this.limit}`);
                if (response.data.status === 200) {

                    this.users = response.data.data;
                    this.meta = response.data.meta;
                    this.page = response.data.meta.page;
                    this.total = response.data.meta.total;

                }
            } catch (error) {
                console.error("Error al cargar notificaciones:", error);
            }
        },
        async goToPage(page: number) {
            this.page = page;
            await this.get_all_users();
        },
        async setState_users(id: string, status: string) {
            try {
                const response = await axios.patch(`/auth/update-users/${id}`, {
                    status: status
                });
                if (response.data.status === 200) {
                    console.log(response.data)
                }
            } catch (error) {
                console.error("Error al cambiar estado:", error);
            }
        },

        reset() {
            this.page = 1;
            this.total = 0;
            this.meta = null;
        }
    },

});
