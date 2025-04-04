import addressSchema from "../models/address.model.js";
import userSchema from "../models/user.model.js";

export const addAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { address_line, city, state, pincode, country, mobile } = req.body;

        // 1️⃣ Verificar si el usuario existe antes de continuar
        const userExists = await userSchema.findOne({ where: { _id: userId } });

        if (!userExists) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // 2️⃣ Crear la dirección
        const newAddress = await addressSchema.create({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId
        });

        // 3️⃣ Actualizar `users` con el ID de la dirección recién creada
        const [updatedRows] = await userSchema.update(
            { address_details: newAddress._id },
            { where: { _id: userId } }
        );

        if (updatedRows === 0) {
            return res.status(400).json({
                message: "Failed to update user with address",
                error: true,
                success: false
            });
        }

        return res.json({
            message: "Address Created Successfully",
            error: false,
            success: true,
            data: newAddress
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};


export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const data = await addressSchema.findAll({ where: { userId: userId, status: true }, order: [['createdAt', 'DESC']], })


        return res.json({
            message: "List of Address",
            error: false,
            success: true,
            data: data
        })
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id, address_line, city, state, pincode, country, mobile } = req.body;

        const updateAddress = await addressSchema.update(
            { address_line, city, state, pincode, country, mobile },
            {
                where: {
                    _id: _id,
                    userId: userId
                }
            }
        );

        return res.json({
            message: "Address Update",
            error: false,
            success: true,
            data: updateAddress
        })
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const { _id } = req.body

        const disableAddress = await addressSchema.update(
            { status: false },
            {
                where: {
                    _id: _id,
                    userId: userId
                }
            })

        return res.json({
            message: "Address Remove",
            error: false,
            success: true,
            data: disableAddress
        })

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}