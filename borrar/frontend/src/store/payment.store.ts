import type { create_reservation_dto } from "@/dto/payment/create_reservation.dto";
import type { ListDateDetail } from "@/dto/profession_detail";
import type { add_office_professional_dto_id } from "@/dto/professional/office_professional";
import type { ModelResponse } from "@/models/AxiosResponse";
import axios, { type responseEncoding } from "axios";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const usePaymentStore = defineStore('payment_to_professional', {

    state: () => ({
        id_profeccional: '',
        select_service: null as {
            id: string;
            name: string;
            price: number;
            status: string;
            UserDataId: string;
        } | null,
        select_office: null as add_office_professional_dto_id | null,
        select_payment: null as { name: string; type:  'SITE' | 'ANTICIPATED' } | null,
        select_shedule: null as {
            id: string,
            date: ListDateDetail;
            openTime: string;
            closeTime: string;
        } | null,
        tokenConfirmationCode: null as string | null,
    }),



    actions: {
        // ClearData() {
        //     this.select_service = null;
        //     this.select_office = null;
        //     this.select_eps = '';
        //     this.select_shedule = null;
        // },
        FillDataAndNavigate(service: {
            id: string;
            name: string;
            price: number;
            status: string;
            UserDataId: string;
        },
            office: add_office_professional_dto_id,
            eps: {name:string,type: 'SITE' | 'ANTICIPATED'},
            shedule: {
                id: string;
                date: ListDateDetail;
                openTime: string;
                closeTime: string;
            },
            idProfeccional: string,
            router: ReturnType<typeof useRouter>
        ) {


            this.select_office = office;
            this.select_payment = eps;
            this.select_shedule = shedule;
            this.id_profeccional = idProfeccional
            this.select_service = service

            if (this.select_service && this.select_office && this.select_payment && this.select_shedule && this.id_profeccional) {
                router.push('/payment');
            }
        },
        async save_reservation(create_reservation_dto: create_reservation_dto) {
            try {

                const response = await axios.post('/emails/reservation', create_reservation_dto)
                if (response.data.status === 200) {

                    this.tokenConfirmationCode = response.data.token
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error en cargar horarios.");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }

        },
        async confirm_reservation(code: number): Promise<string> {
            try {
                const response = await axios.post<ModelResponse<string>>('/emails/confirm', {
                    token: this.tokenConfirmationCode,
                    code: code
                })

                const { status, data } = response.data;
                if (status === 200) {
                    return data
                } else {
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


    }
})