import Stripe from "../config/stripe.js";
import cartProductSchema from "../models/cartProduct.model.js";
import InventoryMovementSchema from "../models/inventoryMovementSchema.js ";
import orderSchema from "../models/order.model.js";
import { nanoid } from 'nanoid';
import userSchema from "../models/user.model.js";
import inventorySchema from "../models/Inventory.model.js";
import addressSchema from "../models/address.model.js";
import notificationSchema from "../models/notifications.model.js";
import cashOnDeliveryEmailTemplate from "../templates/cashOnDeliveryEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";



//pago contra entrega efectivo
export async function CashOnDeleveryOrderController(req, res) {
    try {
        const userId = req.userId;
        const { list_items, totalAmt, addressId, subTotalAmt, discount } = req.body;

        if (!list_items || !Array.isArray(list_items) || list_items.length === 0) {
            return res.status(400).json({
                message: "No items in order list",
                error: true,
                success: false
            });
        }

        if (!totalAmt || !addressId || !subTotalAmt) {
            return res.status(400).json({
                message: "Missing order details",
                error: true,
                success: false
            });
        }


        const orderId = `ORD-${nanoid(7)}`;

        const payload = list_items.map(item => {

            let rawImages = item.productData.image;
            let imagesArray = [];

            // Intentar parsear solo si es string
            if (typeof rawImages === 'string') {
                try {
                    imagesArray = JSON.parse(rawImages);
                } catch (e) {
                    console.error("Error al parsear imágenes:", e.message);
                    imagesArray = [];
                }
            } else if (Array.isArray(rawImages)) {
                imagesArray = rawImages; // Ya está en formato array
            }

            const productDetails = {
                name: item.productData.name,
                image: imagesArray,
                unit_price: item.productData.price,
                unit_discount: item.productData.discount,
            };

            return {
                userId,
                orderId,
                productId: item.productId,
                product_details: JSON.stringify(productDetails),
                quantity: item.quantity,
                paymentId: "",
                paymentStatus: "CASH ON DELIVERY",
                deliveryAddress: addressId,
                discount,
                subTotalAmt,
                totalAmt,
            };
        });

        // Crear órdenes
        const generatedOrder = await orderSchema.bulkCreate(payload);

        // Registrar movimientos en el inventario por cada ítem
        for (const item of list_items) {
            const cartItem = await cartProductSchema.findOne({
                where: {
                    userId,
                    productId: item.productId,
                }
            });

            const existingInventory = await inventorySchema.findOne({
                where: {
                    productId: item.productId
                },
            });

            if (cartItem) {
                await InventoryMovementSchema.create({
                    warehouseId: existingInventory.warehouseId,
                    productId: item.productId,
                    userId,
                    quantity: cartItem.quantity,
                    type: "salida",
                    description: 'Salida de inventario por compra con pago en efectivo',
                    date: new Date(),
                });
            }
        }

        // Limpiar el carrito
        // await cartProductSchema.destroy({
        //     where: { userId }
        // });

        // Crear una notificación para el usuario
        await notificationSchema.create({
            userId,
            title: "¡Pedido recibido!",
            message: `Tu pedido ${orderId} ha sido registrado exitosamente.`,
            read: false,
            type: "order",
        });

        // Crear notificaciones para los administradores
        const adminUsers = await userSchema.findAll({
            where: { role: 'ADMIN' },
            attributes: ['_id'] // o 'id' según tu modelo
        });

        const adminNotifications = adminUsers.map(admin => ({
            userId: admin._id,
            title: "Nueva orden recibida",
            message: `Se ha creado un nuevo pedido con el ID ${orderId}.`,
            read: false,
            type: "order",
        }));

        await notificationSchema.bulkCreate(adminNotifications);

        const user = await userSchema.findOne({
            where: { _id: userId },
            attributes: ['name', 'email']
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
                error: true,
                success: false
            });
        }
        console.log('user email ', user.email)

        try {
            const sent = await sendEmail({
                sendTo: user.email,
                subject: `Confirmación de tu pedido ${orderId} - Shopmix`,
                html: cashOnDeliveryEmailTemplate({
                    name: user.name,
                    orderId,
                    list_items,
                    totalAmt
                })
            });

            console.log('send ', sent)
        } catch (emailError) {
            console.error("Error al enviar el correo de confirmación de pedido:", emailError);
            // No cancelamos el pedido, solo informamos en consola
        }

        return res.json({
            message: "Pedido creado",
            error: false,
            success: true,
            data: generatedOrder
        });

    } catch (error) {
        console.error("Error in order creation:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export const pricewithDiscount = (price, dis = 1) => {
    const discountAmout = Math.ceil(Number(price) * Number(dis) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

// controller payments
export async function paymentController(req, res) {
    try {
        const userId = req.userId
        const { list_items, totalAmt, addressId, subTotalAmt, discount } = req.body;


        const user = await userSchema.findOne({ where: { _id: userId } })


        const line_items = list_items.map(item => {
            let imageArray = [];

            if (typeof item.productData.image === 'string') {
                try {
                    let parsed = JSON.parse(item.productData.image);
                    if (typeof parsed === 'string') {
                        parsed = JSON.parse(parsed);
                    }
                    if (Array.isArray(parsed)) {
                        imageArray = parsed.filter(url => typeof url === 'string');
                    }
                } catch (e) {
                    console.warn("⚠️ No se pudo parsear image:", item.productData.image);
                }
            } else if (Array.isArray(item.productData.image)) {
                imageArray = item.productData.image.filter(url => typeof url === 'string');
            }


            return {
                price_data: {
                    currency: 'DOP',
                    product_data: {
                        name: item.productData.name,
                        images: imageArray,
                        metadata: {
                            productId: item.productId
                        }
                    },
                    unit_amount: Math.round(pricewithDiscount(item.productData.price, item.productData.discount) * 100)
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1
                },
                quantity: item.quantity
            };
        });

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId,
                discount: discount.toString(),
                subTotalAmt: subTotalAmt.toString()
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return res.status(200).json(session)

    } catch (error) {
        console.log("error ", error)
        return res.status(500).json({
            message: error.message || "Internal Server Error"
        })
    }
}


const getOrderProductItems = async (lineItems, userId, session, orderId) => {
    const productList = [];

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product);

            if (!product.metadata?.productId) {
                console.warn(`⚠️ Producto ${product.id} no tiene metadata.productId`);
                continue;
            }

            const payload = {
                userId: userId,
                orderId: orderId,
                productId: product.metadata.productId,
                product_details: JSON.stringify({
                    name: product.name,
                    image: product.images,
                    unit_price: product.price,
                    unit_discount: product.discount,
                }),
                quantity: item.quantity,
                paymentId: session.payment_intent,
                paymentStatus: session.payment_status,
                deliveryAddress: session.metadata.addressId,
                subTotalAmt: parseFloat(session.metadata.subTotalAmt), // ✅ aquí lo usas
                discount: parseFloat(session.metadata.discount),        // ✅ y aquí también
                totalAmt: (item.amount_total || 0) / 100,
            };

            productList.push(payload);
        }
    }

    return productList;
};


