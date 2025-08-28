export interface Score {
    type: string;
    point: number;
}

export interface Review {
    name: string;
    date: string;
    location: string;
    text: string;
    scores: Score[];
}
