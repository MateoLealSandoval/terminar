import type {add_office_professional_dto_id, office_professional_dto } from "./office_professional";
import type { photos_profesional_dto } from "./photos";
import type { ServicesDtoBody } from "./Services-Dto";

export interface user_professional_dto {
    id?: string;
    title?: string;
    web?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    perfilPhoto?: string;
    description?: string;
    document?: string;
    phone?: string;
    name?: string;
    specialists?: specialist[];
    prepagadas?: pepagadas[];
    type_of_payment?: string;
    offices?: office_professional_dto[]
    actions?: string[];
    photos?: photos_profesional_dto[]
    services?: ServicesDtoBody[]
    experience?: number

}

export interface specialist {
    id?: string;
    name?: string;
    status?: string;
}
export interface pepagadas {
    id?: string;
    name?: string;
    status?: string;
    type: 'SITE' | 'ANTICIPATED';
}

export interface user_professional_body_dto {
    names: string,
    lastnames: string
    experience: number,
    title?: string;
    web?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    perfilPhoto?: string;
    description?: string;
    document?: string;
    phone?: string;
    specialists?: specialist[];
    type_of_payment?: string;
    actions?: string[],
    prepagadas?: specialist[]
}

export interface user_professional_search_dto {
    id: string,
    name: string,
    title: string,
    description: string,
    point?: number,
    perfilPhoto: string,
    experience: number,
    specialists: specialist[],
    prepagadas: pepagadas[]
}

export interface user_professional_dto_user extends Omit<user_professional_dto, "offices"> {
    offices?: add_office_professional_dto_id[];
}