// webhook para recibir la confirmación de pago de stripe
// http://localhost:3000/api/order/webhook
export async function stripeWebhook(req, res) {
    const event = req.body;
    const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
                const userId = session.metadata.userId;


                // Extraemos los precios
                const orderId = `ORD-${nanoid(7)}`;
                const orderproduct = await getOrderProductItems(lineItems, userId, session, orderId);


                const order = await orderSchema.bulkCreate(orderproduct);

                if (!order) {
                    return res.status(400).json({
                        message: "Error creating order",
                        error: true,
                        success: false
                    });
                }

                for (const item of orderproduct) {
                    const cartItem = await cartProductSchema.findOne({
                        where: {
                            userId,
                            productId: item.productId,
                        }
                    });

                    const existingInventory = await inventorySchema.findOne({
                        where: {
                            productId: item.productId
                        },
                    });

                    if (cartItem) {
                        await InventoryMovementSchema.create({
                            warehouseId: existingInventory.warehouseId,
                            productId: item.productId,
                            userId,
                            quantity: cartItem.quantity,
                            type: "salida",
                            description: 'Salida de inventario por compra con pago en línea',
                            date: new Date(),
                        });
                    }
                }


                // Limpiar carrito
                await cartProductSchema.destroy({ where: { userId } });

                // Crear notificación para el usuario
                await notificationSchema.create({
                    userId,
                    title: "¡Pedido recibido!",
                    message: `Tu pedido ${orderId} ha sido registrado exitosamente.`,
                    read: false,
                    type: "order",
                });

                // Crear notificaciones para administradores
                const adminUsers = await userSchema.findAll({
                    where: { role: 'ADMIN' },
                    attributes: ['_id']
                });

                const adminNotifications = adminUsers.map(admin => ({
                    userId: admin._id,
                    title: "Nueva orden recibida",
                    message: `Se ha creado un nuevo pedido con el ID ${orderId}.`,
                    read: false,
                    type: "order",
                }));

                await notificationSchema.bulkCreate(adminNotifications);
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.error("Error in webhook:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

// get rol user in login
export async function getOrderDetailsController(req, res) {
    try {
        const userId = req.userId;

        const orders = await orderSchema.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            attributes: ['discount', 'orderId', 'paymentStatus', 'quantity', 'subTotalAmt', 'totalAmt', 'createdAt', 'product_details', 'orderStatus',],
            include: [
                {
                    model: addressSchema,
                    as: 'address',
                    where: { userId, status: true },
                    attributes: ['address_line', 'city', 'state', 'country', 'pincode', 'mobile'],
                },
                {
                    model: userSchema,
                    where: { _id: userId, status: 'Active' },
                    attributes: ['name'],
                }
            ]
        });

        // Agrupación por orderId
        const groupedOrders = {};

        orders.forEach(order => {
            let productDetails = order.product_details;

            if (typeof productDetails === 'string') {
                try {
                    productDetails = JSON.parse(productDetails);
                    if (typeof productDetails.image === 'string') {
                        productDetails.image = JSON.parse(productDetails.image);
                    }
                } catch (e) {
                    console.error("Error parsing product_details:", e.message);
                    productDetails = {};
                }
            }

            const quantity = order.quantity || 0;
            const unitPrice = productDetails?.unit_price || 0;
            const unitDiscount = productDetails.unit_discount;
            const subTotalAmt = unitPrice * quantity;
            const discountAmount = (unitDiscount / 100) * subTotalAmt;
            const totalAmt = subTotalAmt - discountAmount;

            const item = {
                ...productDetails,
                unit_price: unitPrice,
                quantity,
                unit_discount: unitDiscount,
                subTotalAmt,
                totalAmt
            };

            if (!groupedOrders[order.orderId]) {
                groupedOrders[order.orderId] = {
                    orderId: order.orderId,
                    orderStatus: order.orderStatus,
                    subTotalAmt: order.subTotalAmt,
                    discount: order.discount,
                    totalAmt: order.totalAmt,
                    paymentStatus: order.paymentStatus,
                    createdAt: order.createdAt,
                    address: order.address,
                    user: order.user,
                    items: [item]
                };
            } else {
                groupedOrders[order.orderId].items.push(item);
            }
        });

        // Convertimos el objeto a array
        const result = Object.values(groupedOrders);

        return res.json({
            message: "Órdenes agrupadas por ID",
            error: false,
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Error fetching grouped orders:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

// gets rol admin 
export async function getGroupedOrdersByUserController(req, res) {
    try {
        const orders = await orderSchema.findAll({
            order: [['createdAt', 'DESC']],
            attributes: [
                'discount', 'orderId', 'paymentStatus', 'quantity', 'orderStatus',
                'subTotalAmt', 'totalAmt', 'createdAt', 'product_details'
            ],
            include: [
                {
                    model: addressSchema,
                    as: 'address',
                    attributes: ['address_line', 'city', 'state', 'country', 'pincode', 'mobile'],
                },
                {
                    model: userSchema,
                    attributes: ['_id', 'name', 'lastName', 'email'],
                }
            ]
        });

        const groupedByUser = {};

        orders.forEach(order => {
            const userId = order.user._id;
            if (!groupedByUser[userId]) {
                groupedByUser[userId] = {
                    user: {
                        fullName: `${order.user.name} ${order.user.lastName || ""}`.trim(),
                        email: order.user.email
                    },
                    orders: {}
                };
            }

            // Parse product details
            let productDetails = order.product_details;
            try {
                if (typeof productDetails === 'string') {
                    productDetails = JSON.parse(productDetails);
                }
                if (typeof productDetails.image === 'string') {
                    productDetails.image = JSON.parse(productDetails.image);
                }
            } catch (e) {
                console.error("Error parsing product_details:", e.message);
                productDetails = {};
            }

            const quantity = order.quantity || 0;
            const unitPrice = productDetails.unit_price || 0;
            const unitDiscount = productDetails.unit_discount || 0;
            const subTotalAmt = unitPrice * quantity;
            const discountAmount = (unitDiscount / 100) * subTotalAmt;
            const totalAmt = subTotalAmt - discountAmount;

            const item = {
                ...productDetails,
                unit_price: unitPrice,
                quantity,
                unit_discount: unitDiscount,
                subTotalAmt,
                totalAmt
            };

            const existingOrder = groupedByUser[userId].orders[order.orderId];

            if (!existingOrder) {
                // Primera vez que vemos esta orden, la agregamos
                groupedByUser[userId].orders[order.orderId] = {
                    orderId: order.orderId,
                    orderStatus: order.orderStatus,
                    subTotalAmt: subTotalAmt,
                    discount: order.discount || 0,
                    totalAmt: totalAmt,
                    paymentStatus: order.paymentStatus,
                    createdAt: order.createdAt,
                    address: order.address,
                    items: [item]
                };
            } else {
                // Ya existe esta orden, acumulamos valores y agregamos items
                existingOrder.subTotalAmt += subTotalAmt;
                existingOrder.discount += order.discount || 0;
                existingOrder.totalAmt += totalAmt;
                existingOrder.items.push(item);

                // Actualizar fecha si la actual es más antigua o más nueva según quieras
                if (order.createdAt < existingOrder.createdAt) {
                    existingOrder.createdAt = order.createdAt;
                }

                // Para estado, podrías priorizar el estado más avanzado (puedes personalizar lógica)
                const statusPriority = ['Pendiente', 'Procesando', 'Enviado', 'Entregado'];
                if (statusPriority.indexOf(order.orderStatus) > statusPriority.indexOf(existingOrder.orderStatus)) {
                    existingOrder.orderStatus = order.orderStatus;
                }

                // Para paymentStatus podrías hacer lógica similar si quieres
                if (order.paymentStatus !== existingOrder.paymentStatus) {
                    existingOrder.paymentStatus = order.paymentStatus; // o lógica más fina si quieres
                }
            }
        });

        // Convertir a formato array
        const result = Object.values(groupedByUser).map(userGroup => ({
            user: userGroup.user,
            orders: Object.values(userGroup.orders)
        }));

        return res.json({
            message: "Órdenes agrupadas por usuario",
            success: true,
            error: false,
            data: result
        });

    } catch (error) {
        console.error("Error grouping orders by user:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function updateOrderStatusController(req, res) {
    const { orderId, orderStatus } = req.body;

    if (!orderId || !orderStatus) {
        return res.status(400).json({
            success: false,
            message: "orderId y orderStatus son requeridos."
        });
    }

    try {
        // Buscar el pedido por ID usando Sequelize
        const order = await orderSchema.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Pedido no encontrado."
            });
        }

        // Validar estados no modificables
        const nonUpdatableStatuses = ["Cancelada", "Completado"];
        if (nonUpdatableStatuses.includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: `No se puede actualizar una orden que ya fue ${order.orderStatus}.`
            });
        }

        // Actualizar el estado
        order.orderStatus = orderStatus;
        await order.save();

        // Crear la notificación
        await notificationSchema.create({
            userId: order.userId,
            title: "Pedido actualizado",
            message: `Tu pedido #${order.orderId} ha cambiado a "${order.orderStatus}".`,
            type: "order"
        });

        return res.json({
            success: true,
            message: "Orden actualizada y notificación enviada",
            data: order
        });

    } catch (error) {
        console.error("Error al actualizar pedido:", error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el pedido.",
            error: error.message
        });
    }
}


