import { Op, Sequelize } from 'sequelize';
import productSchema from '../models/product.model.js'
import categorySchema from '../models/category.model.js';
import subCategorySchema from '../models/subCategory.model.js';
import inventorySchema from '../models/Inventory.model.js';

//create product
export const createProductController = async (req, res) => {
    try {
        const { name, publish, image, categoryId, subCategoryId, unit, price, discount, description, more_details } = req.body;


        // Verifica si la imagen está correctamente procesada antes de insertarla
        const imageToSave = Array.isArray(image) && image.length > 0 ? JSON.stringify(image) : "[]";

        // Verifica si los valores son válidos antes de guardar en la base de datos
        if (!name || imageToSave === "[]" || !unit || !price || !description) {
            return res.status(400).json({
                message: "Todos los campos son requeridos",
                error: true,
                success: false
            });
        }

        // Si no se recibe categoryIds o subCategoryIds, se establece como un arreglo vacío
        const categories = Array.isArray(categoryId)
            ? categoryId.map(cat => (typeof cat === 'object' ? cat._id : cat))
            : categoryId ? [typeof categoryId === 'object' ? categoryId._id : categoryId] : [];

        const subCategories = Array.isArray(subCategoryId)
            ? subCategoryId.map(sub => (typeof sub === 'object' ? sub._id : sub))
            : subCategoryId ? [typeof subCategoryId === 'object' ? subCategoryId._id : subCategoryId] : [];




        // Verifica si se ha recibido al menos una categoría y una subcategoría
        if (categories.length === 0 || subCategories.length === 0) {
            return res.status(400).json({
                message: "Debes seleccionar al menos una categoría y una subcategoría",
                error: true,
                success: false
            });
        }

        // Crear el producto sin las relaciones aún
        const product = await productSchema.create({
            name,
            image: imageToSave,
            unit,
            price,
            discount,
            description,
            publish,
            more_details
        });

        if (!product || !product._id) {
            return res.status(500).json({
                message: "Error al crear producto",
                error: true,
                success: false
            });
        }

        // Establecer las relaciones muchos a muchos (categorías y subcategorías)
        await product.setCategories(categories);  // Asocia el producto con varias categorías
        await product.setSubcategories(subCategories); // Asocia el producto con varias subcategorías

        return res.json({
            message: "Producto creado",
            data: product,
            success: true,
            error: false
        });

    } catch (error) {
        console.log('Error creando producto', error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

//get product
export const getProductController = async (req, res) => {
    try {
        let { page, limit, search } = req.body;

        // Default page and limit values
        if (!page) {
            page = 1;  // La página debe empezar desde 1
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
                    model: categorySchema, // Relación con categorías (múltiples categorías posibles)
                    as: 'categories',  // El alias definido en la asociación
                    through: { attributes: [] },  // Ignorar la tabla intermedia en la respuesta
                },
                {
                    model: subCategorySchema, // Relación con subcategorías (múltiples subcategorías posibles)
                    as: 'subcategories',  // El alias definido en la asociación
                    through: { attributes: [] },  // Ignorar la tabla intermedia en la respuesta
                },
                {
                    model: inventorySchema, // Relación con inventarios
                    as: 'inventories',
                    attributes: ["_id", "stock"],  // Incluye solo los atributos necesarios
                }
            ]
        });

        // Procesar las imágenes y convertirlas en un array
        const processedData = data.map(product => {
            if (product.image) {
                try {
                    product.image = JSON.parse(product.image);  // Convierte la imagen almacenada en JSON a un array
                } catch (error) {
                    console.error("Error parsing image JSON", error);
                    product.image = [];  // Si hay error en el parseo, lo dejamos vacío
                }
            }
            return product;
        });

        // Respuesta con los datos procesados
        return res.json({
            message: "Product data fetched successfully",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),  // Total de páginas
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

//get product by category
export const getProductByCategory = async (req, res) => {
    try {
        const { id } = req.body;

        // Verifica si se proporcionó un ID de categoría
        if (!id) {
            return res.status(400).json({
                message: "Please provide category ID",
                error: true,
                success: false
            });
        }


        // Recupera los productos que pertenecen a las categorías especificadas
        const products = await productSchema.findAll({
            //where: whereCondition || {},
            limit: 15,
            include: [
                {
                    model: inventorySchema, // Relación con inventarios
                    as: 'inventories',
                    attributes: ["_id", "stock"], // Solo atributos necesarios
                },
                {
                    model: categorySchema,
                    as: 'categories',
                    attributes: ["_id", "name"],
                    through: { attributes: [] },
                    required: true,
                    where: Array.isArray(id)
                        ? { _id: { [Op.in]: id } }
                        : { _id: id }
                }
            ]
        });

        // Respuesta con los productos obtenidos
        return res.json({
            message: "Product list by category",
            data: products,
            error: false,
            success: true
        });
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

//get product by categoro and sub category
export const getProductByCategoryAndSubCategory = async (req, res) => {
    try {
        let { categoryId, subCategoryId, page, limit } = req.body;

        if (!categoryId || !subCategoryId) {
            return res.status(400).json({
                message: "Provide category and subCategory",
                error: true,
                success: false
            });
        }

        // Convertir en arrays por si vienen como string único
        categoryId = [].concat(categoryId);
        subCategoryId = [].concat(subCategoryId);

        // Paginación
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        // Consulta
        const [data, dataCount] = await Promise.all([
            productSchema.findAll({
                offset,
                limit,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: inventorySchema,
                        as: 'inventories',
                        attributes: ['_id', 'stock']
                    },
                    {
                        model: categorySchema,
                        as: 'categories',
                        attributes: ['_id', 'name'],
                        through: { attributes: [] },
                        required: true,
                        where: {
                            _id: { [Op.in]: categoryId }
                        }
                    },
                    {
                        model: subCategorySchema,
                        as: 'subcategories', // Asegúrate que este alias coincida con el del modelo
                        attributes: ['_id', 'name'],
                        through: { attributes: [] },
                        required: true,
                        where: {
                            _id: { [Op.in]: subCategoryId }
                        }
                    }
                ]
            }),

            productSchema.count({
                include: [
                    {
                        model: categorySchema,
                        as: 'categories',
                        through: { attributes: [] },
                        required: true,
                        where: {
                            _id: { [Op.in]: categoryId }
                        }
                    },
                    {
                        model: subCategorySchema,
                        as: 'subcategories',
                        through: { attributes: [] },
                        required: true,
                        where: {
                            _id: { [Op.in]: subCategoryId }
                        }
                    }
                ]
            })
        ]);

        return res.status(200).json({
            message: "Product list by category and subcategory",
            data,
            totalCount: dataCount,
            page,
            limit,
            success: true,
            error: false
        });

    } catch (error) {
        console.error("Error fetching products by category and subcategory:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

//get Details product
export const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.body;

        // Validar si el productId fue proporcionado
        if (!productId) {
            return res.status(400).json({
                message: "Please provide productId",
                error: true,
                success: false
            });
        }

        // Buscar el producto junto con las relaciones necesarias
        const product = await productSchema.findOne({
            where: { _id: productId },
            include: [
                {
                    model: inventorySchema, // Relación con inventarios
                    as: 'inventories',
                    attributes: ["_id", "stock"]
                },
                {
                    model: categorySchema, // Relación con categorías
                    as: 'categories', // Alias definido en la asociación
                    attributes: ["_id", "name"] // Puedes agregar más atributos según lo necesites
                },
                {
                    model: subCategorySchema, // Relación con subcategorías
                    as: 'subcategories', // Alias definido en la asociación
                    attributes: ["_id", "name"] // Puedes agregar más atributos según lo necesites
                }
            ]
        });

        // Verificar si se encontró el producto
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Respuesta con los detalles del producto
        return res.json({
            message: "Product details",
            data: product,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

//update product
export const updateProductDetails = async (req, res) => {
    try {
        const { _id, name, image, categoryId, subCategoryId, unit, price, discount, description, more_details } = req.body;

        // Verificar si se proporcionó el _id
        if (!_id) {
            return res.status(400).json({
                message: "Provide product _id",
                error: true,
                success: false
            });
        }

        // Verificar si al menos uno de los valores obligatorios está presente
        if (!name && !image && !categoryId && !subCategoryId && !unit && !price && !discount && !description) {
            return res.status(400).json({
                message: "At least one field must be provided to update",
                error: true,
                success: false
            });
        }

        // Validación de las imágenes
        const imageToSave = Array.isArray(image) && image.length > 0 ? JSON.stringify(image) : "[]";

        // Validación de categoría y subcategoría
        const category = categoryId ? categoryId[0]?._id : null;
        const subCategory = subCategoryId ? subCategoryId[0]?._id : null;

        // Actualización del producto en la base de datos
        const updatedProduct = await productSchema.update(
            {
                name: name || undefined,  // Solo actualiza si el valor no es null o undefined
                image: imageToSave,
                categoryId: category || undefined, // Solo actualiza si hay categoría
                subCategoryId: subCategory || undefined, // Solo actualiza si hay subcategoría
                unit: unit || undefined,
                price: price || undefined,
                discount: discount || undefined,
                description: description || undefined,
                more_details: more_details || undefined
            },
            {
                where: { _id: _id },
                returning: true,  // Devuelve el objeto actualizado
            }
        );

        // Verificar si se realizó la actualización
        if (updatedProduct[0] === 0) {
            return res.status(404).json({
                message: "Product not found or no changes made",
                error: true,
                success: false
            });
        }

        return res.json({
            message: "Product updated successfully",
            data: updatedProduct[1][0],  // El primer elemento contiene el producto actualizado
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

//delete product
export const deleteProductDetails = async (req, res) => {
    try {
        const { _id } = req.body;

        // Validar que el _id esté presente
        if (!_id) {
            return res.status(400).json({
                message: "Provide a valid product ID",
                error: true,
                success: false
            });
        }

        // Verificar si el producto existe en la base de datos
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
            message: "Product deleted successfully",
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error deleting product:", error);
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
        let { search, page, limit } = req.body;

        // Definir valores por defecto para la paginación
        page = page || 1;
        limit = limit || 10;

        // Construir la consulta de búsqueda
        const query = search
            ? {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        // Cálculo de la paginación (offset)
        const offset = (page - 1) * limit;

        // Ejecutar ambas consultas en paralelo usando Promise.all
        const [data, dataCount] = await Promise.all([
            productSchema.findAll({
                where: query,
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']],
                include: [
                    { model: categorySchema, as: 'categoryData' },
                    { model: subCategorySchema, as: 'subcategoryData' }
                ]
            }),
            productSchema.count({ where: query })
        ]);

        // Devolver la respuesta con la información de productos y paginación
        return res.json({
            message: "Product data",
            error: false,
            success: true,
            data: data,
            totalCount: dataCount,
            totalPage: Math.ceil(dataCount / limit),
            page: page,
            limit: limit
        });
    } catch (error) {
        console.error("Error while searching products:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};