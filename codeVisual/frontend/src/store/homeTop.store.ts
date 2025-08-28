
import type { user_professional_search_dto } from "@/dto/professional";

import axios from "axios";
import { defineStore } from "pinia";

export const HomeTopStore = defineStore('HomeTopStrore', {
    state: () => ({
        list_professionals: [] as user_professional_search_dto[]
    }),
    actions: {

        async load_specialists() {
            try {
                const navegation = `/partner/filter?page=1&limit=3`;
                const response = await axios.post(navegation);
                if (response.data.status === 200) {
                    this.list_professionals = response.data.data;
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en traer los especialistas.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        

    }

})