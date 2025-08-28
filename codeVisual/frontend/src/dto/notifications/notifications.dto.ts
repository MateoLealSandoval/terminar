import type { meta_model } from "@/models/model_commont/meta.model";

export interface notifications {
    id: string;
    userId: string;
    title: string;
    message: string;
    state: 'OPEN' | 'CLOSE'; // puedes ajustar los valores si hay más estados
    createdAt: string; // o Date si lo vas a convertir
}

export interface ResponseNotifications{
    status:number;
    data:notifications[];
    meta:meta_model
}