export interface SheduleItemCompleteId {
    id: string;
    active: boolean;
}

export interface PutSheduleItemsOfficeDto {
    officeId: string;
    items: SheduleItemCompleteId[];
}
