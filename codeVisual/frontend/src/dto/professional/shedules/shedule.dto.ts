import type { Shedule_item, Shedule_item_complete } from "./shedule_item.dto";

export interface Shedule {
    officeId:string,
    intervalMinutes:number
    schedules:Shedule_item 
}

export interface Shedule_response extends Shedule{
    id:string
}

export interface Shedule_complete{
    officeId:string,
    intervalMinutes:number
    schedules:Shedule_item_complete[]
}