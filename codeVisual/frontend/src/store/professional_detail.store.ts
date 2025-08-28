

import type { ScheduleByDay, Search_day, Search_dayRequest, Times_shedules } from "@/dto/profession_detail";
import type { ListDateDetail } from "@/dto/profession_detail/ListDatesDetail.dto";
import type { user_professional_dto_user } from "@/dto/professional";
import { ModelResponse } from "@/models/AxiosResponse";
import type { CalificationSummary } from "@/models/Califications";
import axios from "axios";
import { defineStore } from "pinia";

export const useProfesionalDetailStore = defineStore('prefessional_detail', {

    state: () => ({
        califications_summary: null as CalificationSummary | null,
        profesional_detail: null as user_professional_dto_user | null,
        actually_days: {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
            SATURDAY: [],
            SUNDAY: []
        } as ScheduleByDay,
        favorite: false
    }),
    actions: {
        async getProfessional(id: string) {
            try {
                const responde = await axios.get<ModelResponse<any>>(`/partner/specialist/${id}`)
                const { status } = responde;
                if (status === 200) {

                    this.profesional_detail = responde.data.data
                    // loadPrepagadasDefaul
                    if (this.profesional_detail?.prepagadas) {
                        this.profesional_detail.prepagadas.push(
                            { id: "1234", type: "SITE", name: "Particular", status: "" },
                            { id: "5678", type: "SITE", name: "Otros", status: "" }
                        );
                    }

                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en traer los especialistas.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },

        async get_calification(id: string) {
            try {
                const responde = await axios.get(`/reservations-calendar/profeccional-calification/${id}`)

                if (responde.data.status === 200) {
                    this.califications_summary = responde.data.data
                    console.log(this.califications_summary)
                } else {
                    throw new Error("Error en traer la calificación.");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en traer las calificaciones.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async get_shedules(officineId: string, dates: ListDateDetail[]) {
            try {

                const dayItems: Search_day[] = dates.map(value => ({
                    day: value.nameday,
                    date: `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`
                }));
                console.log(dayItems)
                const request: Search_dayRequest = {
                    officeId: officineId,
                    Get_shedule_date: dayItems
                }
                const response = await axios.post('/reservations/search-day', request)
                if (response.data.status === 200) {
                    console.log(response.data.data)

                    this.actually_days = response.data.data

                    await this.check_favorite();
                }

            } catch (error) {
                throw new Error("Ha ocurrido un error inesperado.");
            }
        },
        async check_favorite() {
            try {
                const response = await axios.get(`/favorites/check/${this.profesional_detail?.id}`)

                if (response.data.status === 200) {
                    this.favorite = response.data.data;

                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en checkear si es favorito.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async add_favorite(id: string) {
            try {

                const response = await axios.post(`/favorites/create/${id}`)
                if (response.data.status === 200) {
                    this.favorite = true;

                } else {
                    throw new Error("Respuesta inesperada del servidor.");
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en la autenticación.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async delete_favorite(id: string) {
            try {

                const response = await axios.delete(`/favorites/${id}`)
                if (response.data.status === 200) {
                    this.favorite = false;

                } else {
                    throw new Error("Respuesta inesperada del servidor.");
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en la autenticación.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        clear_data() {
            this.profesional_detail = null
            this.favorite = false
        }

    },

})