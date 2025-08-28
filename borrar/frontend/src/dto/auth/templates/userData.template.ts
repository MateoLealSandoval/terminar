 
export interface contactUserdata{
    id:string,
    gmail:string,
    names:string,
    lastnames:string,
    phone:string
}
export interface templateUserdataResponse{
    id:string,
    perfilPhoto:string,
    birthDay:number,
    birthMonth:number,
    birthYear:number,
    phone:string,
    sex:string,
    
    contactEmail: string,
    contactNames: string,
    contactLastnames: string,
    contactPhone: string,
    contactFamilly?:string
    city?:string
    cityuser?:string
    country	?:string
}

