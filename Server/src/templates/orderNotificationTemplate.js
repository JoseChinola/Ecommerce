const orderNotificationTemplate = ({ title, name, message, orderId, orderStatus }) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #071263;">${title}</h2>

        <p>Hola <strong>${name}</strong>,</p>

        <p style="font-size: 16px; color: #333;">
            ${message}
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
                <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">ID del Pedido</td>
                <td style="padding: 10px;">${orderId}</td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">Estado Actual</td>
                <td style="padding: 10px;">${orderStatus}</td>
            </tr>
        </table>

        <p style="margin-top: 30px; font-size: 14px; color: #888;">
            Si tienes preguntas, por favor contáctanos desde tu panel de usuario o por email.
        </p>

        <p style="margin-top: 10px; color: #071263;"><strong>Gracias por confiar en Shopmix.</strong></p>
    </div>
    `;
};

export default orderNotificationTemplate