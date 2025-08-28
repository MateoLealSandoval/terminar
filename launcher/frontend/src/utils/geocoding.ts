export async function getDepartmentFromCoords(longitude: number, latitude: number): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("📦 Respuesta completa de Google Maps Geocoding:", data);
    if (data.status === "OK" && data.results.length > 0) {
      const components = data.results[0].address_components;

      const departmentComponent = components.find((comp: any) =>
        comp.types.includes("administrative_area_level_1")
      );

      return departmentComponent?.long_name ?? null;
    } else {
      console.warn("No se encontró el departamento.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el departamento:", error);
    return null;
  }
}
