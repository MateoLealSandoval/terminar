import type { registerPartnerDto } from '@/dto/auth'
import type { authdto } from '@/dto/auth/auth.tdo'
import type { registerDto } from '@/dto/auth/register.dto'

import type { templateUser } from '@/dto/auth/templates/user.template'
import axios from 'axios'
import { defineStore } from 'pinia'
import router from '@/router'
import { http_status } from '@/models/http_status'



export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        user: null as templateUser | null,
        state: http_status.INIT as http_status
    }),
    actions: {
        async registerUser(registerDto: registerDto) {
            try {

                this.state = http_status.LOADING;
                const response = await axios.post('/auth/register', {
                    email: registerDto.email,
                    password: registerDto.password,
                    names: registerDto.names,
                    lastnames: registerDto.lastnames,
                })
                if (response.status === 201) {


                    this.state = http_status.FINISH
                } else {
                    this.state = http_status.FINISH
                    throw new Error("Respuesta inesperada del servidor.");
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    this.state = http_status.FINISH
                    throw new Error(error.response?.data?.message || "Error en el registro.");

                } else {
                    this.state = http_status.FINISH
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async registerUserToken(token: string) {
            try {

                this.state = http_status.LOADING;
                const response = await axios.get(`/auth/register/usertoken/${token}`)
                if (response.data.status === 200) {

                    this.setToken(response.data.data.token, response.data.data.user);
                    this.state = http_status.FINISH
                } else {
                    this.state = http_status.FINISH
                    throw new Error("Respuesta inesperada del servidor.");
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    this.state = http_status.FINISH
                    throw new Error(error.response?.data?.message || "Error en el registro.");

                } else {
                    this.state = http_status.FINISH
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async registerParthner(registerParthner: registerPartnerDto) {
            try {
                this.state = http_status.LOADING;
                const response = await axios.post('/auth/registerpartner', {
                    email: registerParthner.email,
                    password: registerParthner.password,
                    names: registerParthner.names,
                    lastnames: registerParthner.lastnames,
                    phone: registerParthner.phone,
                    title: registerParthner.title,
                    document: registerParthner.document
                })
                if (response.status === 201) {
                    this.setToken(response.data.token, response.data.user);

                } else {
                    this.state = http_status.FINISH
                    throw new Error("Respuesta inesperada del servidor.");
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    this.state = http_status.FINISH
                    throw new Error(error.response?.data?.message || "Error en el registro.");
                } else {
                    this.state = http_status.FINISH
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async refreshToken() {
            try {
                const token = localStorage.getItem('token')
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                const response = await axios.get('/auth/verify')
                if (response.status === 200) {
                
                    this.setToken(response.data.token, response.data.user);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    this.state = http_status.FINISH
                    throw new Error(error.response?.data?.message || "Error en verificar token");
                } else {
                    this.state = http_status.FINISH
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },
        async userAuth(authdto: authdto) {
            try {
                this.state = http_status.LOADING
                const response = await axios.post('/auth/login', {
                    email: authdto.email,
                    password: authdto.password
                })
                if (response.status === 201) {
                    this.setToken(response.data.token, response.data.user);
                } else {
                    throw new Error("Respuesta inesperada del servidor.");
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    this.state = http_status.FINISH
                    throw new Error(error.response?.data?.message || "Error en la autenticación.");
                } else {
                    this.state = http_status.FINISH
                    throw new Error("Ha ocurrido un error inesperado.");
                }
            }
        },


        async close_session() {

            this.token = ''
            localStorage.removeItem('token')
            router.push('/')
        },
        setToken(token: string, user: templateUser) {
            this.token = token
            this.user = user
            localStorage.setItem('token', token) // Guardar token en localStorage
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            this.state = http_status.FINISH
        },

    },

})