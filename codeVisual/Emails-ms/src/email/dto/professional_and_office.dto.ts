interface Office {
    id: string;
    title: string;
    description: string;
    longitude: number;
    latitude: number;
    UserDataId: string;
    departament: string;
    cityId: string;
}

interface Professional {
    id: string;
    perfilPhoto: string;
    name: string;
    title: string;
    offices: Office[];
}
interface ProfessionalResponse {
    status: number;
    data: Professional;
}