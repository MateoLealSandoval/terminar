 import type { CalificationUserDtoBody } from '@/models/Califications';
import axios from 'axios'
import { defineStore } from 'pinia'
 
export const calificationStore = defineStore('calificationStore', {
    state: () => ({
        
    }),
    actions: {
 
        async Create_Calification(CalificationUserDtoBody:CalificationUserDtoBody) {
            try {
                const response = await axios.post('/reservations-calendar/calification',CalificationUserDtoBody)
               
                if (response.status === 200) {
                    console.log(response.data)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {   
                    throw new Error(error.response?.data?.message || "Error en verificar token");
                } else {
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
  
  
   

    },

})