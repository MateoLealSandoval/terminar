const fetch = require('node-fetch');
const server = "https://server.docvisual.co";
const URL = `${server}/reservations-calendar/check-reservation-expired`; // corregida la ruta

fetch(URL, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  // Si necesitas enviar un cuerpo (payload), agrégalo aquí:
  // body: JSON.stringify({ key: 'value' })
})
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.text();
  })
  .then(body => {
    console.log(`✔ Petición PUT exitosa: ${body}`);
  })
  .catch(err => {
    console.error(`✘ Error en la petición PUT: ${err}`);
  });