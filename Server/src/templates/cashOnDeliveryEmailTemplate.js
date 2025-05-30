const cashOnDeliveryEmailTemplate = ({ name, orderId, list_items, totalAmt }) => {
    const itemsHTML = list_items.map(item => `
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.productData.name}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">$${item.productData.price.toFixed(2)}</td>
        </tr>
    `).join('');

    return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 900px; margin: auto;">
        <h2 style="color: #071263;">¡Gracias por tu pedido!</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Tu pedido con el ID <strong>${orderId}</strong> ha sido recibido correctamente y será procesado para envío con <strong>pago contra entrega</strong>.</p>

        <h3>Resumen de tu pedido:</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f4f4f4;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Producto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Precio</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <p style="margin-top: 20px; font-size: 18px;"><strong>Total a pagar al recibir:</strong> $${totalAmt.toFixed(2)}</p>

        <p>Te notificaremos nuevamente cuando tu pedido esté en camino.</p>
        <p>Si tienes alguna duda, no dudes en contactarnos.</p>

        <p>Saludos,<br><strong>El equipo de Shopmix</strong></p>
    </div>
    `;
};

export default cashOnDeliveryEmailTemplate;