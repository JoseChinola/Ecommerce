import Stripe from "../config/stripe.js";
import cartProductSchema from "../models/cartProduct.model.js";
import orderSchema from "../models/order.model.js";
import { nanoid } from 'nanoid';
import userSchema from "../models/user.model.js";
import { FRONTEND_URL } from "../config.js";

export async function CashOnDeleveryOrderController(req, res) {
    try {
        const userId = req.userId;
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

        // Validaciones básicas
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

        const payload = list_items.map(item => {

            const productDetails = {
                name: item.productData.name,
                image: item.productData.image // Asumimos que es string o array válido
            };

            return {
                userId: userId,
                orderId: `ORD-${nanoid(10)}`,
                productId: item.productId,
                product_details: JSON.stringify(productDetails), // 👈 Muy importante
                paymentId: "",
                paymentStatus: "CASH ON DELIVERY",
                deliveryAddress: addressId,
                subTotalAmt: subTotalAmt,
                totalAmt: totalAmt,
            };
        });

        // Inserta múltiples órdenes en la base de datos
        const generatedOrder = await orderSchema.bulkCreate(payload);

        // Borra productos del carrito del usuario
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


export async function paymentController(req, res) {
    try {
        const userId = req.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

        const user = await userSchema.findOne({ where: { _id: userId } })
        const line_items = list_items.map(item => {
            let imageArray = [];

            if (typeof item.productData.image === 'string') {
                try {
                    const parsed = JSON.parse(item.productData.image);
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
                    currency: 'inr',
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
                addressId: addressId
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