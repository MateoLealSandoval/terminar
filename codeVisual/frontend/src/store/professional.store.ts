import type { Specialist_dto, user_professional_body_dto, user_professional_dto } from "@/dto/professional";
import type { add_office_professional_dto } from "@/dto/professional/office_professional";
import type { ServicesDto, ServicesDtoBody } from "@/dto/professional/Services-Dto";
import type { Get_shedule_dto, Shedule, Shedule_item, Shedule_item_complete } from "@/dto/professional/shedules";
import type { ModelResponse } from "@/models/AxiosResponse";
import type Price from "@/views/Price/Price.vue";
import axios from "axios";
import { defineStore } from "pinia";




export const usePofessionalStorage = defineStore('professional', {

    state: () => ({
        professional_detail: null as user_professional_dto | null,
        special: [] as Specialist_dto[],
        prepago: [] as Specialist_dto[],
        shedule_data: [] as Shedule_item_complete[],
    }),
    actions: {
        async update_user_professional(user_professional_dto: user_professional_body_dto) {
            const filteredData = Object.fromEntries(
                Object.entries(user_professional_dto).filter(([_, value]) => value !== undefined && value !== null)
            );
            const response = await axios.post('/partner/specialist', filteredData)

            if (response.data.status === 200) {
                console.log(response.data)
            } else {
                throw new Error("Error en actualizar los datos.");
            }
        },
        async add_office_professional(add_office_professional_dto: add_office_professional_dto) {
            const response = await axios.post('/partner-offices/add', add_office_professional_dto)
            if (response.data.status === 200) {
                this.get_user_profesional_detail()
            } else {
                throw new Error("No se creo el consultorio.");
            }
        },
        async get_user_profesional_detail() {
            const response = await axios.get(`/partner/specialist-user`)
            if (response.data.status === 200) {
                console.log("datos", response.data.data)
                this.professional_detail = response.data.data
                

            } else {
                throw new Error("Error en actualizar los datos.");
            }
        },
        async provide_specialties() {
            const response = await axios.get('/partner-specialits/specialist')
            if (response.data.status === 200) {
                this.special = response.data.data

            }
            else {
                throw new Error("Error en actualizar los datos.");
            }
        },
        async create_service(ServicesDto: ServicesDto) {
            try {
                const response = await axios.post('/services', ServicesDto)
                if (response.data.status === 200) {

                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
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
                const response = await axios.get<ModelResponse<Specialist_dto[]>>('/prepagada');
                const { data, status } = response;
                console.log('hola1')
                if (status === 200) {
 
                    this.prepago = data.data;
                    console.log("prepagofinal", this.prepago)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en traer las especialidades");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
    
        async Put_service(ServicesDtoBody: ServicesDtoBody) {
            try {
                const response = await axios.put('/services', { price: ServicesDtoBody.price, id: ServicesDtoBody.id })

                if (response.data.status === 200) {

                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en editar el servicio.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async get_shedules_office(Get_shedule_dto: Get_shedule_dto) {
            try {
                const url = `/reservations?officeId=${Get_shedule_dto.officeId}&day=${Get_shedule_dto.day}`
                const response = await axios.get(url)
                if (response.status === 200) {
                    const data = response.data.data;
                    // Verificamos si hay datos y si hay items
                    this.shedule_data = data.length > 0 && data[0].items.length > 0 ? data[0].items : [];
                } else {
                    this.shedule_data = [];
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en cargar horarios.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        }

    },


})