
export interface Select_date_reservation_dto {
    officeId: string;
    date: Date; // Fecha completa en formato Date  AAAA:MM:DD
    openTime: string; // Hora de apertura en formato string (HH:mm, etc.)
    closeTime: string;  
}
