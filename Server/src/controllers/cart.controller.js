import cartProductSchema from "../models/cartProduct.model.js";
import inventorySchema from "../models/Inventory.model.js";
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
                message: "Producto ya en la carrito",
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

        await inventorySchema.decrement("stock", {
            by: 1,
            where: { productId: productId }
        });


        // 🔹 Recargar el usuario con su carrito actualizado
        const user = await userSchema.findByPk(userId, {
            include: {
                model: cartProductSchema,  // ✅ Relación con el carrito
                as: "shopping_cart",
            }
        });


        return res.json({
            data: user,
            message: "Producto agregado",
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
        const userId = req.userId;
        const { _id: cartItemId, qty } = req.body;

        if (!cartItemId || qty == null) {
            return res.status(400).json({ message: "Falta cartItemId o qty", success: false });
        }

        // 1) Busca la fila del carrito para obtener productId y vieja cantidad
        const cartItem = await cartProductSchema.findOne({
            where: { _id: cartItemId, userId }
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Item de carrito no encontrado", success: false });
        }

        // 2) Calcula cuánto varió la cantidad
        const prevQty = cartItem.quantity;
        const diff = qty - prevQty;

        // 3) Actualiza el carrito
        await cartProductSchema.update(
            { quantity: qty },
            { where: { _id: cartItemId, userId } }
        );

        // 4) Si aumentó => decrementa stock. Si bajó => incrementa stock
        if (diff > 0) {
            await inventorySchema.decrement("stock", {
                by: diff,
                where: { productId: cartItem.productId }
            });
        } else if (diff < 0) {
            await inventorySchema.increment("stock", {
                by: -diff,
                where: { productId: cartItem.productId }
            });
        }

        return res.json({ message: "Cantidad y stock actualizados", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};


export const deleteCartItemQtyController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                message: "Falta id",
                error: true,
                success: false
            });
        }

        // 1) Buscar el ítem del carrito para obtener productId y cantidad
        const cartItem = await cartProductSchema.findOne({
            where: { _id: _id, userId }
        });

        if (!cartItem) {
            return res.status(404).json({
                message: "Carrito no encontrado",
                error: true,
                success: false
            });
        }

        const { productId, quantity } = cartItem;

        // Usamos el método destroy de Sequelize para eliminar el registro.
        const deleteCartItem = await cartProductSchema.destroy({
            where: { _id: _id, userId: userId }
        });

        // 3) Restaurar el stock completo de ese producto en el inventario
        await inventorySchema.increment("stock", {
            by: quantity,
            where: { productId }
        });

        return res.json({
            message: "Producto Removido",
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

        // 1) Buscar el ítem del carrito para obtener productId y cantidad
        const cartItem = await cartProductSchema.findOne({
            where: { userId }
        });

        if (!cartItem) {
            return res.status(404).json({
                message: "Producto no encontrado",
                error: true,
                success: false
            });
        }

        const { productId, quantity } = cartItem;

        // Eliminamos todos los productos del carrito de ese usuario
        const deleteCartItems = await cartProductSchema.destroy({
            where: { userId: userId }
        });

        if (deleteCartItems === 0) {
            return res.status(404).json({
                message: "No Producto en el carrito",
                error: true,
                success: false
            });
        }

        // 3) Restaurar el stock completo de ese producto en el inventario
        await inventorySchema.increment("stock", {
            by: quantity,
            where: { productId }
        });

        return res.json({
            message: "Productos Removidos",
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
