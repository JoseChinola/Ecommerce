const forgotPasswordTemplate = ({ name, otp }) => {
    return `
    <div
        style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 900px; width: 100%;">
        <p>Estimado/a <span style="font-size: 17px; color: black; font-style: italic; font-weight: 700;">${name}</span>,</p>

        <p>Hemos recibido una solicitud para cambiar tu contraseña en <strong style="font-weight: 700; font-size: 17px;">D’RAF SERVICES</strong>. Por favor,
            utiliza el código OTP (Contraseña de un solo uso) que aparece abajo para continuar con el restablecimiento de tu contraseña:</p>
        
        <p
            style="margin-top: 20px; text-align: center; background-color: yellow; color: black; padding: 20px; line-height: 1.8; border-radius: 7px; font-size: 25px; font-weight: 700;">
            ${otp}
        </p>
        
        <p><strong>Este código OTP es válido por aproximadamente una hora.</strong> Si no lo utilizas dentro de este tiempo, deberás solicitar uno nuevo.</p>
        
        <p>Si no solicitaste un cambio de contraseña, por favor ignora este correo. Tu contraseña no será modificada.</p>
        
        <p>Gracias y saludos cordiales,</p>
        
        <p><strong>El equipo de D’RAF SERVICES</strong></p>
    </div>
    `;
}

export default forgotPasswordTemplate;