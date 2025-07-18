const cashOnDeliveryEmailTemplate = ({ name, orderId, list_items, totalAmt }) => {
    const itemsHTML = list_items.map(item => {
        let imageUrls = [];
        try {
            imageUrls = JSON.parse(JSON.parse(item.productData.image));
        } catch (e) {
            console.error("Error parsing image URLs:", e);
        }

        const firstImage = imageUrls.length > 0 ? imageUrls[0] : '';

        return `
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                    <img src="${firstImage}" alt="${item.productData.name}" style="width: 100px; height: auto; border-radius: 6px; border: 1px solid #ccc;" />
                </td>
                <td style="padding: 12px; border: 1px solid #ddd; vertical-align: middle;">${item.productData.name}</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center; vertical-align: middle;">${item.quantity}</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: right; vertical-align: middle;">$${item.productData.price.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 900px; margin: auto;">
        <h2 style="color: #071263;">¡Gracias por tu pedido!</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Tu pedido con el ID <strong>${orderId}</strong> ha sido recibido correctamente y será procesado para envío con <strong>pago contra entrega</strong>.</p>

        <h3 style="margin-top: 30px;">Resumen de tu pedido:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="background-color: #f4f4f4;">
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Imagen</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Producto</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Cantidad</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Precio</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <p style="margin-top: 20px; font-size: 18px;"><strong>Total a pagar al recibir:</strong> $${totalAmt.toFixed(2)}</p>

        <p style="margin-top: 20px;">Te notificaremos nuevamente cuando tu pedido esté en camino.</p>
        <p>Si tienes alguna duda, no dudes en contactarnos.</p>

        <p style="margin-top: 30px;">Saludos,<br><strong>El equipo de Shopmix</strong></p>
    </div>
    `;
};

export default cashOnDeliveryEmailTemplate;