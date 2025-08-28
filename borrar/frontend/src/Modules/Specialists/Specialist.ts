export interface Specialist {
    id: number;
    web: string;
    name: string;
    title: string;
    perfilPhoto: string;
    expetience: number;
    point: number;
    typeconsultation: string[];
    services: string[];
    description: string;
    specialist: string[];
    gallery: string[];
    locals: {
        name: string;
        longitude: number;
        latitude: number;
        direction: string;
        departament: string;
        phones: string[];
    }[];
    servicesCost: { nameService: string; price: number }[];
    social: { facebook: string, instagram: string, linkedin: string, youtube: string };
    opinions: Opinion[];
    // 🔹 Nueva propiedad: Horario del especialista
    schedule: {
        [day: string]: { hour: number; minute: number }[];
    };
}

export interface Opinion {
    text: string;
    score: Score[];
    user: string;
    fecha: string;
    lugar: string;
}

export interface Score {
    type: string;
    score: number;
}

