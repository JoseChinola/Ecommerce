import productSchema from '../models/product.model.js';
import storeSchema from '../models/store.model.js'


export const addStoreController = async (req, res) => {
    try {
        const { name, productId, stock, lastUpdate } = req.body;

        // 1️⃣ Verificar si el producto existe antes de continuar
        const producExists = await productSchema.findOne({ where: { _id: productId } });

        if (!producExists) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false,
            });
        }

        // 2️⃣ Crear el almacén (store)
        const newStore = await storeSchema.create({
            name,
            productId,
            stock,
            lastUpdate,
        });

        return res.json({
            message: "Store created successfully",
            error: false,
            success: true,
            data: newStore,
        });
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
};