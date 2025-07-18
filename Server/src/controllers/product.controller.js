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
        if (!name  || !unit || !price || !description) {
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

        // Asegurar que page y limit sean números enteros válidos
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const offset = (page - 1) * limit;

        // Filtro de búsqueda
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

        // Contar el total antes de aplicar offset
        const totalCount = await productSchema.count({ where: query });
        const totalPages = Math.ceil(totalCount / limit);

        // Evitar páginas fuera de rango
        if (offset >= totalCount && totalCount > 0) {
            return res.json({
                message: "Página fuera de rango",
                error: false,
                success: true,
                totalCount,
                totalNoPage: totalPages,
                pageActual: page,
                data: []
            });
        }

        // Obtener productos con paginación
        const { rows: data } = await productSchema.findAndCountAll({
            where: query,
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: categorySchema,
                    as: 'categories',
                    through: { attributes: [] },
                    attributes: ['_id', 'name']
                },
                {
                    model: subCategorySchema,
                    as: 'subcategories',
                    through: { attributes: [] },
                    attributes: ['_id', 'name']
                },
                {
                    model: inventorySchema,
                    as: 'inventories',
                    attributes: ["_id", "stock"]
                }
            ]
        });

        // Procesar imágenes
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

        // Enviar respuesta
        return res.json({
            message: "Product data fetched successfully",
            error: false,
            success: true,
            totalCount,
            totalNoPage: totalPages,
            pageActual: page,
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

        if (!id) {
            return res.status(400).json({
                message: "Please provide category ID(s)",
                error: true,
                success: false
            });
        }

        const isArray = Array.isArray(id);

        const products = await productSchema.findAll({
            where: { publish: true },
            limit: 100,  // puedes ajustar este límite si quieres
            include: [
                {
                    model: inventorySchema,
                    as: 'inventories',
                    attributes: ["_id", "stock"],
                },
                {
                    model: categorySchema,
                    as: 'categories',
                    attributes: ["_id", "name"],
                    through: { attributes: [] },
                    required: true,
                    where: isArray
                        ? { _id: { [Op.in]: id } }
                        : { _id: id }
                }
            ]
        });

        if (isArray) {
            // Agrupar productos por categoría
            const grouped = products.reduce((acc, product) => {
                product.categories.forEach(cat => {
                    if (!acc[cat._id]) {
                        acc[cat._id] = {
                            category: cat,
                            products: []
                        };
                    }
                    acc[cat._id].products.push(product);
                });
                return acc;
            }, {});

            return res.json({
                message: "Grouped product list by categories",
                data: Object.values(grouped),
                error: false,
                success: true
            });
        }

        // Si no es array, responde como antes
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

        // Validación de parámetros
        if (!categoryId || categoryId === 'null' || !subCategoryId || subCategoryId === 'null') {
            return res.status(400).json({
                message: "Provide valid category and subCategory",
                error: true,
                success: false
            });
        }

        // Convertir los parámetros en arrays por si son enviados como cadenas
        categoryId = Array.isArray(categoryId) ? categoryId : [categoryId];
        subCategoryId = Array.isArray(subCategoryId) ? subCategoryId : [subCategoryId];

        // Paginación
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        // Consulta de productos
        const [data, dataCount] = await Promise.all([
            productSchema.findAll({
                where: { publish: true },
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
                        as: 'subcategories',
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

        // Responder con los productos y el conteo total
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
        const { _id, name, image, categoryId, subCategoryId, unit, price, discount, description, publish, more_details } = req.body;

        if (!_id) {
            return res.status(400).json({
                message: "Provide product _id",
                error: true,
                success: false
            });
        }

        if (!name && !image && !categoryId && !subCategoryId && !unit && !price && !discount && !description) {
            return res.status(400).json({
                message: "At least one field must be provided to update",
                error: true,
                success: false
            });
        }

        const imageToSave = Array.isArray(image) && image.length > 0 ? JSON.stringify(image) : "[]";

        // Buscamos el producto primero
        const product = await productSchema.findByPk(_id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        // Actualizamos solo los campos enviados
        await product.update({
            name: name || product.name,
            image: image ? imageToSave : product.image,
            unit: unit || product.unit,
            price: price || product.price,
            discount: discount || product.discount,
            description: description || product.description,
            more_details: more_details || product.more_details,
            publish: publish ?? product.publish
        });

        // Actualizamos las categorías si se enviaron
        if (categoryId && categoryId.length > 0) {
            const categories = categoryId.map(cat => (typeof cat === 'object' ? cat._id : cat));
            await product.setCategories(categories);
        }

        // Actualizamos las subcategorías si se enviaron
        if (subCategoryId && subCategoryId.length > 0) {
            const subCategories = subCategoryId.map(sub => (typeof sub === 'object' ? sub._id : sub));
            await product.setSubcategories(subCategories);
        }

        return res.json({
            message: "Producto Actualizado",
            data: product,
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
            message: "Producto eliminado",
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

        // Verificar si el término de búsqueda es válido
        if (!search || search.trim().length < 3) {
            return res.json({
                message: "Search term too short or empty",
                error: false,
                success: true,
                data: [],
                totalCount: 0,
                totalPage: 0,
                page,
                limit
            });
        }

        // Definir valores por defecto para la paginación
        page = page || 1;
        limit = limit || 10;

        // Construir la consulta de búsqueda
        const query = {
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ]
        };

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
                    { model: categorySchema, as: 'categories' },
                    { model: subCategorySchema, as: 'subcategories' }
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
