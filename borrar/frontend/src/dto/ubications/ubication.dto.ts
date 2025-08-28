export interface UbicationDto {
    office: string;
    address: string;
    longitude: number;  
    latitude: number;    
}
export interface UbicationWithIdDto extends UbicationDto {
    id: number;  
}