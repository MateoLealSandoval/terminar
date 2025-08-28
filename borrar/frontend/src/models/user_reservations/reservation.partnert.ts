export interface ReservationResponsePartnert {
  status: number;
  office: Office;
  user: User;
}

export interface Office {
  id: string;
  perfilPhoto: string;
  name: string;
  offices: {id:string,title:string,description:string,departament:string}[]
  // Puedes agregar más campos si existen
}

export interface User {
  names: string;
  lastnames: string;
  email: string;
}