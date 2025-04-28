import inventorySchema from "../models/Inventory.model.js";
import InventoryMovementSchema from "../models/inventoryMovementSchema.js";
import productSchema from "../models/product.model.js";
import userSchema from "../models/user.model.js";
import warehouseSchema from "../models/warehouse.model.js";


export const addInventoryController = async (req, res) => {
    try {
        const userId = req.userId
        const { warehouseId, productId, stock } = req.body;

        if (!warehouseId || !productId || !stock) {
            return res.status(400).json({
                message: "los canpous son obligatorios",
                error: true,
                success: false,
            });
        }

        const warehouse = await warehouseSchema.findOne({
            where: {
                _id: warehouseId,
            },
        });

        if (!warehouse) {
            return res.status(404).json({
                message: "Almacen no Encontrado",
                error: true,
                success: false,
            });
        }

        const product = await productSchema.findOne({
            where: {
                _id: productId,
            },
        });

        if (!product) {
            return res.status(404).json({
                message: "producto no encontrado",
                error: true,
                success: false,
            });
        }

        const existingInventory = await inventorySchema.findOne({
            where: {
                warehouseId,
                productId,
            },
        });

        if (existingInventory) {
            return res.status(400).json({
                message: "inventario ya existe",
                error: true,
                success: false,
            });
        }

        const inventory = await inventorySchema.create({
            warehouseId,
            userId: userId,
            productId,
            stock,
            description: 'Entrada de producto al inventario',
        });

        await InventoryMovementSchema.create({
            warehouseId,
            productId,
            userId: userId,
            quantity: stock,
            type: "entrada",
            description: 'Entrada de producto al inventario',
            date: new Date(),
        });

        return res.json({
            message: "Invetario creado con exito",
            error: false,
            success: true,
            data: inventory
        })
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });

    }
}

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

        if (!_id || !warehouseId || !productId || !stock) {
            return res.status(400).json({
                message: "los canpous son obligatorios",
                error: true,
                success: false,
            });
        }
        const warehouse = await warehouseSchema.findOne({
            where: {
                _id: warehouseId,
            },
        });

        if (!warehouse) {
            return res.status(404).json({
                message: "Almacen no Encontrado",
                error: true,
                success: false,
            });
        }

        const product = await productSchema.findOne({
            where: {
                _id: productId,
            },
        });

        if (!product) {
            return res.status(404).json({
                message: "producto no encontrado",
                error: true,
                success: false,
            });
        }

        const stockInventory = await inventorySchema.findOne({
            where: {
                _id: _id,
                warehouseId: warehouseId,
                productId: productId,
            },
        });


        // Registrar movimiento solo si el nuevo stock es mayor al actual
        if (stock > stockInventory.stock) {
            // Es una entrada
            const cantidadEntrante = stock - stockInventory.stock;
            await InventoryMovementSchema.create({
                warehouseId,
                productId,
                userId: req.userId,
                quantity: cantidadEntrante,
                type: "entrada",
                description: "Entrada al inventario aumentada (actualización)",
                date: new Date(),
            });
        } else if (stock < stockInventory.stock) {
            // Es una salida
            const cantidadSaliente = stockInventory.stock - stock;
            await InventoryMovementSchema.create({
                warehouseId,
                productId,
                userId: req.userId,
                quantity: cantidadSaliente,
                type: "entrada",
                description: "Ajuste del inventario disminuye (actualización)",
                date: new Date(),
            });
        }


        const updatedInventory = await inventorySchema.update(
            {
                warehouseId,
                productId,
                stock,
            },
            {
                where: {
                    _id,
                },
            }
        );



        return res.json({
            message: "Inventario actualizado con exito",
            error: false,
            success: true,
            data: updatedInventory
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