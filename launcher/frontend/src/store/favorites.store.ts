
import type { list_favorites_model } from "@/models/Favorites/listFavorites.dto";
import type { meta_model } from "@/models/model_commont/meta.model";
import axios from "axios";
import { defineStore } from "pinia";

export const favoritesStore = defineStore('favoritesStores', {
    state: () => ({
        list_favorites: [] as list_favorites_model[],
        meta: {
            total: 0,
            page: 1,
            lastPage: 0
        } as meta_model,
        limit:5
    }),
    actions: {
        async delete_data(){
            this.meta = {
                total: 0,
                page: 1,
                lastPage: 0
            } ;
            this.list_favorites=[];
        },

        async get_favorites() {
            try {
                const response = await axios.get(`/favorites?page=${this.meta.page}&limit=${this.limit}`);


                if (response.data.status === 200) {
                    this.meta = response.data.meta;
                    this.list_favorites = response.data.data; // ← Asegúrate de esto según tu backend
                 
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    console.error("Axios error:", error.response?.data || error.message);
                    throw new Error(error.response?.data?.message || "Error al obtener favoritos.");
                } else {
                    console.error("Error inesperado:", error);
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
    }

})