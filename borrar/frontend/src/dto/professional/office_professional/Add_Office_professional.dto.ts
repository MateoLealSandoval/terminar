export interface add_office_professional_dto {
 
    title:string;
    description: string;
    latitude: number;
    longitude: number;
    nameCity:string
    departament:string
}

export interface add_office_professional_dto_id extends add_office_professional_dto{
    id:string
}