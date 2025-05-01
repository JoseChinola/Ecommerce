import Stripe from "../config/stripe.js";
import cartProductSchema from "../models/cartProduct.model.js";
import InventoryMovementSchema from "../models/inventoryMovementSchema.js ";
import orderSchema from "../models/order.model.js";
import { nanoid } from 'nanoid';
import userSchema from "../models/user.model.js";
import { FRONTEND_URL, STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY } from "../config.js";
import inventorySchema from "../models/Inventory.model.js";
import addressSchema from "../models/address.model.js";
import { where } from "sequelize";
import productSchema from "../models/product.model.js";


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
            const productDetails = {
                name: item.productData.name,
                image: item.productData.image,
                unit_price: item.productData.price,
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
            message: "Order Created Successfully",
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
            success_url: `${FRONTEND_URL}/success`,
            cancel_url: `${FRONTEND_URL}/cancel`
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
                    image: product.images
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
    const endpointSecret = STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

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

                const deleted = await cartProductSchema.destroy({ where: { userId } });
                console.log("Productos eliminados del carrito:", deleted);
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


export async function getOrderDetailsController(req, res) {
    try {
        const userId = req.userId;
        const orders = await orderSchema.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
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

        // Mapear y parsear el product_details
        const parsedOrders = orders.map(order => {
            let productDetails = order.product_details;

            // Si es string, lo parseamos
            if (typeof productDetails === 'string') {
                try {
                    productDetails = JSON.parse(productDetails);

                    // A veces la propiedad image todavía está como string de array, así que la parseamos también
                    if (typeof productDetails.image === 'string') {
                        productDetails.image = JSON.parse(productDetails.image);
                    }
                } catch (e) {
                    console.error("Error parsing product_details:", e.message);
                    productDetails = {};
                }
            }

            return {
                ...order.toJSON(), // Convertimos el modelo a objeto
                product_details: productDetails
            };
        });

        return res.json({
            message: "Lista de Ordenes",
            error: false,
            success: true,
            data: parsedOrders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}
