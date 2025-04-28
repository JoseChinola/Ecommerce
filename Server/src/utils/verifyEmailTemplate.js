const verifyEmailTemplate = ({ name, url }) => {
    return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 900px; width: 100%;">
        <p>Estimado/a <strong style="font-size: 18px; color: #000;">${name}</strong>,</p>
        <p>¡Gracias por registrarte en <strong>D’RAF SERVICES</strong>! Por favor, confirma tu correo electrónico haciendo clic en el siguiente botón:</p>
        <p style="margin-top: 20px;">
            <a href="${url}" 
                style="display: block; padding: 14px 0; text-align: center; font-size: 18px; color: white; 
                background: #071263; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Verificar Correo
            </a>
        </p>
        <p>Si no te registraste en D’RAF SERVICES, por favor ignora este correo.</p>
        <p>Saludos cordiales,</p>
        <p><strong>El equipo de D’RAF SERVICES</strong></p>
    </div>
    `;
}


export default verifyEmailTemplate;