export async function cancelOrderController(req, res) {
    try {
        const userId = req.userId;
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "Falta el ID de la orden",
                error: true,
                success: false
            });
        }

        // Buscar todas las filas relacionadas a ese orderId
        const orders = await orderSchema.findAll({ where: { orderId } });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: "Orden no encontrada",
                error: true,
                success: false
            });
        }

        const user = await userSchema.findOne({ where: { _id: userId }, attributes: ['role'] });
        const userRole = user?.role || 'USER';

        const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;
        const now = new Date();

        // Validar permisos y estado de cada fila (orden por producto)
        for (const order of orders) {
            if (order.userId !== userId && userRole !== "ADMIN") {
                return res.status(403).json({
                    message: "No tienes permiso para cancelar esta orden",
                    error: true,
                    success: false
                });
            }

            // ⛔ Validación de estado de orden
            if (["Cancelada", "Completado"].includes(order.orderStatus)) {
                return res.status(400).json({
                    message: `La orden no puede ser cancelada porque ya está "${order.orderStatus}".`,
                    error: true,
                    success: false
                });
            }

            if (!["pendiente", "CASH ON DELIVERY"].includes(order.paymentStatus)) {
                return res.status(400).json({
                    message: "Esta orden no puede ser cancelada en su estado actual",
                    error: true,
                    success: false
                });
            }

            // Si es CASH ON DELIVERY, verificar si han pasado más de 2 días
            const orderAge = now - new Date(order.createdAt);
            if (order.paymentStatus === "CASH ON DELIVERY" && orderAge > TWO_DAYS_IN_MS && userRole !== "ADMIN") {
                return res.status(400).json({
                    message: `La orden ${orderId} ya no puede ser cancelada porque han pasado más de 2 días desde su creación.`,
                    error: true,
                    success: false
                });
            }
        }


        // Cancelar todas las filas (productos) de la orden
        for (const order of orders) {
            order.orderStatus = "Cancelada";
            await order.save();

            // Revertir inventario
            const existingInventory = await inventorySchema.findOne({
                where: { productId: order.productId }
            });

            if (existingInventory) {
                existingInventory.stock += order.quantity;
                await existingInventory.save();

                await InventoryMovementSchema.create({
                    warehouseId: existingInventory.warehouseId,
                    productId: order.productId,
                    userId,
                    quantity: order.quantity,
                    type: "entrada",
                    description: `Reversión por cancelación de orden ${orderId}`,
                    date: new Date(),
                });
            }
        }

        // Notificar al usuario
        await notificationSchema.create({
            userId,
            title: "Orden cancelada",
            message: `Tu orden ${orderId} fue cancelada exitosamente.`,
            read: false,
            type: "order",
        });

        // Notificar a los admins
        const adminUsers = await userSchema.findAll({ where: { role: 'ADMIN' }, attributes: ['_id'] });
        const adminNotifications = adminUsers.map(admin => ({
            userId: admin._id,
            title: "Orden cancelada",
            message: `La orden ${orderId} fue cancelada por el usuario ${userId}.`,
            read: false,
            type: "order",
        }));
        await notificationSchema.bulkCreate(adminNotifications);

        return res.json({
            message: "Orden cancelada correctamente",
            error: false,
            success: true,
        });

    } catch (error) {
        console.error("Error cancelando la orden:", error);
        return res.status(500).json({
            message: "Error interno al cancelar la orden",
            error: true,
            success: false,
        });
    }
}