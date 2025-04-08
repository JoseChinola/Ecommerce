import cartProductSchema from "../models/cartProduct.model.js";
import productSchema from "../models/product.model.js";
import userSchema from "../models/user.model.js";

export const addToCartItemController = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Provide product",
                error: true,
                success: false
            });
        }

        // Verificar si el producto ya está en el carrito del usuario
        const existingCartItem = await cartProductSchema.findOne({
            where: { userId, productId }
        });

        if (existingCartItem) {
            return res.status(400).json({
                message: "Product already in cart",
                error: true,
                success: false
            });
        }

        // Agregar producto al carrito
        await cartProductSchema.create({
            quantity: 1,
            userId,
            productId
        });

        // 🔹 Recargar el usuario con su carrito actualizado
        const user = await userSchema.findByPk(userId, {
            include: {
                model: cartProductSchema,  // ✅ Relación con el carrito
                as: "shopping_cart",
            }
        });

        return res.json({
            data: user.shopping_cart, // ✅ Devolvemos el carrito actualizado
            message: "Item add successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

export const getCartItemController = async (req, res) => {
    try {
        const userId = req.userId

        const cartItem = await cartProductSchema.findAll({
            where: { userId: userId },
            order: [['productId', 'DESC']],
            include: [
                {
                    model: productSchema,
                    as: 'productData'
                },

            ]
        })

        return res.json({
            data: cartItem,
            error: false,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export const updateCartItemQtyController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id, qty } = req.body

        if (!_id || !qty) {
            return res.status(400).json({
                message: "Provide Product, Qty",
                error: true,
                success: false
            })
        }


        // Actualizar el campo "quantity"
        const updateCartTime = await cartProductSchema.update(
            { quantity: qty },
            { where: { _id: _id, userId: userId } }
        );

        return res.json({
            message: "Item added",
            success: true,
            error: false,
            data: updateCartTime
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export const deleteCartItemQtyController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                message: "Provide Product",
                error: true,
                success: false
            });
        }

        // Usamos el método destroy de Sequelize para eliminar el registro.
        const deleteCartItem = await cartProductSchema.destroy({
            where: { _id: _id, userId: userId }
        });

        return res.json({
            message: "Item remove",
            success: true,
            error: false,
            data: deleteCartItem
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

export const deleteCartItemsController = async (req, res) => {
    try {
        const userId = req.userId;


        // Eliminamos todos los productos del carrito de ese usuario
        const deleteCartItems = await cartProductSchema.destroy({
            where: { userId: userId }
        });

        if (deleteCartItems === 0) {
            return res.status(404).json({
                message: "No products found in cart",
                error: true,
                success: false
            });
        }


        return res.json({
            message: "All products removed from cart successfully",
            success: true,
            error: false,
            data: deleteCartItems
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};
