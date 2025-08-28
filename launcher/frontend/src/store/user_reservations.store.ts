import axios from "axios";
import { defineStore } from "pinia";
import type { datas_List_reservation_user_model } from "@/models/user_reservations";



export const use_reservations_store = defineStore('user_reservations', {

    state: () => ({
        list_reservations: [] as datas_List_reservation_user_model[] | []
    }),


    actions: {
        async get_my_reviews() {
            try {
                const response = await axios.get('/reservations-calendar/user');

                if (response.data.status === 200) {
                    const filterdata = response.data.data.filter(
                        (reservation: datas_List_reservation_user_model) =>
                            reservation.status === 'ACTIVE' || reservation.status === 'PENDING'
                    );

                    this.list_reservations = filterdata;


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
        },

        async cancel_reservationUser(reservationId: string) {
            try {
                const response = await axios.delete(`/reservations-calendar/cancel/user/${reservationId}`);
                if (response.data.status === 200) {

                    this.get_my_reviews(); // Actualizar la lista de reservas después de cancelar

                } else {
                    throw new Error("Error en mostrar reservas.");
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(error.response?.data?.message || "Error en traer las especialidades");
                    throw new Error(error.response?.data?.message || "Error en traer las especialidades");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        }

    }
})