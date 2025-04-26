import { Op, Sequelize } from 'sequelize';
import productSchema from '../models/product.model.js'
import categorySchema from '../models/category.model.js';
import subCategorySchema from '../models/subCategory.model.js';
import inventorySchema from '../models/Inventory.model.js';

export const createProductController = async (req, res) => {
    try {
        const { name, image, categoryId, subCategoryId, unit,
            price, discount, description, more_details } = req.body

        const category = categoryId[0]?._id;
        const subCategory = subCategoryId[0]?._id;


        // Verifica si la imagen está correctamente procesada antes de insertarla
        const imageToSave = Array.isArray(image) && image.length > 0 ? JSON.stringify(image) : "[]";


        // Verifica si el valor es válido antes de guardar en la base de datos
        if (!name || imageToSave === "[]" || !category || !subCategoryId || !unit || !price || !description) {
            return res.status(400).json({
                message: "Enter required fields",
                error: true,
                success: false
            });
        }

        const product = await productSchema.build({
            name,
            image: imageToSave,
            categoryId: category,
            subCategoryId: subCategory,
            unit,
            price,
            discount,
            description,
            more_details
        })

        const saveProduct = await product.save()

        return res.json({
            message: "product created Successfully",
            data: saveProduct,
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        })
    }
}

export const getProductController = async (req, res) => {
    try {
        let { page, limit, search } = req.body;


        if (!page) {
            page = 1;  // La página debe empezar desde 1, no desde 2
        }

        if (!limit) {
            limit = 10;  // Valor predeterminado de 10 productos por página
        }

        // Lógica para la paginación
        const offset = (page - 1) * limit;

        // Query de búsqueda con Sequelize (usando operador Op.like)
        const query = search ? {
            [Sequelize.Op.or]: [
                {
                    name: {
                        [Sequelize.Op.like]: `%${search}%`
                    }
                },
                {
                    description: {
                        [Sequelize.Op.like]: `%${search}%`
                    }
                }
            ]
        } : {};

        // Recupera los productos y cuenta el total
        const { rows: data, count: totalCount } = await productSchema.findAndCountAll({
            where: query,
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: categorySchema, // Relación con categoría
                    as: 'categoryData'  // El alias definido en la asociación
                },
                {
                    model: subCategorySchema, // Relación con subcategoría
                    as: 'subcategoryData'  // El alias definido en la asociación
                },
                {
                    model: inventorySchema, // Relación con producto
                    as: 'inventories',
                    attributes: ["_id", "stock"],
                }
            ]
        });



        // Procesar las imágenes y convertirlas en un array
        const processedData = data.map(product => {
            if (product.image) {
                try {
                    product.image = JSON.parse(product.image);
                } catch (error) {
                    console.error("Error parsing image JSON", error);
                    product.image = [];
                }
            }
            return product;
        });

        // Respuesta con los datos
        return res.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: processedData
        });
    } catch (error) {
        console.log("error: ", error)
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};


export const getProductByCategory = async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).json({
                message: "providde category id",
                error: true,
                success: false
            })
        }

        // Asegurar que categoryId acepte array o un solo ID
        const whereCondition = Array.isArray(id)
            ? { categoryId: { [Op.in]: id } }
            : { categoryId: id };


        const product = await productSchema.findAll({
            where: whereCondition,
            limit: 15,
            include: [
                {
                    model: inventorySchema, // Relación con producto
                    as: 'inventories',
                    attributes: ["_id", "stock"],
                }
            ],
        });


        return res.json({
            message: "catgory product list",
            data: product,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

export const getProductByCategoryAndSubCategory = async (req, res) => {
    try {
        let { categoryId, subCategoryId, page, limit } = req.body;

        // Validar que se envíen los parámetros requeridos
        if (!categoryId || !subCategoryId) {
            return res.status(400).json({
                message: "Provide category and subCategory",
                error: true,
                success: false
            });
        }

        // Asegurar que sean arrays para evitar errores con Op.in
        categoryId = [].concat(categoryId);
        subCategoryId = [].concat(subCategoryId);

        // Definir valores por defecto
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        // Construcción del query
        const query = {
            categoryId: { [Op.in]: categoryId },
            subCategoryId: { [Op.in]: subCategoryId }
        };

        // Ejecutar ambas consultas en paralelo con Promise.all
        const [data, dataCount] = await Promise.all([
            productSchema.findAll({
                where: query,
                offset,
                limit,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: inventorySchema, // Relación con producto
                        as: 'inventories',
                        attributes: ["_id", "stock"],
                    }
                ],


            }),
            productSchema.count({ where: query })
        ]);

        // Responder con los datos
        return res.status(200).json({
            message: "Product list",
            data: data,
            totalCount: dataCount,
            page: page,
            limit: limit,
            success: true,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

export const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.body

        const product = await productSchema.findOne({
            where: { _id: productId },
            include: [
                {
                    model: inventorySchema, // Relación con producto
                    as: 'inventories',
                    attributes: ["_id", "stock"],
                }
            ],
        });


        return res.json({
            message: "product details",
            data: product,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

//update product
export const updateProductDetails = async (req, res) => {
    try {
        const { _id, image } = req.body

        const imageToSave = Array.isArray(image) && image.length > 0 ? JSON.stringify(image) : "[]";


        if (!_id) {
            return res.status(400).json({
                message: "provide product _id",
                error: true,
                success: false
            })
        }

        const updateProduct = await productSchema.update({
            // Aquí se pasan los valores que queremos actualizar
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            discount: req.body.discount,
            description: req.body.description,
            image: imageToSave,  // Guardamos las imágenes como un string
            more_details: req.body.more_details
        }, {
            where: { _id: _id },  // Filtramos por el _id
            returning: true,
        });

        return res.json({
            message: "Update successfully",
            data: updateProduct,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

//delete product
export const deleteProductDetails = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                message: "Provide a valid product ID",
                error: true,
                success: false
            });
        }

        // Verificar si el producto existe
        const product = await productSchema.findOne({ where: { _id } });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Eliminar el producto
        await product.destroy();

        return res.json({
            message: "Deleted successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

//search product 
export const searchProduct = async (req, res) => {
    try {
        let { search, page, limit } = req.body

        if (!page) {
            page = 1
        }
        if (!limit) {
            limit = 10
        }

        const query = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        const offset = (page - 1) * limit;
        const [data, dataCount] = await Promise.all([
            productSchema.findAll({
                limit,
                offset,
                where: query,
                order: [['createdAt', 'DESC']],
                include: ['categoryData', 'subcategoryData']

            }),
            productSchema.count({ where: query })
        ])

        return res.json({
            message: "Product data",
            error: false,
            success: true,
            data: data,
            totalCount: dataCount,
            totalPage: Math.ceil(dataCount / limit),
            page: page,
            limit: limit
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}