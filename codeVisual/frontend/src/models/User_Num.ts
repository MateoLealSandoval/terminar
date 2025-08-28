export enum Genre {
    MEN = "men",
    WOMAN = "woman",
    OTHERS = "others",
}

// Mapeo de nombres en español
export const GenreLabels: Record<Genre, string> = {
    [Genre.MEN]: "Hombre",
    [Genre.WOMAN]: "Mujer",
    [Genre.OTHERS]: "Otros",
};