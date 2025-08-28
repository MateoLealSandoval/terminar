export function formatDateParts(isoDate: string | Date) {
    const date = new Date(isoDate);

    return {
        day: date.getDate(),  
        month: date.getMonth() + 1,  
        year: date.getFullYear(),
        hour: date.getHours(),
        minutes: date.getMinutes(),
    };
}
export function formatFullDateUTC(isoDate: string | Date): string {
    const date = new Date(isoDate);

    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    const month = months[date.getUTCMonth()];

    return `${day} de ${month} del ${year} a las ${hours}:${minutes}`;
}
