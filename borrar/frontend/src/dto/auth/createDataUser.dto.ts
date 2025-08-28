 
 
 
export interface createDataUserDto{
    names:string,
    lastnames:string,
    perfilPhoto:string,
    birthDay:number,
    birthMonth:number,
    birthYear:number,
    phone?:string,   
    contactEmail?: string,
    contactNames?: string,
    contactLastnames?: string,
    contactPhone?: string
    sex?:string,
    familly?:string,
    city?:string
    cityuser?: string;
    country?: string;
}
