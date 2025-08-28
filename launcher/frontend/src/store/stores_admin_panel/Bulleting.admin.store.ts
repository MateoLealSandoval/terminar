
 
import type { userBulletingDto } from "@/dto/AdminPanel/UsersBulleting.dto";
import type { meta_model } from "@/models/model_commont/meta.model";
import axios from "axios";
import { defineStore } from "pinia";

export const store_admin_bulleting = defineStore('store_admin_bulleting', {
    state: () => ({
        users: [] as userBulletingDto[] | [],
        meta: null as meta_model | null,
        page: 1,
        limit: 5,
        total: 0,
    }),
    actions: {
        async get_all_users() {
            try {
                const response = await axios.get(`/supcription?page=${this.page}&limit=${this.limit}`);
                if (response.data.status === 200) {
                    this.users = response.data.data;
                    this.meta = response.data.meta;
                    this.page = response.data.meta.page;
                    this.total = response.data.meta.total;
                    console.log(this.users)
                }
            } catch (error) {
                console.error("Error al cargar notificaciones:", error);
            }
        },
        async goToPage(page: number) {
            this.page = page;
            await this.get_all_users();
        },
 

        reset() {
            this.page = 1;
            this.total = 0;
            this.meta = null;
        }
    },

});
