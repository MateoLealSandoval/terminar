import { SendEmailsDto } from "../dto";

export const sendEmailEditReservation = (sendEmail: SendEmailsDto) => {
    const {  text } = sendEmail;
    return `
       <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
    <table
        style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 30px;">
        <tr>
            <td>
                <img src="https://res.cloudinary.com/dirsusbyy/image/upload/v1746028928/ibtjroma4sgyx55erswj.png"
                    alt="Logo" style="max-width: 150px; margin: 0 auto 30px; display: block;">

                <h2 style="color: #333;">Tu reserva fue modificada. </h2>
                <p style="color: #555; font-size: 16px;">
                    ${text}
                </p>
                

            </td>
        </tr>
        <tr>
            <td style="padding-top: 30px; font-size: 12px; color: #999;">
                DocVisual S.A.S - Bogotá, Colombia<br>
                ¿Necesitas ayuda? Escríbenos a <a href="mailto:hola@docvisual.co"
                    style="color: #36b6f1; text-decoration: none;">hola@docvisual.co</a>
            </td>
        </tr>
    </table>
</div>
        `;
}