import type { InformationAdminPanelDto } from '@/dto/AdminPanel'
import axios from 'axios'
import { defineStore } from 'pinia'




export const use_adminPanel_information = defineStore('use_adminPanel_information', {
    state: () => ({
        informationdata: null as InformationAdminPanelDto | null
    }),
    actions: {
        async getInformation() {
            try {
                const response = await axios.get('/auth/panel-data-users')

                if (response.status === 200) {
                    console.log(response.data.data)
                    this.informationdata = response.data.data
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new Error(error.response?.data?.message || "Error al traer datos");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
    }

})