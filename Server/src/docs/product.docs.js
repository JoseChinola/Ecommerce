/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Endpoints relacionados con los productos
 */

/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - categoriaId
 *               - precio
 *               - stock
 *             properties:
 *               nombre:
 *                 type: string
 *               categoriaId:
 *                 type: string
 *               subCategoriaId:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *                 format: float
 *               stock:
 *                 type: integer
 *               imagen:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/product/get:
 *   post:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *       400:
 *         description: Error al obtener los productos
 */

/**
 * @swagger
 * /api/product/get-product-categody:
 *   post:
 *     summary: Obtener productos por categoría
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoriaId
 *             properties:
 *               categoriaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Productos de la categoría solicitada
 *       400:
 *         description: Error al obtener los productos
 */

/**
 * @swagger
 * /api/product/get-product-category-and-subcategory:
 *   post:
 *     summary: Obtener productos por categoría y subcategoría
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoriaId
 *               - subCategoriaId
 *             properties:
 *               categoriaId:
 *                 type: string
 *               subCategoriaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Productos de la categoría y subcategoría solicitada
 *       400:
 *         description: Error al obtener los productos
 */

/**
 * @swagger
 * /api/product/get-product-details:
 *   post:
 *     summary: Obtener detalles de un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Detalles del producto
 *       400:
 *         description: Error al obtener los detalles del producto
 */

/**
 * @swagger
 * /api/product/update-product-details:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - nombre
 *               - categoriaId
 *               - precio
 *               - stock
 *             properties:
 *               productId:
 *                 type: string
 *               nombre:
 *                 type: string
 *               categoriaId:
 *                 type: string
 *               subCategoriaId:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *                 format: float
 *               stock:
 *                 type: integer
 *               imagen:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /api/product/delete-product:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       400:
 *         description: Error al eliminar el producto
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /api/product/search-product:
 *   post:
 *     summary: Buscar productos
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resultados de búsqueda de productos
 *       400:
 *         description: Error en la búsqueda de productos
 */