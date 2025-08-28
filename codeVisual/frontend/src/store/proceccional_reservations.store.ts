import axios from "axios";
import { defineStore } from "pinia";
import type { datas_List_reservation_profeccional_model } from "@/models/user_reservations/list_reservations_profeccional";



export const profeccional_reservations_store = defineStore('profeccional_reservations', {

    state: () => ({
        list_reservations: [] as datas_List_reservation_profeccional_model[] | []
    }),


    actions: {
        async get_my_reviews() {
            try {
                const response = await axios.get('/reservations-calendar/profeccional')
           
                if (response.data.status === 200) {
                    this.list_reservations = response.data.data
                 
                } else {
                    throw new Error("Error en mostrar reservas.");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en traer las especialidades");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        }

    }
})