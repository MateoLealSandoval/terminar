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