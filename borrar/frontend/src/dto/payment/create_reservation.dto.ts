export interface create_reservation_dto {
    officeId: string;
    scheduleId: string;
    date: string;
    profecionalId:string;
    price:number;
    payment?: 'SITE' | 'ANTICIPATED';
}
