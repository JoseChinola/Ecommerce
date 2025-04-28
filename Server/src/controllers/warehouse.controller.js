import warehouseSchema from '../models/warehouse.model.js'



export const addStoreController = async (req, res) => {
    try {
        const { name, description, address } = req.body;

        // 2️⃣ Crear el almacén (store)
        const newStore = await warehouseSchema.create({
            name,
            description,
            address
        });

        return res.json({
            message: "Almacen creado correctamente",
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

export const getStoreController = async (req, res) => {
    try {
        const userId = req.userId
        const data = await warehouseSchema.findAll({
            where: { status: true },
            order: [['createdAt', 'DESC']]
        })


        return res.json({
            message: "Lista de almacen",
            error: false,
            success: true,
            data: data
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

export const updatewarehouseController = async (req, res) => {
    try {
        const { _id, name, description, address } = req.body;

        const updateStore = await warehouseSchema.update(
            { name, description, address },
            {
                where: {
                    _id: _id
                }
            }
        );

        return res.json({
            message: "Almacen Actualizado",
            error: false,
            success: true,
            data: updateStore
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

export const deleteStoreController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id } = req.body

        const disableStore = await warehouseSchema.update(
            { status: false },
            {
                where: {
                    _id: _id
                }
            })

        return res.json({
            message: "Almacen Eliminado",
            error: false,
            success: true,
            data: disableStore
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