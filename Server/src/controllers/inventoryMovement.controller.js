import InventoryMovementSchema from "../models/inventoryMovementSchema.js ";
import productSchema from "../models/product.model.js";
import userSchema from "../models/user.model.js";
import warehouseSchema from "../models/warehouse.model.js";

export const getInventoryMovementController = async (req, res) => {
    try {
        const inventoryMovements = await InventoryMovementSchema.findAll({
            include: [
                {
                    model: productSchema,
                    as: "productData",
                    attributes: ["name", "image"],
                },
                {
                    model: warehouseSchema,
                    as: "warehouseData",
                    attributes: ["name"],
                },
                {
                    model: userSchema,
                    as: "user",
                    attributes: ["name"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        // Limpiar el campo `image` para dejar solo la primera imagen
        const parsedMovements = inventoryMovements.map(movement => {
            let imageArray = [];

            try {
                const cleaned = movement.productData.image
                    ?.replace(/^"|"$/g, '')     // Eliminar comillas externas
                    ?.replace(/\\"/g, '"');     // Reemplazar comillas escapadas

                imageArray = JSON.parse(cleaned); // Convertir a array
            } catch (err) {
                imageArray = []; // Si hay error, dejar como array vacío
            }

            return {
                ...movement.toJSON(),
                productData: {
                    ...movement.productData.toJSON(),
                    image: imageArray[0] || null, // Solo la primera imagen
                },
            };
        });

        return res.json({
            data: parsedMovements,
            message: "Inventario Movimientos",
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
};