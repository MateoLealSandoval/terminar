import type { PaginationDto } from "@/dto/Pagination.dto";
import type { filters_profesional, Specialist_dto, user_professional_search_dto } from "@/dto/professional";
import type { citys_dto } from "@/dto/professional/citys.dto";
import type { ModelResponse } from "@/models/AxiosResponse";
import axios from "axios";
import { defineStore } from "pinia";

export const useSearchProfesionalStorage = defineStore('search_professionals', {

    state: () => ({
        profesionals: [],
        specialties: [] as Specialist_dto[],
        citys: [] as citys_dto[],
        list_professionals: [] as user_professional_search_dto[]
    }),
    actions: {
        async provide_specialties() {
            try {
                const response = await axios.get('/partner-specialits/specialist')
                if (response.data.status === 200) {
                    this.specialties = response.data.data
                }
                else {
                    throw new Error("Error en actualizar los datos.");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en traer las especialidades");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async load_specialists(PaginationDto: PaginationDto, filters_profesional: filters_profesional) {
            try {
                let navegation = '/partner/filter';

                if (PaginationDto.limit && PaginationDto.page) {
                    navegation = `/partner/filter?page=${PaginationDto.page}&limit=${PaginationDto.limit}`;
                }

                // Verificar si `filters_profesional` está vacío antes de enviarlo
                const hasFilters = Object.values(filters_profesional).some(value =>
                    Array.isArray(value) ? value.length > 0 : Boolean(value)
                );

                const response = await axios.post(navegation, hasFilters ? filters_profesional : undefined);

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
        async loadPrepago() {
            try {
                const response = await axios.get<ModelResponse<any>>('/prepagada');
                const { data, status } = response;
                console.log('hola1')
                if (status === 200) {
                    console.log('hola2')
                    console.log("prepago", data)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en traer las especialidades");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async provide_citys() {
            try {
                const response = await axios.get('/partner-offices/citys')
                if (response.data.status === 200) {
                    this.citys = response.data.data

                }
                else {
                    throw new Error("Error en actualizar los datos.");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en traer las especialidades");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        }

    },

})