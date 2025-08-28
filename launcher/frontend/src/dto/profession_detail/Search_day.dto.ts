export interface Search_day {
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    date: string; // Formato YYYY-MM-DD
}

export interface Search_dayRequest {
    officeId: string;
    Get_shedule_date: Search_day[];
}

export interface Times_shedules {
    id:string;
    openTime:string;
    closeTime:string;
    reserver:boolean;
    active:boolean;
}
export type ScheduleByDay = Record<Search_day["day"], Times_shedules[]>;