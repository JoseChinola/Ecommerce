import inventorySchema from "../models/Inventory.model.js";
import InventoryMovementSchema from "../models/inventoryMovementSchema.js";
import productSchema from "../models/product.model.js";
import userSchema from "../models/user.model.js";
import warehouseSchema from "../models/warehouse.model.js";


export const addInventoryController = async (req, res) => {
    try {
        const userId = req.userId;
        const { warehouseId, productId, stock } = req.body;

        if (!warehouseId || !productId || !stock) {
            return res.status(400).json({
                message: "Los campos son obligatorios",
                error: true,
                success: false,
            });
        }

        const warehouse = await warehouseSchema.findOne({ where: { _id: warehouseId } });
        if (!warehouse) {
            return res.status(404).json({
                message: "Almacén no encontrado",
                error: true,
                success: false,
            });
        }

        const product = await productSchema.findOne({ where: { _id: productId } });
        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado",
                error: true,
                success: false,
            });
        }

        const existingInventory = await inventorySchema.findOne({
            where: { warehouseId, productId },
        });

        let updatedInventory;

        if (existingInventory) {
            const newStock = Number(existingInventory.stock) + Number(stock);

            await inventorySchema.update(
                { stock: newStock },
                { where: { _id: existingInventory._id } }
            );

            updatedInventory = await inventorySchema.findOne({ where: { _id: existingInventory._id } });

        } else {
            updatedInventory = await inventorySchema.create({
                warehouseId,
                userId,
                productId,
                stock,
                description: "Entrada de producto al inventario",
            });
        }

        await InventoryMovementSchema.create({
            warehouseId,
            productId,
            userId,
            quantity: stock,
            type: "entrada",
            description: "Entrada de producto al inventario",
            date: new Date(),
        });

        return res.json({
            message: "Inventario actualizado con éxito",
            error: false,
            success: true,
            data: updatedInventory,
        });

    } catch (error) {
        console.error("error:", error);
        return res.status(500).json({
            message: error.message || "Error interno del servidor",
            error: true,
            success: false,
        });
    }
};

export const getInventoryController = async (req, res) => {
    try {
        const userId = req.userId

        const inventory = await inventorySchema.findAll({
            include: [
                {
                    model: warehouseSchema,
                    as: "warehouse",
                    attributes: ["name"],
                },
                {
                    model: productSchema,
                    as: "product",
                    attributes: ["name", "image"],
                },
                {
                    model: userSchema,
                    as: "user",
                    attributes: ["name"],
                }

            ],
            order: [["createdAt", "DESC"]],

        });

        const parsedInventory = inventory.map(inventory => {
            let imageArray = [];

            try {
                const cleaned = inventory.product.image
                    ?.replace(/^"|"$/g, '')     // Eliminar comillas externas
                    ?.replace(/\\"/g, '"');     // Reemplazar comillas escapadas

                imageArray = JSON.parse(cleaned); // Convertir a array
            } catch (err) {
                imageArray = []; // Si hay error, dejar como array vacío
            }

            return {
                ...inventory.toJSON(),
                productData: {
                    ...inventory.product.toJSON(),
                    image: imageArray[0] || null, // Solo la primera imagen
                },
            };
        });

        return res.json({
            message: "Lista de inventario",
            error: false,
            success: true,
            data: parsedInventory
        });

    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

export const updateInventoryController = async (req, res) => {
    try {
        const { _id, warehouseId, productId, stock } = req.body;
        const userId = req.userId;

        if (!_id || !warehouseId || !productId || stock === undefined) {
            return res.status(400).json({
                message: "Los campos son obligatorios",
                error: true,
                success: false,
            });
        }

        const parsedStock = Number(stock);
        if (isNaN(parsedStock)) {
            return res.status(400).json({
                message: "El stock debe ser un número válido",
                error: true,
                success: false,
            });
        }

        const warehouse = await warehouseSchema.findOne({ where: { _id: warehouseId } });
        if (!warehouse) {
            return res.status(404).json({
                message: "Almacén no encontrado",
                error: true,
                success: false,
            });
        }

        const product = await productSchema.findOne({ where: { _id: productId } });
        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado",
                error: true,
                success: false,
            });
        }

        const stockInventory = await inventorySchema.findOne({
            where: { _id, warehouseId, productId },
        });

        if (!stockInventory) {
            return res.status(404).json({
                message: "Inventario no encontrado",
                error: true,
                success: false,
            });
        }

        const currentStock = Number(stockInventory.stock);
        let movementType = null;
        let quantityDiff = 0;
        let movementDescription = "";

        if (parsedStock > currentStock) {
            movementType = "entrada";
            quantityDiff = parsedStock - currentStock;
            movementDescription = `Ajuste de Entrada: anterior ${currentStock}, nuevo ${parsedStock}, incremento ${quantityDiff}`;
        } else if (parsedStock < currentStock) {
            movementType = "salida";
            quantityDiff = currentStock - parsedStock;
            movementDescription = `Ajuste de Salida: anterior ${currentStock}, nuevo ${parsedStock}, decremento ${quantityDiff}`;
        } else {
            // No hay cambio
            return res.json({
                message: "El stock no cambió. No se realizaron ajustes.",
                error: false,
                success: true,
                data: stockInventory,
            });
        }

        // Registrar movimiento
        await InventoryMovementSchema.create({
            warehouseId,
            productId,
            userId,
            quantity: quantityDiff,
            type: movementType,
            description: movementDescription,
            date: new Date(),
        });

        // Actualizar inventario
        await inventorySchema.update(
            {
                stock: parsedStock,
                description: movementDescription,
            },
            {
                where: { _id },
            }
        );

        const updatedInventory = await inventorySchema.findOne({ where: { _id } });

        return res.json({
            message: "Inventario actualizado con éxito",
            error: false,
            success: true,
            data: updatedInventory,
        });

    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({
            message: error.message || "Error interno del servidor",
            error: true,
            success: false,
        });
    }
};