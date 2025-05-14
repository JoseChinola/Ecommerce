import Stripe from "../config/stripe.js";
import cartProductSchema from "../models/cartProduct.model.js";
import InventoryMovementSchema from "../models/inventoryMovementSchema.js ";
import orderSchema from "../models/order.model.js";
import { nanoid } from 'nanoid';
import userSchema from "../models/user.model.js";
import inventorySchema from "../models/Inventory.model.js";
import addressSchema from "../models/address.model.js";



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


        const orderId = `ORD-${nanoid(10)}`;

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
        await cartProductSchema.destroy({
            where: { userId }
        });

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


const getOrderProductItems = async (lineItems, userId, session) => {
    const productList = [];

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product);

            if (!product.metadata?.productId) {
                console.warn(`⚠️ Producto ${product.id} no tiene metadata.productId`);
                continue;
            }

            const orderId = `ORD-${nanoid(10)}`;

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

                const orderproduct = await getOrderProductItems(lineItems, userId, session);


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

                await cartProductSchema.destroy({ where: { userId } });
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
                    attributes: ['_id', 'name', 'email'],
                }
            ]
        });

        const groupedByUser = {};

        orders.forEach(order => {
            const userId = order.user._id;
            if (!groupedByUser[userId]) {
                groupedByUser[userId] = {
                    user: {
                        name: order.user.name,
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

            if (!groupedByUser[userId].orders[order.orderId]) {
                groupedByUser[userId].orders[order.orderId] = {
                    orderId: order.orderId,
                    orderStatus: order.orderStatus,
                    subTotalAmt: order.subTotalAmt,
                    discount: order.discount,
                    totalAmt: order.totalAmt,
                    paymentStatus: order.paymentStatus,
                    createdAt: order.createdAt,
                    address: order.address,
                    items: [item]
                };
            } else {
                groupedByUser[userId].orders[order.orderId].items.push(item);
            }
        });

        // Convertir a formato de array
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
    const { orderId, orderStatus } = req.body

    if (!orderId || !orderStatus) {
        return res.status(400).json({ success: false, message: "orderId y orderStatus son requeridos." });
    }


    try {
        // Buscar el pedido por ID usando Sequelize
        const order = await orderSchema.findOne({ where: { orderId } })

        if (!order) {
            return res.status(404).json({ success: false, message: "Pedido no encontrado." });
        }
        order.orderStatus = orderStatus;
        await order.save();
        return res.json({ success: true, message: "Estado del pedido actualizado.", data: order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el pedido.",
            error: error.message
        });
    }
}