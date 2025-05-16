import categorySchema from "../models/category.model.js";
import productSchema from "../models/product.model.js";
import subCategorySchema from "../models/subCategory.model.js";

export const AddCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body


        if (!name || !image) {
            return res.status(400).json({
                message: "Enter required fields",
                error: true,
                success: false
            })
        }

        const addCategory = await categorySchema.create({ name, image });


        if (!addCategory) {
            return res.status(500).json({
                message: "Not Created",
                error: true,
                success: false
            })
        }

        return res.json({
            message: "Add Category",
            data: addCategory,
            success: true,
            error: false

        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

export const getCategoryController = async (req, res) => {

    try {
        const data = await categorySchema.findAll({
            order: [['createdAt', 'DESC']]
        })

        res.json({
            data: data,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

export const updateCategoryController = async (req, res) => {
    try {
        const { _id, name, image } = req.body

        const update = await categorySchema.update({
            name,
            image
        }, { where: { _id: _id } })

        return res.json({
            message: "Actualizar categoría",
            success: true,
            error: false,
            data: update
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const { _id } = req.body;
        console.log('_id', _id)

        // Verificar si existen subcategorías asociadas a la categoría
        const checkSubCategory = await subCategorySchema.count({
            where: {
                category: _id
            }
        });


        const checkProduct = await productSchema.count({
            include: [{
                model: categorySchema,
                as: 'categories',
                where: { _id: _id }
            }]
        });



        if (checkSubCategory > 0 || checkProduct > 0) {
            return res.status(400).json({
                message: "La categoría ya está en uso y no se puede eliminar.",
                error: true,
                success: false,
            });
        }


        // Si no hay subcategorías, eliminar la categoría
        const deletedCategory = await categorySchema.destroy({
            where: { _id: _id }
        });

        if (!deletedCategory) {
            return res.status(404).json({
                message: "Categoría no encontrada.",
                error: true,
                success: false,
            });
        }

        return res.json({
            message: "Categoría eliminada",
            data: deletedCategory,
            error: false,
            success: true,
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
};

