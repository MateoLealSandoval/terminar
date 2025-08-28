export interface Shedule_item {
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    openTime: string;  // Formato esperado: "HH:MM"
    closeTime: string; // Formato esperado: "HH:MM"
    
}
export interface Shedule_item_complete extends Shedule_item {
    active:boolean
    id:string
}