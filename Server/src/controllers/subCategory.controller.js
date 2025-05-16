import categorySchema from "../models/category.model.js";
import subCategorySchema from "../models/subCategory.model.js";


export const AddSubCategoryController = async (req, res) => {
    try {
        const { name, image, category } = req.body


        // Validar que category sea un array y tenga al menos un elemento
        if (!name || !image || !Array.isArray(category) || category.length === 0) {
            return res.status(400).json({
                message: "Proporcionar nombre, imagen y al menos una categoría.",
                error: true,
                success: false
            });
        }

        const categoryId = category[0]?._id;
        if (!categoryId) {
            return res.status(400).json({
                message: "ID de categoría no válida",
                error: true,
                success: false
            });
        }

        const addSubCategory = await subCategorySchema.create({
            name,
            image,
            category: categoryId
        });


        if (!addSubCategory) {
            return res.status(500).json({
                message: "No creado",
                error: true,
                success: false
            })
        }

        return res.json({
            message: "Subcategoría creada",
            data: addSubCategory,
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

export const getSubCategoryController = async (req, res) => {
    try {
        const data = await subCategorySchema.findAll({
            order: [['createdAt', 'ASC']],
            include: [{
                model: categorySchema,
                as: 'categoryData'
            }]
        });


        return res.json({
            message: "Sub Category data",
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

export const updateSubCategoryController = async (req, res) => {
    try {
        const { _id, name, image, category } = req.body

        console.log("category ", category)
        const checkSub = await subCategorySchema.findOne({ where: { _id: _id } })

        if (!checkSub) {
            return res.status(400).json({
                message: "subcategoría no encontrada",
                error: true,
                success: false
            });
        }

        const categoryId = category[0]?._id;
        if (!categoryId) {
            return res.status(400).json({
                message: "ID de categoría no válida",
                error: true,
                success: false
            });
        }

        const updateSubCategory = await subCategorySchema.update({
            name,
            image,
            category: categoryId
        }, { where: { _id: _id } });

        return res.json({
            message: "Actualizado con éxito",
            data: updateSubCategory,
            error: false,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        })
    }
}

export const deleteSubCategoryController = async (req, res) => {
    try {
        const { _id } = req.body

        const deleteSubCategory = await subCategorySchema.destroy({
            where: { _id: _id }
        })
        return res.json({
            message: "Eliminada con éxito",
            data: deleteSubCategory,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        })
    }
}