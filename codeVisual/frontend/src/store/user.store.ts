import type { createDataUserDto } from "@/dto/auth";
import type { templateUserdataResponse } from "@/dto/auth/templates";
import { cleanNullsAndEmpty } from "@/utils/utils";
import axios from "axios";
import { defineStore } from "pinia";

export const useUserStore = defineStore('user_perfil', {
    state: () => ({

        dataUser: null as templateUserdataResponse | null,

    }),
    actions: {


        async createDataContact(createDataUser: createDataUserDto) {
            try {
                console.log(createDataUser.names)
                const cleanedData = cleanNullsAndEmpty({
                    names: createDataUser.names,
                    lastnames: createDataUser.lastnames,
                    perfilPhoto: createDataUser.perfilPhoto,
                    birthDay: createDataUser.birthDay,
                    birthMonth: createDataUser.birthMonth,
                    birthYear: createDataUser.birthYear,
                    phone: createDataUser.phone,
                    contactEmail: createDataUser.contactEmail,
                    contactNames: createDataUser.contactNames,
                    contactLastnames: createDataUser.contactLastnames,
                    contactPhone: createDataUser.contactPhone,
                    sex: createDataUser.sex,
                    familly: createDataUser.familly,
                    city: createDataUser.city,
                    cityuser: createDataUser.cityuser,
                    country: createDataUser.country
                });

                const response = await axios.post('/users/create', cleanedData)
                if (response.data.status === 200) {

                    this.dataUser = response.data.data
                } else {

                }
            } catch (error) {
                console.error("Error al crear contacto:", error);
            }

        },
        async getDataUser() {
            try {
                const response = await axios.get('/users/get-data')
                if (response.data.status === 200) {
                    console.log(response.data.data)
                    this.dataUser = response.data.data

                }
            } catch (error) {
                console.error("Error al crear contacto:", error);
            }

        },

    },

})