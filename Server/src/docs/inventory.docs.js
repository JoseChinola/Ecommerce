/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Endpoints relacionados con la gestión de inventario
 */

/**
 * @swagger
 * /api/inventory/create:
 *   post:
 *     summary: Crear un nuevo producto en el inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - warehouseId
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               warehouseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto añadido correctamente al inventario
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/inventory/get:
 *   get:
 *     summary: Obtener detalles del inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalles del inventario
 *       400:
 *         description: Error al obtener el inventario
 */

/**
 * @swagger
 * /api/inventory/update:
 *   put:
 *     summary: Actualizar la cantidad de un producto en el inventario
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - warehouseId
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               warehouseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente en el inventario
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado
 */