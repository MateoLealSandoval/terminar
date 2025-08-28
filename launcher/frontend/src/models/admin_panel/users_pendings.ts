export interface userPendingsDto {
    id: string;
    names: string;
    lastnames: string;
    document: string;
    email: string;
    password: string;
    phone: string;
    side_front: string;
    side_back: string;
    title: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string; // o Date si lo vas a convertir
    updatedAt: string; // o Date si lo vas a convertir
}