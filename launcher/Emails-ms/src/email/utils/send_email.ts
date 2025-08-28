import * as nodemailer from 'nodemailer';
import { envs } from 'src/config';
 

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
 

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Servidor SMTP de Gmail
        port: 465, // Puerto para conexiones SSL/TLS
        secure: true, // Habilita SSL/TLS
        auth: {
            user: envs.email, // Tu correo de Gmail
            pass: envs.passwordEmail, // Contraseña o App Password de Gmail
        },
    });

    await transporter.sendMail({
        from: `"Doc Visual" <hola@docvisual.co>`, // Remitente
        to, // Destinatario
        subject, // Asunto
        html, // Contenido HTML del correo
    });
      
}
 export function formatDateForCalendar  (date: Date): string  {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes (0-11, por eso se suma 1)
    const day = date.getDate().toString().padStart(2, '0'); // Día
    const hours = date.getHours().toString().padStart(2, '0'); // Hora local
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Minutos
    const seconds = date.getSeconds().toString().padStart(2, '0'); // Segundos
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};