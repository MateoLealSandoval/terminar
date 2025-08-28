export function getMonthName(month: number): string {
    const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    if (month < 1 || month > 12) {
        throw new Error("El número de mes debe estar entre 1 y 12.");
    }

    return months[month - 1];
}

export function getDayName(month: number, day: number, year: number):
    "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY" {

    const date = new Date(year, month - 1, day); // Restamos 1 al mes porque JavaScript usa índices de 0 a 11
    return date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase() as
        "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
}


export function getMonthNameEs(monthNumber: number): string {
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[monthNumber - 1] || "Mes inválido";
}
export function formatTwoDigits(number: number): string {
    return number.toString().padStart(2, '0');
}


export function getDayNameSpanish(englishDay: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY"): string {
    const daysInSpanish: Record<typeof englishDay, string> = {
        SUNDAY: "Domingo",
        MONDAY: "Lunes",
        TUESDAY: "Martes",
        WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves",
        FRIDAY: "Viernes",
        SATURDAY: "Sábado"
    };

    return daysInSpanish[englishDay];
}



export function isValidDate(day: number, month: number, year: number): boolean {
    // Creamos la fecha con los valores dados
    const date = new Date(year, month - 1, day);

    // Verificamos si la fecha generada coincide con los valores originales
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}



export function getDayOfWeekName(dayNumber: number): string {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    if (dayNumber < 1 || dayNumber > 7) {
        throw new Error("El número de día debe estar entre 1 (Lunes) y 7 (Domingo).");
    }

    return days[dayNumber - 1];
}

export function EsgetDayOfWeekName(dayNumber: number): string {
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

    if (dayNumber < 1 || dayNumber > 7) {
        throw new Error("Day number must be between 1 (Monday) and 7 (Sunday).");
    }

    return days[dayNumber - 1];
}
export function formatHourMinute(hour: number, minute: number) {
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');

    return `${formattedHour}:${formattedMinute}`;
}
export function getTimeFromISOString(isoString: string): string {
    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // ¡Ojo! getMonth es base 0
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
export function formatDateTimeEs(
  year: number,
  month: number,
  day: number,
  hour?: number,
  minute?: number
): string {
  // Si no se pasan hora o minutos, usar 0 por defecto para evitar errores
  const date = new Date(year, month - 1, day, hour ?? 0, minute ?? 0);

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const nombreMes = meses[date.getMonth()];
  const dia = date.getDate();
  const anio = date.getFullYear();

  if (hour !== undefined && minute !== undefined) {
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'p. m.' : 'a. m.';

    h = h % 12 || 12; // 0 => 12

    return `${dia} de ${nombreMes} del ${anio} a las ${h}:${m} ${ampm}`;
  }

  return `${dia} de ${nombreMes} del ${anio}`;
}
export function formatHumanDateCO(date: Date): string {
    return date.toLocaleString('es-CO', {
        weekday: 'long', // viernes
        year: 'numeric',
        month: 'long',   // julio
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Bogota'
    });
}