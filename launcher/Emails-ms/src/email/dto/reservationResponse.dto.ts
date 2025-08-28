interface ReservationResponseDto {
    status: number;
    data: {
        id: string;
        officeId: string;
        scheduleId: string;
        date: string;
        userId: string;
        profecionalId: string;
        price: number;
        payment: string;
    };
}
